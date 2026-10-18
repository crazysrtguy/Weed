// Automatic prize payouts: a crash-safe state machine. No I/O here: the host passes in `db` and `chain`, so the exact same logic
// runs under Node tests and in the Deno edge function.
//
// Money safety rules this file enforces (each one is tested in tests/payout.test.mjs):
//  - A payout row is paid at most once. Its transaction signature is saved BEFORE the transaction is broadcast, so a crash can never
//    cause a blind re-send: on the next run we look the signature up and only re-create the payment if the old transaction can
//    never land (its blockhash expired and the network does not know it).
//  - Hard caps independent of the database contents: max per payout, max per 24 hours, max per run, max attempts per payout.
//  - Only one run at a time (a lock), and rows are claimed atomically.
export const LIMITS={maxEachRaw:5_000_000_000,dailyCapRaw:20_000_000_000,batch:10,maxAttempts:5,lockSecs:90,finalizeWaitMs:45000};

export async function runPayouts({db,chain,limits=LIMITS,log=()=>{},sleep=(ms)=>new Promise(r=>setTimeout(r,ms)),now=()=>Date.now()}){
  const out={reconciled:0,paid:0,requeued:0,failed:0,deferred:0,skipped:null};
  if(!await db.lock(limits.lockSecs)){out.skipped='locked';return out;}

  // 1) Settle the fate of anything already broadcast (or prepared and possibly lost on a crash).
  for(const r of await db.listSending()){
    const st=await chain.status(r.signature);
    if(st==='finalized'){await db.markPaid(r.id,r.signature);out.reconciled++;continue;}
    if(st==='failed'){await db.requeue(r.id,'transaction failed on chain',limits.maxAttempts);out.requeued++;continue;}
    if(st===null&&await chain.expired(r.last_valid_height)){await db.requeue(r.id,'blockhash expired before landing',limits.maxAttempts);out.requeued++;continue;}
    // otherwise still in flight: leave it alone. NEVER re-send while the first one could still land.
  }

  // 2) Pay what is due, within the daily budget.
  let budget=limits.dailyCapRaw-await db.spentLast24h();
  for(const r of await db.claim(limits.batch)){
    const amt=Number(r.amount_raw);
    if(!(amt>0)||amt>limits.maxEachRaw||r.asset!=='token'||!chain.validWallet(r.wallet)){await db.fail(r.id,'rejected by payout limits');out.failed++;continue;}
    if(amt>budget){await db.release(r.id);out.deferred++;continue;}
    let prep;
    try{prep=await chain.prepare(r);}catch(e){await db.release(r.id);log('prepare failed',r.id);out.deferred++;continue;}
    await db.markSending(r.id,prep.signature,prep.lastValidHeight);     // persisted BEFORE broadcast
    budget-=amt;
    try{await chain.send(prep.raw);}catch(e){log('send error (will reconcile next run)',r.id);continue;}
    const end=now()+limits.finalizeWaitMs;
    while(now()<end){const st=await chain.status(prep.signature);if(st==='finalized'){await db.markPaid(r.id,prep.signature);out.paid++;break;}if(st==='failed')break;await sleep(2500);}
  }
  return out;
}

// ---------- Health: is the prize pool funded, are payouts stuck or failing? Never allowed to break a payout run. ----------
export const HEALTH={cushionRaw:1_000_000_000,minLamports:20_000_000,stuckMinutes:30,alertEveryMin:60};
const tok=(raw)=>(Number(raw)/1e6).toLocaleString('en-US',{maximumFractionDigits:2});
export async function runHealth({db,chain,notify,h=HEALTH,now=()=>new Date().toISOString()}){
  const s=await db.stats(),b=await chain.balances(),problems=[];
  if(s.failed_count>0)problems.push(['failed',`${s.failed_count} prize payout(s) FAILED and need a human look (select * from hs_payouts where status='failed').`]);
  if(s.oldest_due_min!=null&&s.oldest_due_min>h.stuckMinutes)problems.push(['stuck',`The oldest unpaid prize has been waiting ${s.oldest_due_min} minutes.`]);
  if(b.tokenRaw<Number(s.owed_raw)+h.cushionRaw)problems.push(['pool_low',`Prize pool is low: hot wallet holds ${tok(b.tokenRaw)} tokens, ${tok(s.owed_raw)} owed (keep at least ${tok(h.cushionRaw)} extra). Top it up.`]);
  if(b.lamports<h.minLamports)problems.push(['fees_low',`Hot wallet fee balance is low: ${(b.lamports/1e9).toFixed(4)} SOL.`]);
  await db.saveHealth({...s,tokenRaw:b.tokenRaw,lamports:b.lamports,problems:problems.map(p=>p[0]),at:now()});
  const sent=[];
  for(const [kind,msg] of problems){if(await db.alertGate(kind,h.alertEveryMin)){try{await notify(`[High Stakes] ${msg}`);sent.push(kind);}catch{}}}
  return{problems:problems.map(p=>p[0]),alerted:sent};
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {runPayouts,runHealth,LIMITS,HEALTH} from '../payout-core.mjs';

const MIL=1_000_000,fast={...LIMITS,finalizeWaitMs:30};
const nosleep=async()=>{};
function mem(rows){
 const t=new Map(rows.map(r=>[r.id,{status:'due',attempts:0,signature:null,last_valid_height:null,asset:'token',wallet:'W'.repeat(40),...r}]));let locked=false;
 return{t,unlock(){locked=false;},
  async lock(){if(locked)return false;locked=true;return true;},
  async listSending(){return[...t.values()].filter(r=>r.status==='sending').map(r=>({...r}));},
  async markPaid(id,sig){const r=t.get(id);if(r.status==='paid')throw new Error('double paid');r.status='paid';r.signature=sig;},
  async requeue(id,why,max){const r=t.get(id);r.signature=null;r.status=r.attempts>=max?'failed':'due';r.error=why;},
  async claim(n){const c=[...t.values()].filter(r=>r.status==='due').slice(0,n);for(const r of c){r.status='claimed';r.attempts++;}return c.map(r=>({...r}));},
  async markSending(id,sig,lvh){const r=t.get(id);r.status='sending';r.signature=sig;r.last_valid_height=lvh;},
  async release(id){const r=t.get(id);r.status='due';r.attempts--;},
  async fail(id,why){const r=t.get(id);r.status='failed';r.error=why;},
  async spentLast24h(){return[...t.values()].filter(r=>r.status==='paid'||r.status==='sending').reduce((n,r)=>n+Number(r.amount_raw),0);}};
}
function fakeChain(){
 const c={sent:[],finalized:new Set(),height:100,n:0,fail:false,autoFinal:false,
  validWallet:w=>w!=='BAD',
  async prepare(r){c.n++;const signature=`SIG${c.n}-${r.id}`;return{signature,raw:signature,lastValidHeight:150};},
  async send(raw){if(c.fail)throw new Error('rpc down');c.sent.push(raw);if(c.autoFinal)c.finalized.add(raw);},
  async status(sig){return c.finalized.has(sig)?'finalized':null;},
  async expired(h){return c.height>h;}};
 return c;
}
const run=(db,ch,limits=fast)=>runPayouts({db,chain:ch,limits,sleep:nosleep});

test('pays each due row once; a second run does nothing',async()=>{
 const db=mem([{id:'a',amount_raw:500*MIL},{id:'b',amount_raw:250*MIL}]),ch=fakeChain();ch.autoFinal=true;
 let r=await run(db,ch);
 assert.equal(r.paid,2);assert.equal(ch.sent.length,2);assert.deepEqual([...db.t.values()].map(x=>x.status),['paid','paid']);
 db.unlock();r=await run(db,ch);assert.equal(r.paid,0);assert.equal(ch.sent.length,2,'no re-send');
});

test('only one run at a time (lock)',async()=>{
 const db=mem([{id:'a',amount_raw:MIL}]),ch=fakeChain();ch.autoFinal=true;
 await run(db,ch);
 assert.equal((await run(db,ch)).skipped,'locked');
});

test('crash after saving the signature but before broadcast: never re-sent while it could still land',async()=>{
 const db=mem([{id:'a',amount_raw:MIL}]),ch=fakeChain();ch.fail=true;                       // broadcast fails (crash/outage)
 await run(db,ch);
 const row=db.t.get('a');assert.equal(row.status,'sending');assert.ok(row.signature);assert.equal(ch.sent.length,0);
 ch.fail=false;db.unlock();                                                                   // network back; blockhash still valid; tx unknown
 await run(db,ch);
 assert.equal(db.t.get('a').status,'sending','still waiting, NOT re-created');assert.equal(ch.sent.length,0,'no second broadcast');
 ch.height=200;ch.autoFinal=true;db.unlock();                                                 // blockhash expired: the old tx can never land
 await run(db,ch);
 assert.equal(ch.sent.length,1,'exactly one new broadcast');assert.equal(db.t.get('a').attempts,2);assert.equal(db.t.get('a').status,'paid');
});

test('if the "lost" transaction actually landed, it is marked paid and never sent again',async()=>{
 const db=mem([{id:'a',amount_raw:MIL}]),ch=fakeChain();ch.fail=true;
 await run(db,ch);
 ch.finalized.add(db.t.get('a').signature);ch.fail=false;db.unlock();
 const r=await run(db,ch);
 assert.equal(r.reconciled,1);assert.equal(db.t.get('a').status,'paid');assert.equal(ch.sent.length,0);
});

test('hard limits: over the per-payout cap, bad wallet, wrong asset or zero are rejected without sending',async()=>{
 const db=mem([{id:'big',amount_raw:LIMITS.maxEachRaw+1},{id:'bad',amount_raw:MIL,wallet:'BAD'},{id:'sol',amount_raw:MIL,asset:'sol'},{id:'zero',amount_raw:0}]),ch=fakeChain();
 const r=await run(db,ch);
 assert.equal(r.failed,4);assert.equal(ch.sent.length,0);
});

test('daily cap: payouts beyond the 24h budget wait, the cap is never exceeded',async()=>{
 const lim={...fast,dailyCapRaw:700*MIL},db=mem([{id:'a',amount_raw:500*MIL},{id:'b',amount_raw:250*MIL},{id:'c',amount_raw:100*MIL}]),ch=fakeChain();ch.autoFinal=true;
 const r=await run(db,ch,lim);
 assert.equal(r.paid,2);assert.equal(r.deferred,1);
 const total=[...db.t.values()].filter(x=>x.status==='paid').reduce((n,x)=>n+x.amount_raw,0);assert.ok(total<=700*MIL);
 assert.equal([...db.t.values()].filter(x=>x.status==='due').length,1);
});

test('a payout that keeps failing stops after max attempts instead of looping forever',async()=>{
 const db=mem([{id:'a',amount_raw:MIL}]),ch=fakeChain();
 for(let i=0;i<LIMITS.maxAttempts+2;i++){ch.fail=true;db.unlock();await run(db,ch);ch.height+=100;}
 assert.equal(db.t.get('a').status,'failed');
});

test('a prepare error never leaves a row stuck or sends anything',async()=>{
 const db=mem([{id:'a',amount_raw:MIL}]),ch=fakeChain();ch.prepare=async()=>{throw new Error('rpc');};
 await run(db,ch);assert.equal(db.t.get('a').status,'due');assert.equal(ch.sent.length,0);
});

function healthEnv({stats,bal}){
 const sent=[],gates=new Map(),saved=[];
 return{sent,saved,
  db:{async stats(){return stats;},async saveHealth(d){saved.push(d);},async alertGate(k){if(gates.get(k))return false;gates.set(k,true);return true;}},
  chain:{async balances(){return bal;}},
  notify:async t=>{sent.push(t);}};
}
const OK_STATS={failed_count:0,due_count:0,oldest_due_min:null,owed_raw:0};

test('health: a funded pool and no failures raises no alerts but is recorded',async()=>{
 const e=healthEnv({stats:OK_STATS,bal:{tokenRaw:5000*MIL,lamports:100_000_000}});
 const r=await runHealth(e);assert.deepEqual(r.problems,[]);assert.equal(e.sent.length,0);assert.equal(e.saved.length,1);
});

test('health: low pool, low fees, failed and stuck payouts each alert, once per window',async()=>{
 const e=healthEnv({stats:{failed_count:2,due_count:3,oldest_due_min:45,owed_raw:900*MIL},bal:{tokenRaw:1000*MIL,lamports:1_000_000}});
 let r=await runHealth(e);
 assert.deepEqual(r.problems.sort(),['failed','fees_low','pool_low','stuck']);assert.equal(e.sent.length,4);
 assert.ok(e.sent.every(m=>m.startsWith('[High Stakes]')));
 r=await runHealth(e);assert.equal(e.sent.length,4,'no repeat alerts inside the window');
});

test('health: the pool must cover what is owed PLUS a cushion',async()=>{
 const low=healthEnv({stats:{...OK_STATS,owed_raw:1000*MIL},bal:{tokenRaw:1500*MIL,lamports:100_000_000}});
 assert.deepEqual((await runHealth(low)).problems,['pool_low']);
 const fine=healthEnv({stats:{...OK_STATS,owed_raw:1000*MIL},bal:{tokenRaw:2001*MIL,lamports:100_000_000}});
 assert.deepEqual((await runHealth(fine)).problems,[]);
 assert.equal(HEALTH.cushionRaw,1000*MIL);
});

test('health: a webhook failure never throws',async()=>{
 const e=healthEnv({stats:{...OK_STATS,failed_count:1},bal:{tokenRaw:5000*MIL,lamports:100_000_000}});e.notify=async()=>{throw new Error('webhook down');};
 const r=await runHealth(e);assert.deepEqual(r.problems,['failed']);assert.deepEqual(r.alerted,[]);
});

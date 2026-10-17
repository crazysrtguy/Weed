// LIVE tournament test: real Supabase + real Solana devnet. Part 1 (this script) sets up players, scores, links wallets by sending,
// and checks eligibility. Part 2 (manual): run hs_week_winners in the Supabase SQL editor, feed the JSON to payout.mjs, then run
// `node live-tournament.mjs verify` to confirm the prizes arrived on chain.
// Usage: node live-tournament.mjs            (part 1)
//        node live-tournament.mjs verify     (after payout)
import fs from 'node:fs';
import path from 'node:path';
import {Keypair,SystemProgram,Transaction,sendAndConfirmTransaction} from '@solana/web3.js';
import {connection,loadOrCreateKeypair,readConfig,pk,rpcUrl,keysDir} from './lib.mjs';
import {solToLamports,tokenBalanceRaw,lamportsBalance} from '../chain.mjs';
import * as E from '../engine.mjs';
import * as L from '../league.mjs';
import {CONFIG} from '../cloud-config.mjs';

const cfg=readConfig(),treasury=pk(cfg.treasuryOwner),authority=loadOrCreateKeypair('authority');
const stateFile=path.join(keysDir,'tournament-run.json');
let failed=0;const check=(n,ok,x='')=>{console.log(`${ok?'PASS':'FAIL'}  ${n}${x?'  '+x:''}`);if(!ok)failed++;};

if(process.argv[2]==='verify'){
  const run=JSON.parse(fs.readFileSync(stateFile,'utf8'));
  for(const [name,want] of Object.entries(run.expectPrize)){
    const have=Number(await tokenBalanceRaw(rpcUrl,run.wallets[name].pub,cfg.mint))/10**cfg.decimals;
    check(`${name} wallet holds the expected prize on chain`,have===want,`${have} ${cfg.symbol} (expected ${want})`);
  }
  for(const name of run.expectNone){
    const have=Number(await tokenBalanceRaw(rpcUrl,run.wallets[name].pub,cfg.mint))/10**cfg.decimals;
    check(`${name} (ineligible) received nothing`,have===0,`${have}`);
  }
  console.log(failed?`\n${failed} FAILED`:'\nPrizes verified on chain.');process.exit(failed?1:0);
}

const H=t=>({'content-type':'application/json',apikey:CONFIG.anonKey,...(t?{authorization:'Bearer '+t}:{})});
const signUp=async()=>{const j=await(await fetch(`${CONFIG.url}/auth/v1/signup`,{method:'POST',headers:H(),body:'{}'})).json();if(!j.access_token)throw new Error('sign-in failed');return j.access_token;};
const api=async(t,body)=>{const r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(t),body:JSON.stringify(body)});return{status:r.status,body:await r.json().catch(()=>({}))};};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitPaid(t,id,secs=150){const end=Date.now()+secs*1000;let last;while(Date.now()<end){await sleep(5000);last=await api(t,{op:'orderCheck',id});if(last.body.paid)return last;}return last;}
const names={A:'Tourney Alpha',B:'Tourney Bravo',C:'Tourney Charlie',D:'Tourney Delta'};

// fresh wallets (throwaway) funded from the devnet authority
const W={};for(const k of ['A','B','C','E'])W[k]=Keypair.generate();
for(const k of Object.keys(W)){await sendAndConfirmTransaction(connection,new Transaction().add(SystemProgram.transfer({fromPubkey:authority.publicKey,toPubkey:W[k].publicKey,lamports:solToLamports(0.01)})),[authority]);}
console.log('Funded 4 throwaway wallets.');

const U={};for(const k of ['A','B','C','D','E'])U[k]=await signUp();
const fresh=E.fresh(Date.now());
for(const k of ['A','B','D','E']){const r=await api(U[k],{op:'import',state:fresh});if(r.status!==200)throw new Error('import '+k+' '+JSON.stringify(r.body));}
// C imports a played save (real progress) -> allowed, but never prize-eligible
const played=E.fresh(Date.now());played.sold=2000;played.harvests=6;played.tut=6;played.jars=24;played.stock={...played.stock,'midnight-purple':24};
check('C: importing a played save is accepted',(await api(U.C,{op:'import',state:played})).status===200);
for(const k of ['A','B','C','D'])await api(U[k],{op:'setName',name:names[k]});

const play=async(k,orders)=>{
  const acts=[{t:'harvest',a:[0]},{t:'harvest',a:[1]},...orders.map(o=>({t:'sell',a:[o]}))];
  if(k==='C')acts.splice(0,2);
  const r=await api(U[k],{op:'act',actions:acts});return r.body.score?.points;
};
const pts={A:await play('A',['tony','rick']),B:await play('B',['tony']),C:await play('C',['tony','bryce']),D:await play('D',['rick'])};
console.log('Points:',JSON.stringify(pts));
check('A scored more than B, B more than D',pts.A>pts.B&&pts.B>pts.D&&pts.D>0);
check('C (imported progress) scored the most but will be ineligible',pts.C>pts.A);

// eligibility BEFORE wallet link
let r=await api(U.A,{op:'load'});check('A: server-started save, no wallet yet -> not eligible (no-wallet)',r.body.prize.eligible===false&&r.body.prize.reasons.join()==='no-wallet');
r=await api(U.C,{op:'load'});check('C: imported with progress -> reasons include imported',r.body.prize.reasons.includes('imported'));

// link wallets BY SENDING 0.001 SOL from each player's own wallet
const link=async(k,kp)=>{
  const o=(await api(U[k],{op:'orderCreate',item:'link',method:'sol'})).body.order;
  if(o.amountRaw!==1_000_000)throw new Error('link price wrong');
  const ix=SystemProgram.transfer({fromPubkey:kp.publicKey,toPubkey:treasury,lamports:1_000_000});ix.keys.push({pubkey:pk(o.reference),isSigner:false,isWritable:false});
  await sendAndConfirmTransaction(connection,new Transaction().add(ix),[kp],{commitment:'finalized'});
  return waitPaid(U[k],o.id);
};
const linked={};
for(const k of ['A','B','C'])linked[k]=await link(k,W[k]);
check('A, B, C linked their wallets by sending',['A','B','C'].every(k=>linked[k].body.paid===true));
// E tries to link A's wallet: send from W.A again using E's order -> must NOT apply (wallet already belongs to A)
{
  const o=(await api(U.E,{op:'orderCreate',item:'link',method:'sol'})).body.order;
  const ix=SystemProgram.transfer({fromPubkey:W.A.publicKey,toPubkey:treasury,lamports:1_000_000});ix.keys.push({pubkey:pk(o.reference),isSigner:false,isWritable:false});
  await sendAndConfirmTransaction(connection,new Transaction().add(ix),[W.A],{commitment:'finalized'});
  await sleep(8000);const x=await api(U.E,{op:'orderCheck',id:o.id});
  check("E cannot link a wallet that already belongs to A (one wallet = one account)",x.body.paid===false,x.body.reason||'');
  const e=await api(U.E,{op:'load'});check('E stays without a wallet',e.body.prize.reasons.includes('no-wallet'));
}
r=await api(U.A,{op:'load'});check('A: now prize-eligible with a shortened wallet shown',r.body.prize.eligible===true&&r.body.prize.wallet===W.A.publicKey.toBase58().slice(0,4)+'…'+W.A.publicKey.toBase58().slice(-4));
r=await api(U.B,{op:'load'});check('B: prize-eligible',r.body.prize.eligible===true);
r=await api(U.C,{op:'load'});check('C: still NOT eligible (imported) even with a wallet',r.body.prize.eligible===false&&r.body.prize.reasons.join()==='imported');
r=await api(U.D,{op:'load'});check('D: not eligible (no wallet)',r.body.prize.eligible===false);
r=await api(U.A,{op:'league'});check('league payload shows prize status to the player',r.body.prize.eligible===true);

const week=L.weekId(Date.now());
fs.writeFileSync(stateFile,JSON.stringify({week,wallets:Object.fromEntries(Object.entries(W).map(([k,v])=>[k,{pub:v.publicKey.toBase58()}])),
  expectPrize:{A:L.prizeFor('garage',1),B:L.prizeFor('garage',2)},expectNone:['C','E'],users:names,points:pts},null,1));
console.log(`\nWeek ${week}. Expected winners (garage): 1) ${names.A} ${W.A.publicKey.toBase58()}  2) ${names.B} ${W.B.publicKey.toBase58()}`);
console.log('Expected NOT to win: Charlie (imported, warehouse), Delta (no wallet), Echo (no wallet).');
console.log(failed?`\n${failed} check(s) FAILED`:'\nPart 1 passed. Now run in the SQL editor:  select public.hs_week_winners('+week+',true);');
process.exit(failed?1:0);

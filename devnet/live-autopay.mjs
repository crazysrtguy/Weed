// LIVE test of the automatic payout engine on real Solana devnet (payout-core + payout-chain with the real hot wallet), using an in-memory ledger.
// Proves: winners get paid on chain, re-running pays nothing twice, and a crash right after broadcasting is reconciled WITHOUT a second payment.
// Usage: node live-autopay.mjs
import * as web3 from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import {loadOrCreateKeypair,readConfig,rpcUrl} from './lib.mjs';
import {tokenBalanceRaw} from '../chain.mjs';
import {runPayouts,LIMITS} from '../payout-core.mjs';
import {makeChain} from '../payout-chain.mjs';

const cfg=readConfig(),hot=loadOrCreateKeypair('hot-payout');
let failed=0;const check=(n,ok,x='')=>{console.log(`${ok?'PASS':'FAIL'}  ${n}${x?'  '+x:''}`);if(!ok)failed++;};
const chain=makeChain({web3,spl,rpcUrl,hotSecret:Array.from(hot.secretKey),mint:cfg.mint,expectedWallet:cfg.payoutWallet,decimals:cfg.decimals});
const bal=async w=>Number(await tokenBalanceRaw(rpcUrl,w,cfg.mint))/10**cfg.decimals;
const MIL=1_000_000,W=[0,1,2,3].map(()=>web3.Keypair.generate().publicKey.toBase58());

function mem(rows){
  const t=new Map(rows.map(r=>[r.id,{status:'due',attempts:0,signature:null,last_valid_height:null,asset:'token',...r}]));let locked=false;
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
const lim={...LIMITS,finalizeWaitMs:120000};
console.log('Hot payout wallet:',chain.hotAddress,'| token balance',await bal(chain.hotAddress));

// 1) normal payout of two prizes (one winner has no token account yet) + one invalid wallet
const db=mem([{id:'t-1',wallet:W[0],amount_raw:500*MIL},{id:'t-2',wallet:W[1],amount_raw:250*MIL},{id:'t-bad',wallet:'not-a-wallet',amount_raw:MIL}]);
let r=await runPayouts({db,chain,limits:lim});
check('two prizes paid, invalid wallet rejected',r.paid===2&&r.failed===1,JSON.stringify(r));
check('winner 1 holds exactly 500 on chain',await bal(W[0])===500);
check('winner 2 holds exactly 250 on chain',await bal(W[1])===250);
db.unlock();r=await runPayouts({db,chain,limits:lim});
check('re-running pays nothing again',r.paid===0&&await bal(W[0])===500&&await bal(W[1])===250);

// 2) crash right AFTER broadcasting (before the ledger learns it landed)
const db2=mem([{id:'c-1',wallet:W[2],amount_raw:100*MIL}]);
const realSend=chain.send.bind(chain);
chain.send=async raw=>{await realSend(raw);throw new Error('simulated crash after broadcast');};
r=await runPayouts({db:db2,chain,limits:lim});
check('crash after broadcast leaves the row "sending" with its signature saved',db2.t.get('c-1').status==='sending'&&!!db2.t.get('c-1').signature);
chain.send=realSend;
// wait for finality, then the next run must reconcile (NOT re-send)
const end=Date.now()+120000;while(Date.now()<end&&await chain.status(db2.t.get('c-1').signature)!=='finalized')await new Promise(r=>setTimeout(r,3000));
let sends=0;chain.send=async raw=>{sends++;return realSend(raw);};
db2.unlock();r=await runPayouts({db:db2,chain,limits:lim});
check('next run reconciles it as paid with ZERO new broadcasts',r.reconciled===1&&sends===0&&db2.t.get('c-1').status==='paid');
check('winner 3 holds exactly 100 on chain (paid once, not twice)',await bal(W[2])===100);

// 3) prepared but never broadcast (crash before send): not re-sent while blockhash is valid
const db3=mem([{id:'n-1',wallet:W[3],amount_raw:50*MIL}]);
chain.send=async()=>{throw new Error('rpc down');};
await runPayouts({db:db3,chain,limits:lim});
db3.unlock();sends=0;chain.send=async raw=>{sends++;return realSend(raw);};
r=await runPayouts({db:db3,chain,limits:lim});
check('unbroadcast payment waits (no blind re-send) while its blockhash is still valid',db3.t.get('n-1').status==='sending'&&sends===0&&await bal(W[3])===0);

console.log('Hot wallet balance now:',await bal(chain.hotAddress));
console.log(failed?`\n${failed} check(s) FAILED`:'\nAll live autopay checks passed.');
process.exit(failed?1:0);

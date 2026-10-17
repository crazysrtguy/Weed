// LIVE end-to-end purchase test: real Supabase function + real Solana DEVNET.
// Creates orders through the game server, pays them from the throwaway e2e-player wallet like a wallet app would,
// and checks that the server settles exactly when (and only when) the chain says so. Also tries the main attacks.
// Usage: node live-pay.mjs      (needs devnet SOL + HSTEST in the e2e-player wallet; see npm run faucet)
import {SystemProgram,Transaction,sendAndConfirmTransaction} from '@solana/web3.js';
import {createTransferCheckedInstruction,getAssociatedTokenAddressSync} from '@solana/spl-token';
import {connection,loadOrCreateKeypair,readConfig,pk,TP,rpcUrl} from './lib.mjs';
import {toRaw,solToLamports,lamportsBalance,tokenBalanceRaw} from '../chain.mjs';
import {CONFIG} from '../cloud-config.mjs';

let failed=0;const check=(n,ok,x='')=>{console.log(`${ok?'PASS':'FAIL'}  ${n}${x?'  '+x:''}`);if(!ok)failed++;};
const H=t=>({'content-type':'application/json',apikey:CONFIG.anonKey,...(t?{authorization:'Bearer '+t}:{})});
const signUp=async()=>{const j=await(await fetch(`${CONFIG.url}/auth/v1/signup`,{method:'POST',headers:H(),body:'{}'})).json();if(!j.access_token)throw new Error('sign-in failed');return j.access_token;};
const api=async(t,body)=>{const r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(t),body:JSON.stringify(body)});return{status:r.status,body:await r.json().catch(()=>({}))};};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// Poll the server until the order is paid (it only says yes once the payment is FINALIZED on devnet).
async function waitPaid(t,id,secs=150){const end=Date.now()+secs*1000;let last;while(Date.now()<end){await sleep(5000);last=await api(t,{op:'orderCheck',id});if(last.body.paid)return last;}return last;}

const cfg=readConfig(),player=loadOrCreateKeypair('e2e-player'),treasury=pk(cfg.treasuryOwner);
const mint=pk(cfg.mint),playerAta=getAssociatedTokenAddressSync(mint,player.publicKey,false,TP);
const withRefs=(ix,refs)=>{for(const r of refs)ix.keys.push({pubkey:pk(r),isSigner:false,isWritable:false});return ix;};
const send=(ix)=>sendAndConfirmTransaction(connection,new Transaction().add(ix),[player],{commitment:'finalized'});
const paySol=(sol,refs)=>send(withRefs(SystemProgram.transfer({fromPubkey:player.publicKey,toPubkey:treasury,lamports:solToLamports(sol)}),refs));
const payTok=(ui,refs)=>send(withRefs(createTransferCheckedInstruction(playerAta,mint,pk(cfg.treasuryAta),player.publicKey,toRaw(ui,cfg.decimals),cfg.decimals,[],TP),refs));

console.log('Player wallet:',player.publicKey.toBase58());
const solHave=Number(await lamportsBalance(rpcUrl,player.publicKey.toBase58()))/1e9,tokHave=Number(await tokenBalanceRaw(rpcUrl,player.publicKey.toBase58(),cfg.mint))/10**cfg.decimals;
console.log(`Balance: ${solHave} SOL, ${tokHave} ${cfg.symbol}\n`);
if(solHave<0.2||tokHave<100){console.error('Need >= 0.2 SOL and >= 100 HSTEST in the e2e-player wallet. Run: npm run faucet -- '+player.publicKey.toBase58()+' 1000');process.exit(2);}

const A=await signUp(),B=await signUp();
let r=await api(A,{op:'orders'});
check('catalog served by the server with prices',r.status===200&&r.body.catalog.rack.sol===0.05&&r.body.treasury===cfg.treasuryOwner);

// 1) SOL order: unpaid -> underpaid -> correct
r=await api(A,{op:'orderCreate',item:'rack',method:'sol',amountRaw:1});
const O1=r.body.order;check('SOL order created at the SERVER price (client amount ignored)',r.status===200&&O1.amountRaw===50_000_000&&O1.reference.length>=32);
r=await api(A,{op:'orderCheck',id:O1.id});check('unpaid order is not paid',r.status===200&&r.body.paid===false,r.body.reason);
r=await api(B,{op:'orderCheck',id:O1.id});check("another player cannot check/settle A's order",r.status===404);
const sigLow=await paySol(0.01,[O1.reference]);await sleep(5000);
r=await api(A,{op:'orderCheck',id:O1.id});check('UNDERPAYMENT (0.01 of 0.05 SOL) is rejected',r.status===200&&r.body.paid===false,r.body.reason||'');
const sigOk=await paySol(0.05,[O1.reference]);console.log('   paid:',sigOk);
r=await waitPaid(A,O1.id);check('correct SOL payment settles after finalization',r.body.paid===true&&r.body.items?.includes('rack')&&r.body.order.signature===sigOk,`signature ${r.body.order?.signature?.slice(0,12)}…`);
r=await api(A,{op:'orderCheck',id:O1.id});check('re-checking a paid order is idempotent (still owned once)',r.body.paid===true&&r.body.items.filter(x=>x==='rack').length===1);
r=await api(A,{op:'orderCreate',item:'rack',method:'token'});check('cannot buy an item you already own',r.status===409);

// 2) Token order
r=await api(A,{op:'orderCreate',item:'lamp',method:'token'});const O2=r.body.order;
check('token order carries the exact mint and server price',O2.mint===cfg.mint&&O2.amountRaw===100_000_000);
const sigTok=await payTok(100,[O2.reference]);console.log('   paid:',sigTok);
r=await waitPaid(A,O2.id);check('HSTEST token payment settles',r.body.paid===true&&r.body.items?.includes('lamp'));

// 3) Wrong coin: pay a TOKEN order with SOL
r=await api(A,{op:'orderCreate',item:'bench',method:'token'});const O3=r.body.order;
await paySol(0.05,[O3.reference]);await sleep(5000);
r=await api(A,{op:'orderCheck',id:O3.id});check('paying a token order with SOL does NOT count',r.body.paid===false,r.body.reason||'');

// 4) Double-spend: ONE transaction listing TWO references must pay only ONE order
r=await api(A,{op:'orderCreate',item:'storage',method:'sol'});const O4=r.body.order;
r=await api(B,{op:'orderCreate',item:'storage',method:'sol'});const O5=r.body.order;   // a different player's order for the same item
await paySol(0.05,[O4.reference,O5.reference]);
const a=await waitPaid(A,O4.id,120);await sleep(4500);
const b=await api(B,{op:'orderCheck',id:O5.id});
check('one payment cannot settle two orders (shared signature)',(a.body.paid===true)!==(b.body.paid===true)||(a.body.paid&&!b.body.paid),`A paid=${a.body.paid}, B paid=${b.body.paid} ${b.body.reason||''}`);

console.log(failed?`\n${failed} check(s) FAILED`:'\nAll live payment checks passed.');
console.log("Cleanup SQL (test users/orders): delete from auth.users where is_anonymous;  -- cascades to orders and items");
process.exit(failed?1:0);

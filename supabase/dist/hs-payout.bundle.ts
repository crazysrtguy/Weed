// @ts-nocheck
import {createClient} from 'npm:@supabase/supabase-js@2';
import * as web3 from 'npm:@solana/web3.js@1.98.0';
import * as spl from 'npm:@solana/spl-token@0.4.9';
const chainLib=(()=>{
const TOKEN_PROGRAM='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';            // legacy SPL Token
const TOKEN_2022_PROGRAM='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';        // Token-2022 (token extensions)
const MEMO_PROGRAM='MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const DEVNET_RPC='https://api.devnet.solana.com';
const LAMPORTS_PER_SOL=1_000_000_000;
function assertDevnet(url){
const u=String(url||'');
if(!/devnet|localhost|127\.0\.0\.1/i.test(u)||/mainnet/i.test(u))throw new Error(`Refusing non-devnet RPC: ${u}`);
return u;
}
async function rpc(url,method,params=[],{retries=6}={}){
assertDevnet(url);
for(let attempt=0;;attempt++){
let j;
try{
const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});
if(res.status===429)throw Object.assign(new Error('rate limited'),{retry:true});
j=await res.json();
}catch(e){if(attempt<retries&&(e.retry||e.name==='TypeError')){await new Promise(r=>setTimeout(r,500*2**attempt));continue;}throw e;}
if(j.error){
if(attempt<retries&&/rate limit|too many|429/i.test(j.error.message)){await new Promise(r=>setTimeout(r,500*2**attempt));continue;}
throw new Error(`${method}: ${j.error.message}`);
}
return j.result;
}
}
async function solBalance(url,owner){return(await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value/LAMPORTS_PER_SOL;}
async function lamportsBalance(url,owner){return BigInt((await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value);}
/** Raw token amount (BigInt) the owner holds of `mint`, summed over their token accounts (works for Token and Token-2022). */
async function tokenBalanceRaw(url,owner,mint){
const r=await rpc(url,'getTokenAccountsByOwner',[owner,{mint},{encoding:'jsonParsed',commitment:'confirmed'}]);
return r.value.reduce((n,a)=>n+BigInt(a.account.data.parsed.info.tokenAmount.amount),0n);
}
const toUi=(raw,decimals)=>Number(raw)/10**decimals;
const toRaw=(ui,decimals)=>BigInt(Math.round(ui*10**decimals));
const solToLamports=sol=>BigInt(Math.round(sol*LAMPORTS_PER_SOL));
/** Wait until a signature reaches `commitment` (default finalized: cannot be rolled back). */
async function confirmSignature(url,signature,{commitment='finalized',timeoutMs=90000,intervalMs=1500}={}){
const want=commitment==='confirmed'?['confirmed','finalized']:['finalized'];
const end=Date.now()+timeoutMs;
while(Date.now()<end){
const r=await rpc(url,'getSignatureStatuses',[[signature],{searchTransactionHistory:true}]);
const s=r.value[0];
if(s){if(s.err)throw new Error('Transaction failed: '+JSON.stringify(s.err));if(want.includes(s.confirmationStatus))return s;}
await new Promise(r=>setTimeout(r,intervalMs));
}
throw new Error('Timed out waiting for confirmation');
}
const B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58(bytes){
let n=0n;for(const b of bytes)n=n*256n+BigInt(b);
let s='';while(n>0n){s=B58[Number(n%58n)]+s;n/=58n;}
for(const b of bytes){if(b===0)s='1'+s;else break;}
return s||'1';
}
/** A fresh one-time reference (32 random bytes as a base58 address) that ties one payment to one order. */
function newReference(){const b=new Uint8Array(32);globalThis.crypto.getRandomValues(b);return base58(b);}
const enc=encodeURIComponent;
/** Solana Pay transfer-request URL (what a wallet app opens). `splToken` omitted = native SOL. */
function solanaPayUrl({recipient,amount,splToken,reference,label,message,memo}){
const q=[`amount=${enc(String(amount))}`];
if(splToken)q.push(`spl-token=${enc(splToken)}`);
q.push(`reference=${enc(reference)}`);
if(label)q.push(`label=${enc(label)}`);
if(message)q.push(`message=${enc(message)}`);
if(memo)q.push(`memo=${enc(memo)}`);
return `solana:${recipient}?${q.join('&')}`;
}
const formatAmount=(raw,decimals)=>{const s=(Number(raw)/10**decimals).toFixed(decimals);return s.replace(/\.?0+$/,'')||'0';};
/**
* Decide, from one parsed transaction, whether it pays an order. Pure function (no network), so it is unit tested with
* crafted adversarial transactions. It checks balance CHANGES, not instruction shapes, so any wallet's way of sending works.
*   - the transaction succeeded
*   - the order's one-time `reference` is in the transaction as a non-signer account
*   - the treasury's balance rose by at least `minAmountRaw` (SOL: lamports of `treasuryOwner`; token: `mint` owned by `treasuryOwner`)
*   - a signer actually paid that amount (so `payer` is a real sender, used to link a wallet by sending)
*/
function evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint}){
if(!tx)return{ok:false,reason:'not found'};
if(tx.meta?.err)return{ok:false,reason:'transaction failed'};
const keys=tx.transaction.message.accountKeys.map(k=>typeof k==='string'?{pubkey:k,signer:false}:k);
const ref=keys.find(k=>k.pubkey===reference);
if(!ref)return{ok:false,reason:'reference not in transaction'};
if(ref.signer)return{ok:false,reason:'reference must not be a signer'};
const min=BigInt(minAmountRaw);if(min<=0n)return{ok:false,reason:'invalid required amount'};
const m=tx.meta;let received=0n,payer=null;
if(method==='sol'){
const t=keys.findIndex(k=>k.pubkey===treasuryOwner);
if(t<0)return{ok:false,reason:'treasury not in transaction'};
received=BigInt(m.postBalances[t])-BigInt(m.preBalances[t]);
let worst=0n;
keys.forEach((k,i)=>{if(!k.signer)return;const d=BigInt(m.postBalances[i])-BigInt(m.preBalances[i]);if(d<worst&&-d>=min){worst=d;payer=k.pubkey;}});
}else{
if(!mint)return{ok:false,reason:'mint required'};
const sum=(list,owner)=>(list||[]).filter(b=>b.mint===mint&&(owner?b.owner===owner:true));
const amt=b=>BigInt(b.uiTokenAmount.amount);
const after=sum(m.postTokenBalances,treasuryOwner).reduce((n,b)=>n+amt(b),0n),before=sum(m.preTokenBalances,treasuryOwner).reduce((n,b)=>n+amt(b),0n);
received=after-before;
const owners=new Set(sum(m.preTokenBalances).map(b=>b.owner));
for(const o of owners){
if(o===treasuryOwner)continue;
const a=sum(m.postTokenBalances,o).reduce((n,b)=>n+amt(b),0n),b0=sum(m.preTokenBalances,o).reduce((n,b)=>n+amt(b),0n);
if(b0-a>=min){payer=o;break;}
}
}
if(received<min)return{ok:false,reason:`treasury received ${received} but ${min} required`};
if(!payer)return{ok:false,reason:'no signer paid this amount'};
return{ok:true,method,amountRaw:received,payer,slot:tx.slot};
}
/** Look for a payment for one order by its reference. Only counts transactions at `commitment` (default finalized). */
async function findPayment(url,{method,reference,treasuryOwner,minAmountRaw,mint,commitment='finalized'}){
const sigs=await rpc(url,'getSignaturesForAddress',[reference,{limit:20,commitment}]);
for(const s of sigs){
if(s.err)continue;
const tx=await rpc(url,'getTransaction',[s.signature,{encoding:'jsonParsed',maxSupportedTransactionVersion:0,commitment}]);
const r=evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint});
if(r.ok)return{...r,signature:s.signature};
}
return{ok:false,reason:sigs.length?'no transaction paid enough':'no payment yet'};
}
return {DEVNET_RPC,LAMPORTS_PER_SOL,MEMO_PROGRAM,TOKEN_2022_PROGRAM,TOKEN_PROGRAM,assertDevnet,base58,confirmSignature,evaluatePayment,findPayment,formatAmount,lamportsBalance,newReference,rpc,solBalance,solToLamports,solanaPayUrl,toRaw,toUi,tokenBalanceRaw};})();
const cfgNs=(()=>{
const PAY_CONFIG={
"cluster": "devnet",
"symbol": "HSTEST",
"decimals": 6,
"mint": "C8ubGCMojFyrQ7qCR2iDDzsPRu9XnfAjDStZiJoXgvEd",
"treasuryOwner": "Cpwe9TrAWuCSSvyYgqHfLnSCnRiM6eGjmUL2zAZq9X42",
"payoutWallet": "6vGH7fMhGN1HafPvEgnkXwWwjCnUL9fREp1b5rU1h8ab",
"items": {
"rack": {
"token": 150,
"sol": 0.05
},
"lamp": {
"token": 100,
"sol": 0.03
},
"bench": {
"token": 200,
"sol": 0.07
},
"storage": {
"token": 150,
"sol": 0.05
},
"link": {
"sol": 0.001
}
}
};
return {PAY_CONFIG};})();
const {PAY_CONFIG}=cfgNs;
const coreNs=(()=>{
const LIMITS={maxEachRaw:5_000_000_000,dailyCapRaw:20_000_000_000,batch:10,maxAttempts:5,lockSecs:90,finalizeWaitMs:45000};
async function runPayouts({db,chain,limits=LIMITS,log=()=>{},sleep=(ms)=>new Promise(r=>setTimeout(r,ms)),now=()=>Date.now()}){
const out={reconciled:0,paid:0,requeued:0,failed:0,deferred:0,skipped:null};
if(!await db.lock(limits.lockSecs)){out.skipped='locked';return out;}
for(const r of await db.listSending()){
const st=await chain.status(r.signature);
if(st==='finalized'){await db.markPaid(r.id,r.signature);out.reconciled++;continue;}
if(st==='failed'){await db.requeue(r.id,'transaction failed on chain',limits.maxAttempts);out.requeued++;continue;}
if(st===null&&await chain.expired(r.last_valid_height)){await db.requeue(r.id,'blockhash expired before landing',limits.maxAttempts);out.requeued++;continue;}
}
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
return {LIMITS,runPayouts};})();
const {runPayouts}=coreNs;
const pchainNs=(()=>{const {assertDevnet,base58}=chainLib;
function makeChain({web3,spl,rpcUrl,hotSecret,mint,expectedWallet,decimals}){
const {Connection,Keypair,PublicKey,Transaction}=web3;
assertDevnet(rpcUrl);
const hot=Keypair.fromSecretKey(Uint8Array.from(hotSecret));
if(hot.publicKey.toBase58()!==expectedWallet)throw new Error('payout key does not match the configured payout wallet');
const conn=new Connection(rpcUrl,'confirmed'),mintPk=new PublicKey(mint),TP=spl.TOKEN_2022_PROGRAM_ID;
const srcAta=spl.getAssociatedTokenAddressSync(mintPk,hot.publicKey,false,TP);
return{
hotAddress:hot.publicKey.toBase58(),
validWallet(w){try{const k=new PublicKey(w);return PublicKey.isOnCurve(k.toBytes())&&k.toBase58()===w;}catch{return false;}},
/** Build + sign. The signature is known BEFORE sending, so the caller can save it first. Creates the winner's token account if missing. */
async prepare(row){
const dest=new PublicKey(row.wallet),destAta=spl.getAssociatedTokenAddressSync(mintPk,dest,false,TP);
const {blockhash,lastValidBlockHeight}=await conn.getLatestBlockhash('finalized');
const tx=new Transaction({feePayer:hot.publicKey,blockhash,lastValidBlockHeight})
.add(spl.createAssociatedTokenAccountIdempotentInstruction(hot.publicKey,destAta,dest,mintPk,TP))
.add(spl.createTransferCheckedInstruction(srcAta,mintPk,destAta,hot.publicKey,BigInt(row.amount_raw),decimals,[],TP));
tx.sign(hot);
return{signature:base58(tx.signature),raw:tx.serialize().toString('base64'),lastValidHeight:lastValidBlockHeight};
},
async send(rawB64){return conn.sendRawTransaction(Uint8Array.from(atob(rawB64),c=>c.charCodeAt(0)),{skipPreflight:false,maxRetries:3});},
/** 'finalized' | 'failed' | 'pending' (seen, not final) | null (unknown to the network) */
async status(sig){
const r=await conn.getSignatureStatuses([sig],{searchTransactionHistory:true}),s=r.value[0];
if(!s)return null;if(s.err)return'failed';return s.confirmationStatus==='finalized'?'finalized':'pending';
},
async expired(lastValidHeight){return(await conn.getBlockHeight('finalized'))>Number(lastValidHeight);}
};
}
return {makeChain};})();
const {makeChain}=pchainNs;
const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const ok=async(p:any)=>{const{data,error}=await p;if(error)throw new Error(error.message);return data;};
const iso=()=>new Date().toISOString();
const db={
lock:async(s:number)=>(await ok(sb.rpc('hs_payout_lock',{p_secs:s})))===true,
listSending:async()=>await ok(sb.from('hs_payouts').select('*').eq('status','sending')),
markPaid:async(id:string,sig:string)=>{await ok(sb.from('hs_payouts').update({status:'paid',signature:sig,paid_at:iso(),error:null}).eq('id',id).in('status',['sending','claimed']));},
requeue:async(id:string,why:string,max:number)=>{
const r=await ok(sb.from('hs_payouts').select('attempts').eq('id',id).single());
await ok(sb.from('hs_payouts').update({status:r.attempts>=max?'failed':'due',signature:null,last_valid_height:null,error:why}).eq('id',id).eq('status','sending'));},
claim:async(n:number)=>await ok(sb.rpc('hs_claim_payouts',{p_limit:n})),
markSending:async(id:string,sig:string,lvh:number)=>{
const d=await ok(sb.from('hs_payouts').update({status:'sending',signature:sig,last_valid_height:lvh}).eq('id',id).eq('status','claimed').select('id'));
if(!d||d.length!==1)throw new Error('could not record signature; not sending');},
release:async(id:string)=>{const r=await ok(sb.from('hs_payouts').select('attempts').eq('id',id).single());
await ok(sb.from('hs_payouts').update({status:'due',attempts:Math.max(0,r.attempts-1)}).eq('id',id).eq('status','claimed'));},
fail:async(id:string,why:string)=>{await ok(sb.from('hs_payouts').update({status:'failed',error:why}).eq('id',id));},
spentLast24h:async()=>{
const since=new Date(Date.now()-864e5).toISOString();
const paid=await ok(sb.from('hs_payouts').select('amount_raw').eq('status','paid').gte('paid_at',since));
const inflight=await ok(sb.from('hs_payouts').select('amount_raw').eq('status','sending'));
return[...paid,...inflight].reduce((n:number,r:any)=>n+Number(r.amount_raw),0);}
};
Deno.serve(async(req)=>{
const out=(status:number,body:any)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
if(req.method!=='POST')return out(405,{error:'method'});
try{
const key=JSON.parse(Deno.env.get('HS_PAYOUT_KEY')||'null');
if(!Array.isArray(key)||key.length!==64)return out(503,{error:'payouts not configured'});
const chain=makeChain({web3,spl,rpcUrl:chainLib.assertDevnet(Deno.env.get('HS_RPC')||chainLib.DEVNET_RPC),hotSecret:key,mint:PAY_CONFIG.mint,expectedWallet:PAY_CONFIG.payoutWallet,decimals:PAY_CONFIG.decimals});
const r=await runPayouts({db,chain,log:(...a:any[])=>console.log(...a)});
return out(200,r);
}catch(e){console.error('payout error',(e as Error).message);return out(500,{error:'payout run failed'});}
});

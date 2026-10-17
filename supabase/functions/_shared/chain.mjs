// Zero-dependency Solana helpers shared by the browser and Node. DEVNET ONLY: every call refuses non-devnet RPC URLs.
// The game never connects to a wallet and never signs anything: players SEND SOL or the token to the treasury, and this
// module only READS the chain to confirm that a payment arrived.
export const TOKEN_PROGRAM='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';            // legacy SPL Token
export const TOKEN_2022_PROGRAM='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';        // Token-2022 (token extensions)
export const MEMO_PROGRAM='MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
export const DEVNET_RPC='https://api.devnet.solana.com';
export const LAMPORTS_PER_SOL=1_000_000_000;

export function assertDevnet(url){
  const u=String(url||'');
  if(!/devnet|localhost|127\.0\.0\.1/i.test(u)||/mainnet/i.test(u))throw new Error(`Refusing non-devnet RPC: ${u}`);
  return u;
}
export async function rpc(url,method,params=[],{retries=6}={}){
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
export async function solBalance(url,owner){return(await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value/LAMPORTS_PER_SOL;}
export async function lamportsBalance(url,owner){return BigInt((await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value);}
/** Raw token amount (BigInt) the owner holds of `mint`, summed over their token accounts (works for Token and Token-2022). */
export async function tokenBalanceRaw(url,owner,mint){
  const r=await rpc(url,'getTokenAccountsByOwner',[owner,{mint},{encoding:'jsonParsed',commitment:'confirmed'}]);
  return r.value.reduce((n,a)=>n+BigInt(a.account.data.parsed.info.tokenAmount.amount),0n);
}
export const toUi=(raw,decimals)=>Number(raw)/10**decimals;
export const toRaw=(ui,decimals)=>BigInt(Math.round(ui*10**decimals));
export const solToLamports=sol=>BigInt(Math.round(sol*LAMPORTS_PER_SOL));

/** Wait until a signature reaches `commitment` (default finalized: cannot be rolled back). */
export async function confirmSignature(url,signature,{commitment='finalized',timeoutMs=90000,intervalMs=1500}={}){
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

// ---------- Orders, references and payment links ----------
const B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function base58(bytes){
  let n=0n;for(const b of bytes)n=n*256n+BigInt(b);
  let s='';while(n>0n){s=B58[Number(n%58n)]+s;n/=58n;}
  for(const b of bytes){if(b===0)s='1'+s;else break;}
  return s||'1';
}
/** A fresh one-time reference (32 random bytes as a base58 address) that ties one payment to one order. */
export function newReference(){const b=new Uint8Array(32);globalThis.crypto.getRandomValues(b);return base58(b);}
const enc=encodeURIComponent;
/** Solana Pay transfer-request URL (what a wallet app opens). `splToken` omitted = native SOL. */
export function solanaPayUrl({recipient,amount,splToken,reference,label,message,memo}){
  const q=[`amount=${enc(String(amount))}`];
  if(splToken)q.push(`spl-token=${enc(splToken)}`);
  q.push(`reference=${enc(reference)}`);
  if(label)q.push(`label=${enc(label)}`);
  if(message)q.push(`message=${enc(message)}`);
  if(memo)q.push(`memo=${enc(memo)}`);
  return `solana:${recipient}?${q.join('&')}`;
}
export const formatAmount=(raw,decimals)=>{const s=(Number(raw)/10**decimals).toFixed(decimals);return s.replace(/\.?0+$/,'')||'0';};

/**
 * Decide, from one parsed transaction, whether it pays an order. Pure function (no network), so it is unit tested with
 * crafted adversarial transactions. It checks balance CHANGES, not instruction shapes, so any wallet's way of sending works.
 *   - the transaction succeeded
 *   - the order's one-time `reference` is in the transaction as a non-signer account
 *   - the treasury's balance rose by at least `minAmountRaw` (SOL: lamports of `treasuryOwner`; token: `mint` owned by `treasuryOwner`)
 *   - a signer actually paid that amount (so `payer` is a real sender, used to link a wallet by sending)
 */
export function evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint}){
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
export async function findPayment(url,{method,reference,treasuryOwner,minAmountRaw,mint,commitment='finalized'}){
  const sigs=await rpc(url,'getSignaturesForAddress',[reference,{limit:20,commitment}]);
  for(const s of sigs){
    if(s.err)continue;
    const tx=await rpc(url,'getTransaction',[s.signature,{encoding:'jsonParsed',maxSupportedTransactionVersion:0,commitment}]);
    const r=evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint});
    if(r.ok)return{...r,signature:s.signature};
  }
  return{ok:false,reason:sigs.length?'no transaction paid enough':'no payment yet'};
}

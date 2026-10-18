// deno-lint-ignore-file no-explicit-any
// High Stakes automatic payouts (DEVNET). Triggered on a schedule by the database (pg_cron + pg_net). It takes NO input:
// it only ever pays rows that the database itself created from finished league weeks, with hard caps and a crash-safe ledger.
// The hot payout wallet key lives ONLY in this function's secret HS_PAYOUT_KEY (a JSON array of 64 numbers). hs-api never sees it.
import {createClient} from 'npm:@supabase/supabase-js@2';
import * as web3 from 'npm:@solana/web3.js@1.98.0';
import * as spl from 'npm:@solana/spl-token@0.4.9';
import {runPayouts,runHealth} from '../_shared/payout-core.mjs';
import {makeChain} from '../_shared/payout-chain.mjs';
import * as chainLib from '../_shared/chain.mjs';
import {PAY_CONFIG} from '../_shared/pay-config.mjs';

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
 // MUST succeed before anything is broadcast: if the signature cannot be saved, we throw and send nothing.
 markSending:async(id:string,sig:string,lvh:number)=>{
  const d=await ok(sb.from('hs_payouts').update({status:'sending',signature:sig,last_valid_height:lvh}).eq('id',id).eq('status','claimed').select('id'));
  if(!d||d.length!==1)throw new Error('could not record signature; not sending');},
 release:async(id:string)=>{const r=await ok(sb.from('hs_payouts').select('attempts').eq('id',id).single());
  await ok(sb.from('hs_payouts').update({status:'due',attempts:Math.max(0,r.attempts-1)}).eq('id',id).eq('status','claimed'));},
 fail:async(id:string,why:string)=>{await ok(sb.from('hs_payouts').update({status:'failed',error:why}).eq('id',id));},
 stats:async()=>await ok(sb.rpc('hs_payout_stats')),
 saveHealth:async(d:any)=>{await ok(sb.from('hs_health').upsert({name:'payout',data:d,updated_at:iso()}));},
 alertGate:async(kind:string,mins:number)=>(await ok(sb.rpc('hs_alert_gate',{p_kind:kind,p_minutes:mins})))===true,
 spentLast24h:async()=>{
  const since=new Date(Date.now()-864e5).toISOString();
  const paid=await ok(sb.from('hs_payouts').select('amount_raw').eq('status','paid').gte('paid_at',since));
  const inflight=await ok(sb.from('hs_payouts').select('amount_raw').eq('status','sending'));
  return[...paid,...inflight].reduce((n:number,r:any)=>n+Number(r.amount_raw),0);}
};

// Alerts go to an optional webhook (Discord or Slack style). With no webhook they are only written to the function logs.
const notify=async(text:string)=>{
 const url=Deno.env.get('HS_ALERT_WEBHOOK');console.error('ALERT',text);
 if(url&&url.startsWith('https://'))await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({content:text,text})});
};

Deno.serve(async(req)=>{
 const out=(status:number,body:any)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
 if(req.method!=='POST')return out(405,{error:'method'});
 try{
  const key=JSON.parse(Deno.env.get('HS_PAYOUT_KEY')||'null');
  if(!Array.isArray(key)||key.length!==64)return out(503,{error:'payouts not configured'});
  const chain=makeChain({web3,spl,rpcUrl:chainLib.assertDevnet(Deno.env.get('HS_RPC')||chainLib.DEVNET_RPC),hotSecret:key,mint:PAY_CONFIG.mint,expectedWallet:PAY_CONFIG.payoutWallet,decimals:PAY_CONFIG.decimals});
  const r=await runPayouts({db,chain,log:(...a:any[])=>console.log(...a)});
  let health:any=null;
  try{health=await runHealth({db,chain,notify});}catch(e){console.error('health check failed',(e as Error).message);}
  return out(200,{...r,problems:health?.problems??null});
 }catch(e){console.error('payout error',(e as Error).message);return out(500,{error:'payout run failed'});}
});

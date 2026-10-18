// LIVE security probe against the REAL Supabase project, acting as an attacker with only the PUBLIC key and an anonymous account.
// Every write, every other-player read and every privileged function must be refused. Usage: node scripts/live-rls-test.mjs
import {CONFIG} from '../cloud-config.mjs';
let failed=0;const check=(n,ok,x='')=>{console.log(`${ok?'PASS':'FAIL'}  ${n}${x?'  '+x:''}`);if(!ok)failed++;};
const H=t=>({'content-type':'application/json',apikey:CONFIG.anonKey,...(t?{authorization:'Bearer '+t}:{})});
const signUp=async()=>{const j=await(await fetch(`${CONFIG.url}/auth/v1/signup`,{method:'POST',headers:H(),body:'{}'})).json();return{token:j.access_token,id:j.user.id};};
const api=async(t,body)=>{const r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(t),body:JSON.stringify(body)});return{status:r.status,body:await r.json().catch(()=>({}))};};
const rest=async(t,method,path,body)=>{const r=await fetch(`${CONFIG.url}/rest/v1/${path}`,{method,headers:{...H(t),prefer:'return=representation'},body:body?JSON.stringify(body):undefined});const text=await r.text();let j;try{j=JSON.parse(text);}catch{j=text;}return{status:r.status,body:j};};
const denied=r=>r.status>=400||(Array.isArray(r.body)&&r.body.length===0);   // refused outright, or silently affected nothing

const A=await signUp(),B=await signUp();
await api(A.token,{op:'import',state:{version:2,cash:500,jars:0,sold:0,harvests:0}});
const order=(await api(A.token,{op:'orderCreate',item:'rack',method:'sol'})).body.order;

const TABLES=['hs_saves','hs_profiles','hs_weekly_scores','hs_orders','hs_items','hs_wallets','hs_payouts','hs_locks','hs_health','hs_alerts'];
// 1) Direct writes by a signed-in player are refused on EVERY table
for(const t of TABLES){
  const fake={user_id:B.id,id:'x',name:'x',state:{},item:'rack',method:'sol',amount_raw:1,reference:'r',expires_at:new Date().toISOString(),wallet:'w',asset:'token',week:1,division:'garage',points:500,display_name:'hacker',until_at:new Date().toISOString()};
  const ins=await rest(B.token,'POST',t,fake);
  const upd=await rest(B.token,'PATCH',`${t}?user_id=eq.${B.id}`,{points:500,status:'paid',display_name:'hacker'});
  const del=await rest(B.token,'DELETE',`${t}?user_id=eq.${A.id}`);
  check(`${t}: insert/update/delete by a player are all refused`,ins.status>=400&&denied(upd)&&denied(del),`ins ${ins.status} upd ${upd.status} del ${del.status}`);
}
// 2) Players cannot read other players' private rows
for(const t of ['hs_saves','hs_orders','hs_items','hs_wallets','hs_payouts']){
  const r=await rest(B.token,'GET',`${t}?user_id=eq.${A.id}&select=*`);
  check(`${t}: player B cannot read player A's rows`,Array.isArray(r.body)?r.body.length===0:r.status>=400);
}
const mine=await rest(A.token,'GET','hs_orders?select=id,reference');
check('hs_orders: A can read their OWN order',Array.isArray(mine.body)&&mine.body.some(o=>o.id===order.id));
check('hs_locks: unreachable by players',denied(await rest(B.token,'GET','hs_locks?select=*')));
// 3) No token at all (public key only)
for(const t of TABLES){const r=await rest(null,'GET',`${t}?select=*&limit=1`);check(`${t}: public key alone reads nothing`,Array.isArray(r.body)?r.body.length===0:r.status>=400);}
// 4) Privileged database functions cannot be called by players or the public
const fns={hs_settle_order:{p_order:order.id,p_signature:'fake-sig',p_payer:'fake'},hs_put_save:{p_user:B.id,p_state:{},p_expected:0,p_imported:false},hs_claim_check:{p_order:order.id,p_gap_ms:0},
 hs_week_winners:{p_week:1,p_force:true},hs_settle_week:{p_week:1},hs_claim_payouts:{p_limit:5},hs_payout_lock:{p_secs:1},hs_alert_gate:{p_kind:'x',p_minutes:1},hs_payout_stats:{}};
for(const [f,args] of Object.entries(fns)){
  const asUser=await rest(B.token,'POST',`rpc/${f}`,args),asPublic=await rest(null,'POST',`rpc/${f}`,args);
  check(`rpc ${f}: refused for players and the public`,asUser.status>=400&&asPublic.status>=400,`user ${asUser.status} public ${asPublic.status}`);
}
const o2=await api(A.token,{op:'orderCheck',id:order.id});check('order was NOT marked paid by the forged settle attempt',o2.body.paid===false);
// 5) Edge functions
let r=await api(null,{op:'load'});check('hs-api: no token refused',r.status===401);
r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(CONFIG.anonKey),body:JSON.stringify({op:'load'})});check('hs-api: the public key used as a "user token" is refused',r.status===401);
r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(A.token),body:'x'.repeat(200000)});check('hs-api: oversized body refused (413) without crashing',r.status===413||r.status===400,String(r.status));
r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(A.token),body:'{not json'});check('hs-api: malformed JSON is a clean error, not a crash',r.status>=400&&r.status<=500);
r=await fetch(`${CONFIG.url}/functions/v1/hs-payout`,{method:'GET'});check('hs-payout: GET refused',r.status===405||r.status===404);
r=await fetch(`${CONFIG.url}/functions/v1/hs-payout`,{method:'POST',body:JSON.stringify({id:'wk1-garage-1',wallet:'EVIL',amount:999999})});const t=await r.text();
check('hs-payout: takes no input (attacker details ignored, no secrets in the reply)',!/secret|service_role|eyJ/i.test(t),`${r.status} ${t.slice(0,80)}`);
console.log(failed?`\n${failed} check(s) FAILED`:'\nAll live security probes passed.');
process.exit(failed?1:0);

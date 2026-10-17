// Live end-to-end test of cloud saves + weekly league against the REAL Supabase project in cloud-config.mjs.
// Creates throwaway anonymous users (delete them afterwards: see the cleanup SQL printed at the end). No passwords, no keys.
// Usage: node scripts/live-test.mjs
import * as E from '../engine.mjs';
import {CONFIG} from '../cloud-config.mjs';

if(!CONFIG.url||!CONFIG.anonKey){console.error('cloud-config.mjs is blank');process.exit(1);}
let failed=0;
const check=(name,ok,extra='')=>{console.log(`${ok?'PASS':'FAIL'}  ${name}${extra?'  '+extra:''}`);if(!ok)failed++;};
const H=t=>({'content-type':'application/json',apikey:CONFIG.anonKey,...(t?{authorization:'Bearer '+t}:{})});

async function signInAnonymously(){
  const r=await fetch(`${CONFIG.url}/auth/v1/signup`,{method:'POST',headers:H(),body:'{}'});
  const j=await r.json();
  if(!j.access_token)throw new Error('anonymous sign-in failed: '+JSON.stringify(j).slice(0,160));
  return{token:j.access_token,id:j.user.id};
}
async function api(token,body){
  const r=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:H(token),body:JSON.stringify(body)});
  let j=null;try{j=await r.json();}catch{}
  return{status:r.status,body:j};
}
/** A believable mid-game save: sold $2,000 over 6 harvests, with premium and plain jars in stock. */
function save({stock,jars}){
  const now=Date.now(),s=E.fresh(now-600000);
  s.sold=2000;s.harvests=6;s.tut=6;s.jars=jars;s.stock={og:0,'midnight-purple':0,'citrus-riot':0,frostbite:0,...stock};
  return s;
}

const A=await signInAnonymously(),B=await signInAnonymously(),C=await signInAnonymously();
console.log('Project:',CONFIG.url,'\nUsers  :',A.id.slice(0,8),B.id.slice(0,8),C.id.slice(0,8),'(anonymous)\n');

// ---- Account A: load, import, double-import, act, name ----
let r=await api(A.token,{op:'load'});
check('A: fresh account has no cloud save',r.status===200&&r.body.state===null);
r=await api(A.token,{op:'import',state:save({stock:{'midnight-purple':24},jars:24})});
check('A: importing a believable save is accepted',r.status===200&&r.body.state?.sold===2000);
r=await api(A.token,{op:'import',state:save({stock:{og:5},jars:5})});
check('A: a second import without replace is refused (never silently overwrites)',r.status===409&&r.body.error==='exists');
r=await api(A.token,{op:'act',actions:[{t:'sell',a:['bryce']},{t:'sell',a:['tony']}]});
const pts=r.body?.results?.map(x=>x.points);
check('A: server replays two orders and scores them',r.status===200&&r.body.results.every(x=>x.ok)&&pts[0]>0&&pts[1]>0,`points ${pts?.join(' + ')} = ${r.body?.score?.points}`);
const aPoints=r.body?.score?.points;
r=await api(A.token,{op:'setName',name:'Tester One'});
check('A: display name accepted',r.status===200&&r.body.name==='Tester One');
r=await api(A.token,{op:'setName',name:'x'});
check('A: too-short name rejected',r.status===400);
r=await api(A.token,{op:'setName',name:'<script>alert(1)</script>'});
check('A: script-tag names are never stored with angle brackets',(r.status===400)||(r.status===200&&!/[<>]/.test(r.body.name)),r.status===400?'rejected':`stored as "${r.body.name}"`);
await api(A.token,{op:'setName',name:'Tester One'});

// ---- Account B: smaller score, same division ----
await api(B.token,{op:'import',state:save({stock:{og:12},jars:12})});
r=await api(B.token,{op:'act',actions:[{t:'sell',a:['tony']}]});
const bPoints=r.body?.score?.points;
check('B: scores a smaller order',r.status===200&&bPoints>0&&bPoints<aPoints,`B ${bPoints} < A ${aPoints}`);
await api(B.token,{op:'setName',name:'Tester Two'});

// ---- League and rooms ----
r=await api(A.token,{op:'league'});
const rows=r.body?.rows||[],names=rows.map(x=>x.name);
const ia=names.indexOf('Tester One'),ib=names.indexOf('Tester Two');
check('League: both players on the same board, higher score first',r.status===200&&ia>=0&&ib>=0&&ia<ib,`board: ${rows.map(x=>x.name+' '+x.points).join(', ')}`);
check('League: my row is flagged and no other player ids leak beyond the board',rows.find(x=>x.me)?.name==='Tester One'&&rows.every(x=>typeof x.uid==='string'));
r=await api(A.token,{op:'room',user:B.id});
check("Room: A can visit B's room (pots, upgrades, no private data)",r.status===200&&Array.isArray(r.body.room?.pots)&&!('cash' in (r.body.room||{})),`keys: ${Object.keys(r.body.room||{}).join(',')}`);
r=await api(A.token,{op:'room',user:C.id});
check("Room: a player not on the board can't be visited",r.status===404);

// ---- Attacks ----
r=await api(null,{op:'load'});
check('Attack: no token is refused',r.status===401);
r=await api('not.a.real.token',{op:'load'});
check('Attack: forged token is refused',r.status===401);
const cheat=save({stock:{og:5},jars:5});cheat.cash=1e9;
r=await api(C.token,{op:'import',state:cheat});
check('Attack: importing a save with a billion cash is refused',r.status===422,r.body?.message);
const cheat2=save({stock:{og:5},jars:5});cheat2.jars=999999;cheat2.stock.og=999999;
r=await api(C.token,{op:'import',state:cheat2});
check('Attack: importing impossible stock is refused',r.status===422,r.body?.message);
r=await api(A.token,{op:'act',actions:Array.from({length:60},()=>({t:'service',a:[]}))});
check('Attack: more than 25 actions in one request refused',r.status===400);
r=await api(A.token,{op:'act',actions:[{t:'giveMeMoney',a:[1e9]},{t:'plant',a:[4,'og']},{t:'harvest',a:[4]}]});
check('Attack: made-up actions do nothing; a crop planted this instant is NOT ready (server clock)',r.status===200&&r.body.results[0].ok===false&&r.body.results[1].ok===true&&r.body.results[2].ok===false,r.body?.results?.map(x=>x.message).join(' / '));
r=await api(B.token,{op:'act',actions:[{t:'plant',a:[4,'frostbite']}]});
check('Attack: planting a still-locked strain (needs $4,000 lifetime sales) is refused',r.status===200&&r.body.results[0].ok===false,r.body?.results?.[0]?.message);
const before=await api(A.token,{op:'load'});
r=await api(A.token,{op:'act',actions:[{t:'sell',a:['bryce']}]});
check('Attack: selling premium jars you no longer have fails and scores nothing',r.status===200&&r.body.results[0].ok===false&&r.body.score.points===before.body.score.points);

console.log(failed?`\n${failed} check(s) FAILED`:'\nAll live checks passed.');
console.log('\nCleanup (Supabase SQL editor): delete from auth.users where is_anonymous and created_at > now() - interval \'1 day\';');
process.exit(failed?1:0);

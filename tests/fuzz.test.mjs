import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.mjs';
import {handle} from '../server-core.mjs';
import {PAY_CONFIG} from '../supabase/functions/_shared/pay-config.mjs';

// Throws-nothing fuzz: whatever a hostile client sends, the server returns a clean 2xx/4xx and never throws or corrupts the save.
let seed=12345;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
const pick=a=>a[Math.floor(rnd()*a.length)];
const val=()=>pick([null,undefined,NaN,Infinity,-1,0,1,2,7,3.5,1e308,-1e308,'','x','__proto__','constructor','0','og','tony','bryce','rack',true,false,[],{},[1,2],{a:1},'<script>',"'; drop table x;--",'a'.repeat(3000)]);
const T0=Date.UTC(2026,9,17,12);
function memStore(){const saves=new Map(),weeks=new Map(),names=new Map(),orders=[],items=new Map(),sigs=new Set();return{saves,weeks,orders,
 async getSave(u){const s=saves.get(u);return s?structuredClone(s):null;},
 async putSave(u,state,exp,imp){const c=saves.get(u);if((c?.version??0)!==exp)return false;saves.set(u,{state:structuredClone(state),version:exp+1,imported:imp});return true;},
 async getWeek(u,w){const r=weeks.get(u+':'+w);return r?structuredClone(r):null;},async putWeek(u,r){weeks.set(u+':'+r.week,structuredClone(r));},
 async listWeek(){return[];},async getName(u){return names.get(u)??null;},async setName(u,n){names.set(u,n);},
 async listOrders(u){return orders.filter(o=>o.user_id===u).map(o=>({...o}));},async listItems(u){return[...(items.get(u)||[])];},
 async createOrder(r){const o={id:String(orders.length),status:'pending',last_checked:null,signature:null,...r};orders.push(o);return{...o};},
 async getOrder(u,id){const o=orders.find(x=>x.id===id&&x.user_id===u);return o&&{...o};},async claimCheck(){return true;},
 async settle(id,sig){const o=orders.find(x=>x.id===id);if(o.status!=='pending'||sigs.has(sig))return false;sigs.add(sig);o.status='paid';return true;}};}

test('fuzz: 4000 hostile requests never throw, never 5xx, and never break the save or prototypes',async()=>{
 const st=memStore(),pay={config:PAY_CONFIG,newReference:()=>'R'+Math.random(),async findPayment(){return pick([{ok:false,reason:'x'},{ok:true,signature:'S'+Math.random(),payer:'P'}]);}};
 const s0=E.fresh(T0);s0.harvests=5;s0.stock.og=10;s0.jars=10;await st.putSave('u',s0,0,false);
 const ops=['load','act','import','league','room','setName','orders','orderCreate','orderCheck','nope',undefined,null,5];
 let bad=0;
 for(let i=0;i<4000;i++){
  const op=pick(ops);let body;
  if(op==='act')body={op,actions:pick([[...Array(Math.floor(rnd()*6))].map(()=>({t:pick(['plant','harvest','sell','tend','buyUpgrade','buySkin','equip','service','rescue','event','tick','collectDry','__proto__','constructor',val()]),a:pick([[val(),val()],[val()],val(),[],null,undefined])})),val()])};
  else if(op==='import')body={op,state:pick([val(),{cash:val(),jars:val(),sold:val(),harvests:val(),upgrades:val(),slots:val(),kinds:val(),stock:val(),owned:val(),dry:val(),event:val()}]),replace:val(),confirmWorse:val()};
  else body={op,item:val(),method:val(),id:val(),name:val(),user:val(),division:val()};
  let r;try{r=await handle({store:st,uid:'u',now:T0+i*1000,body:body===null?null:body,pay,rng:rnd});}catch(e){bad++;assert.fail(`threw on ${JSON.stringify(body)?.slice(0,200)}: ${e.message}`);}
  assert.ok(r.status>=200&&r.status<500,`status ${r.status} for op ${op}`);
 }
 assert.equal({}.polluted,undefined,'prototype was polluted');
 const cur=await st.getSave('u');
 if(cur){const n=E.normalize(cur.state,T0+9e6);assert.ok(Number.isFinite(n.cash)&&n.cash>=0&&Number.isFinite(n.jars)&&n.jars>=0,'save stayed sane');}
 assert.equal(bad,0);
});

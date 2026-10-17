import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.mjs';
import * as L from '../league.mjs';
import {handle,plausible,cleanName} from '../server-core.mjs';

const T0=L.weekStart(2900)+3600000; // an hour into a league week
function memStore(){const saves=new Map(),weeks=new Map(),names=new Map();return{saves,weeks,names,
 async getSave(u){const s=saves.get(u);return s?structuredClone(s):null;},
 async putSave(u,state,exp,imp){const c=saves.get(u);if((c?.version??0)!==exp)return false;saves.set(u,{state:structuredClone(state),version:exp+1,imported:imp});return true;},
 async getWeek(u,w){const r=weeks.get(u+':'+w);return r?structuredClone(r):null;},
 async putWeek(u,r){weeks.set(u+':'+r.week,structuredClone(r));},
 async listWeek(w,d,n){return[...weeks.entries()].filter(([k,r])=>k.endsWith(':'+w)&&r.division===d).map(([k,r])=>({uid:k.split(':')[0],...r})).sort((a,b)=>b.points-a.points).slice(0,n);},
 async getName(u){return names.get(u)??null;},async setName(u,n){names.set(u,n);}};}
const call=(store,uid,body,now=T0)=>handle({store,uid,now,body,rng:()=>0.5});
async function seed(store,uid,patch={},now=T0){const s=E.fresh(now);Object.assign(s,patch);await store.putSave(uid,s,0,false);return s;}
const stockOf=(n)=>({...E.fresh().stock,og:n});

test('weeks start Monday 00:00 UTC and divisions follow lifetime sales',()=>{
 assert.equal(new Date(L.weekStart(2900)).getUTCDay(),1);assert.equal(new Date(L.weekStart(2900)).getUTCHours(),0);
 assert.equal(L.weekId(L.weekEnd(2900)-1),2900);assert.equal(L.weekId(L.weekEnd(2900)),2901);
 assert.equal(L.divisionFor(0),'garage');assert.equal(L.divisionFor(1500),'warehouse');assert.equal(L.divisionFor(9000),'empire');});

test('scoring: fixed base per buyer, 15% decay per repeat with a floor, and a weekly cap',()=>{
 const w=L.blankWeek(1,0);assert.equal(L.scoreOrder(w,'tony',{og:8}),20);assert.equal(L.scoreOrder(w,'tony',{og:8}),17);assert.equal(L.scoreOrder(w,'tony',{og:8}),14);
 for(let i=0;i<20;i++)L.scoreOrder(w,'tony',{og:8});assert.equal(L.scoreOrder(w,'tony',{og:8}),5);
 const c=L.blankWeek(1,0);for(let i=0;i<200;i++)L.scoreOrder(c,'bryce',{frostbite:12});assert.equal(c.points,L.WEEK_CAP);assert.equal(L.scoreOrder(c,'rick',{og:4}),0);});

test('scoring: premium jars add quality points by tier, OG adds none, quality is capped',()=>{
 const w=L.blankWeek(1,0);assert.equal(L.scoreOrder(w,'rick',{og:4}),8);assert.equal(w.premiumJars,0);
 const p=L.blankWeek(1,0);assert.equal(L.scoreOrder(p,'bryce',{'midnight-purple':12}),35+24);assert.equal(p.premiumJars,12);assert.equal(p.quality,24);
 const q=L.blankWeek(1,0);q.quality=190;assert.equal(L.scoreOrder(q,'bryce',{frostbite:12}),35+10);assert.equal(L.scoreOrder(q,'nobody',{og:1}),0);});

test('a veteran and a newcomer earn the same points from the same order; divisions keep them apart',async()=>{
 const st=memStore();await seed(st,'vet',{sold:20000,jars:30,stock:stockOf(30)});await seed(st,'new',{jars:8,stock:stockOf(8)});
 const a=await call(st,'vet',{op:'act',actions:[{t:'sell',a:['tony']}]}),b=await call(st,'new',{op:'act',actions:[{t:'sell',a:['tony']}]});
 assert.equal(a.body.score.points,20);assert.equal(b.body.score.points,20);assert.equal(a.body.score.division,'empire');assert.equal(b.body.score.division,'garage');
 const lb=await call(st,'new',{op:'league'});assert.deepEqual(lb.body.rows.map(r=>r.me),[true]);assert.equal(lb.body.division,'garage');
 assert.equal((await call(st,'new',{op:'league',division:'empire'})).body.rows[0].name,'Grower-VET');});

test('week boundary resets points: the same player starts the next week at zero',async()=>{
 const st=memStore();await seed(st,'p',{jars:16,stock:stockOf(16)});
 await call(st,'p',{op:'act',actions:[{t:'sell',a:['tony']}]});
 const next=await call(st,'p',{op:'act',actions:[{t:'sell',a:['tony']}]},L.weekEnd(2900)+1000);
 assert.equal(next.body.score.points,20);assert.equal(next.body.score.week,2901);assert.equal(st.weeks.get('p:2900').points,20);});

test('validation: harvest uses SERVER time, so a client-claimed time or phone clock cannot speed growth',async()=>{
 const st=memStore();await seed(st,'p');
 const r=await call(st,'p',{op:'act',actions:[{t:'harvest',a:[0],now:T0+1e9},{t:'plant',a:[0,'og'],now:T0-1e9,at:T0-1e9}]});
 assert.equal(r.body.results[0].ok,true);assert.equal(r.body.results[1].ok,true);
 const early=await call(st,'p',{op:'act',actions:[{t:'harvest',a:[0],now:T0+1e9}]},T0+89999);assert.equal(early.body.results[0].ok,false);
 const later=await call(st,'p',{op:'act',actions:[{t:'harvest',a:[0]}]},T0+90000);assert.equal(later.body.results[0].ok,true);});

test('validation: double harvest, unaffordable buys, missing stock and unknown actions are rejected without changes',async()=>{
 const st=memStore();await seed(st,'p',{jars:8,stock:stockOf(8)});
 const r=await call(st,'p',{op:'act',actions:[{t:'harvest',a:[0]},{t:'harvest',a:[0]},{t:'buyUpgrade',a:['staff']},{t:'sell',a:['bryce']},{t:'sell',a:['tony']},{t:'setCash',a:[1e9]},{t:'plant',a:[99]},{t:'harvest',a:['x']},null]});
 assert.deepEqual(r.body.results.map(x=>x.ok),[true,false,false,false,true,false,false,false,false]);
 assert.equal(r.body.state.cash,1140);assert.equal(r.body.score.points,20);});

test('validation: skins cost TEST credits only; cash and credits never mix',async()=>{
 const st=memStore();await seed(st,'p');const r=await call(st,'p',{op:'act',actions:[{t:'buySkin',a:['rack']}]});
 assert.equal(r.body.state.testCredits,850);assert.equal(r.body.state.cash,500);});

test('act: rejects missing save, oversized batches and stale versions',async()=>{
 const st=memStore();assert.equal((await call(st,'p',{op:'act',actions:[]})).status,404);await seed(st,'p');
 assert.equal((await call(st,'p',{op:'act',actions:Array(26).fill({t:'tick'})})).status,400);
 const racing={...st,async putSave(){return false;}};assert.equal((await call(racing,'p',{op:'act',actions:[{t:'tick'}]})).status,409);});

test('import: first import works, existing cloud save asks first, better cloud save needs explicit confirmation',async()=>{
 const st=memStore(),local=E.fresh(T0);local.sold=900;local.harvests=10;local.cash=400;
 assert.equal((await call(st,'p',{op:'import',state:local})).status,200);
 const again=await call(st,'p',{op:'import',state:local});assert.equal(again.status,409);assert.equal(again.body.error,'exists');
 const poorer=E.fresh(T0);const worse=await call(st,'p',{op:'import',state:poorer,replace:true});assert.equal(worse.status,409);assert.equal(worse.body.error,'worse');
 assert.equal((await call(st,'p',{op:'import',state:poorer,replace:true,confirmWorse:true})).status,200);
 assert.equal((await call(st,'p',{op:'load'})).body.state.sold,0);});

test('import: edited saves with impossible cash, stock or sales are refused',async()=>{
 const st=memStore();const cheat=E.fresh(T0);cheat.cash=99999999;assert.equal((await call(st,'p',{op:'import',state:cheat})).status,422);
 const jars=E.fresh(T0);jars.jars=100000;jars.stock.og=100000;assert.equal((await call(st,'p',{op:'import',state:jars})).status,422);
 const sold=E.fresh(T0);sold.sold=5e7;assert.equal(plausible(sold)!==null,true);
 const honest=E.fresh(T0);honest.sold=3000;honest.harvests=20;honest.cash=700;honest.upgrades.expansion=true;honest.slots.push(null,null);assert.equal(plausible(honest),null);
 assert.equal(st.saves.size,0);});

test('import: week score is not importable, only server-timed orders score',async()=>{
 const st=memStore(),local=E.fresh(T0);local.score={points:9999};local.sold=100;local.harvests=5;await call(st,'p',{op:'import',state:local});
 assert.equal((await call(st,'p',{op:'load'})).body.score,null);});

test('rooms are visible only for players on this week board and expose no cash or stock',async()=>{
 const st=memStore();await seed(st,'a',{jars:8,stock:stockOf(8),cash:777});await call(st,'a',{op:'act',actions:[{t:'sell',a:['tony']}]});await seed(st,'b');
 const ok=await call(st,'b',{op:'room',user:'a'});assert.equal(ok.status,200);assert.equal(ok.body.room.pots.length,6);assert.ok(!('cash'in ok.body.room)&&!('stock'in ok.body.room));
 assert.equal((await call(st,'a',{op:'room',user:'b'})).status,404);});

test('display names are cleaned and length checked',async()=>{
 assert.equal(cleanName('  Big   Dale<script> '),'Big Dalescript');assert.equal(cleanName('x'),null);assert.equal(cleanName('a'.repeat(17)),null);
 const st=memStore();assert.equal((await call(st,'p',{op:'setName',name:'Marcus'})).body.name,'Marcus');assert.equal((await call(st,'p',{op:'setName',name:'!!'})).status,400);});

test('the edge function runs the same rule files as the client (fix with: node scripts/sync-server.mjs)',()=>{
 for(const f of['engine.mjs','league.mjs','server-core.mjs'])assert.equal(readFileSync(`supabase/functions/_shared/${f}`,'utf8'),readFileSync(f,'utf8'),f+' is out of sync');});

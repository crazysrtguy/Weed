import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.mjs';
import * as L from '../league.mjs';
import {handle,prizeStatus} from '../server-core.mjs';

const T0=L.weekStart(2900)+3600000;
function store(wallets={}){const saves=new Map();return{saves,
 async getSave(u){const s=saves.get(u);return s?structuredClone(s):null;},
 async putSave(u,state,exp,imp){const c=saves.get(u);if((c?.version??0)!==exp)return false;saves.set(u,{state:structuredClone(state),version:exp+1,imported:imp});return true;},
 async getWeek(){return null;},async putWeek(){},async listWeek(){return[];},async getName(){return null;},async setName(){},
 async getWallet(u){return wallets[u]??null;}};}
const call=(st,uid,body)=>handle({store:st,uid,now:T0,body,rng:()=>.5});

test('prize amounts: 500/250/100, scaled by division',()=>{
 assert.deepEqual([1,2,3,4].map(r=>L.prizeFor('garage',r)),[500,250,100,0]);
 assert.equal(L.prizeFor('warehouse',1),1000);assert.equal(L.prizeFor('empire',2),1000);assert.equal(L.prizeFor('nope',1),500);
});

test('prizeStatus needs a server-started save AND a linked wallet; wallet is shown shortened',()=>{
 assert.deepEqual(prizeStatus({imported:false},'7aXqmf1dTMFkwCvCnAXRocJbknk4KMz7ZCpAz4DHFvwk'),{eligible:true,reasons:[],wallet:'7aXq…Fvwk'});
 assert.deepEqual(prizeStatus({imported:true},'W').reasons,['imported']);
 assert.deepEqual(prizeStatus({imported:false},null).reasons,['no-wallet']);
 assert.deepEqual(prizeStatus(null,null).reasons,['imported','no-wallet']);
});

test('a fresh (no progress) cloud start stays prize-eligible; importing progress does not',async()=>{
 const st=store({a:'WALLETAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
 const fresh=await call(st,'a',{op:'import',state:E.fresh(T0)});assert.equal(fresh.status,200);
 assert.equal(st.saves.get('a').imported,false);
 assert.equal((await call(st,'a',{op:'load'})).body.prize.eligible,true);
 const played=E.fresh(T0);played.sold=200;played.harvests=3;
 assert.equal((await call(st,'b',{op:'import',state:played})).status,200);assert.equal(st.saves.get('b').imported,true);
 assert.deepEqual((await call(st,'b',{op:'load'})).body.prize.reasons,['imported','no-wallet']);
});

test('a hand-built "empty" save cannot smuggle free pots, jars or cash (it is replaced by a clean start)',async()=>{
 const st=store(),s=E.fresh(T0);s.cash=3000;s.jars=50;s.stock.og=50;s.slots=s.slots.map(()=>T0-9e9);s.kinds=s.kinds.map(()=>'og');s.owned=['rack'];
 const r=await call(st,'a',{op:'import',state:s});assert.equal(r.status,200);
 const got=r.body.state,base=E.fresh(T0);
 assert.equal(got.cash,base.cash);assert.equal(got.jars,0);assert.deepEqual(got.slots,base.slots);assert.equal(st.saves.get('a').imported,false);
});

test('league and load report prize status to the player',async()=>{
 const st=store({a:'W'.repeat(40)});await call(st,'a',{op:'import',state:E.fresh(T0)});
 assert.equal((await call(st,'a',{op:'league'})).body.prize.eligible,true);
 assert.equal((await call(st,'z',{op:'league'})).body.prize.eligible,false);
});

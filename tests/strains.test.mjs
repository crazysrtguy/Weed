import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as E from '../engine.mjs';

const list=E.STRAIN_IDS.map(id=>E.STRAINS[id]);

test('six strains, ordered by tier with rising unlock, seed cost and grow time',()=>{
 assert.equal(list.length,6);
 list.forEach((s,i)=>{assert.equal(s.tier,i+1);if(i){assert.ok(s.unlock>list[i-1].unlock&&s.cost>list[i-1].cost&&s.time>list[i-1].time&&s.value>list[i-1].value,s.id);}});
});

test('every strain with art has all six images on disk',()=>{
 for(const s of list.filter(x=>x.art))for(const part of ['starter','young','developed','ready','jar','seed'])assert.ok(existsSync(new URL(`../assets/v2/${s.id}-${part}.webp`,import.meta.url)),`${s.id}-${part}`);
});

test('economy guard: a premium strain never earns more per second than Garage OG (it pays back in tier, not speed)',()=>{
 const rate=s=>s.jars*s.value/(s.time/1000);
 for(const s of list.slice(1))assert.ok(rate(s)<=rate(list[0]),`${s.id} earns ${rate(s).toFixed(4)}/s vs OG ${rate(list[0]).toFixed(4)}/s`);
});

test('seed cost is always a small share of the harvest value (no strain is a trap or a free-money loop)',()=>{
 for(const s of list){const harvest=s.jars*s.value*(640/8);   // a Tony order pays 80 per jar-value
  assert.ok(s.cost<harvest*.6&&s.cost>harvest*.02,`${s.id} cost ${s.cost} vs harvest ~${harvest}`);}
});

test('the new strains can be planted, grown, harvested and sold through the real engine rules',()=>{
 const now=1e12,s=E.fresh(now);s.sold=15000;s.cash=5000;s.slots=s.slots.map(()=>null);s.kinds=s.kinds.map(()=>null);s.stock={...s.stock};
 for(const [i,id] of ['margin-call','whale-breath'].entries()){
  assert.equal(E.plant(s,i,now,id).ok,true,id);
  assert.equal(E.harvest(s,i,now).ok,false,'not ready yet');
  const done=now+E.STRAINS[id].time+1;
  assert.equal(E.stg(s,i,done),'ready');
  assert.equal(E.harvest(s,i,done).ok,true);
 }
 E.collectDry(s,now+1e9);
 assert.ok(s.stock['margin-call']>=12&&s.stock['whale-breath']>=12);
 const r=E.sell(s,'bryce');assert.equal(r.ok,true);assert.ok(r.pay>0);
});

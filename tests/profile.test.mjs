import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.mjs';
import {MILESTONES,milestonesDone,DECOR,decorUnlocked,AVATARS,profilePanel} from '../profile.mjs';

const fresh=()=>E.fresh(1000000);

test('milestones unlock from real progress only, and the league badge stays locked',()=>{
  const s=fresh();
  assert.equal(milestonesDone(s).length,0);
  s.sold=1;assert.deepEqual(milestonesDone(s).map(m=>m.id),['payday']);
  s.harvests=10;s.upgrades.expansion=true;s.upgrades.staff=true;s.owned=['rack'];
  assert.ok(['payday','thumb','room','staff','taste'].every(id=>milestonesDone(s).some(m=>m.id===id)));
  s.sold=10000;
  assert.ok(milestonesDone(s).some(m=>m.id==='collector')&&milestonesDone(s).some(m=>m.id==='empire'));
  assert.ok(!milestonesDone(s).some(m=>m.id==='champion'));
});
test('decor unlocks in order with lifetime sales and never from game cash',()=>{
  const s=fresh();s.cash=1e9;assert.equal(decorUnlocked(s).length,0);
  s.sold=1500;assert.deepEqual(decorUnlocked(s).map(d=>d.id),['chair']);
  s.sold=10000;assert.equal(decorUnlocked(s).length,DECOR.length);
  assert.ok(DECOR.every((d,i)=>i===0||d.at>DECOR[i-1].at),'thresholds are strictly increasing');
});
test('every badge, avatar and decor id points at a real converted file',async()=>{
  const fs=await import('node:fs'),root=new URL('../assets/v2/',import.meta.url);
  const need=[...MILESTONES.filter(m=>m.art).map(m=>m.art),...DECOR.map(d=>d.art),...AVATARS.map(a=>'avatar-'+a.id)];
  for(const n of need)assert.ok(fs.existsSync(new URL(n+'.webp',root)),n+'.webp is missing');
});
test('profile panel inserts the avatar card first and replaces the old milestones card without touching other cards',()=>{
  const html='<div class="head"></div><div class="cards"><article class="card"><h3>Your numbers</h3></article><article class="card"><h3>Milestones</h3><div class="achievement">old</div></article><article class="card"><h3>Cloud save</h3></article></div>';
  const out=profilePanel(html,fresh());
  assert.ok(out.indexOf('Your grower')<out.indexOf('Your numbers'));
  assert.ok(!out.includes('>old<')&&out.includes('Room decor'));
  assert.ok(out.includes('Your numbers')&&out.includes('Cloud save'));
  assert.equal((out.match(/data-avatar=/g)||[]).length,AVATARS.length);
});

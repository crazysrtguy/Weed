// Authoritative game server logic. No I/O here: the edge function passes in a `store`, so this runs the same
// engine rules under Node tests and Deno. The phone clock is never read: every action is timed by `now`.
import * as E from './engine.mjs';
import * as L from './league.mjs';

export const MAX_ACTIONS=25;
const UPGRADE_COST=Object.fromEntries(E.UPGRADES.map(u=>[u.id,u.cost]));

// Whitelist of player actions, each mapped onto the shared engine function with server time.
const ACTIONS={
 plant:(s,now,a)=>E.plant(s,a[0],now,a[1]),
 harvest:(s,now,a)=>E.harvest(s,a[0],now),
 tend:(s,now,a)=>E.tend(s,a[0],now),
 collectDry:(s,now)=>E.collectDry(s,now),
 sell:(s,now,a)=>E.sell(s,a[0]),
 buyUpgrade:(s,now,a)=>E.buyUpgrade(s,a[0]),
 buySkin:(s,now,a)=>E.buySkin(s,a[0]),
 equip:(s,now,a)=>E.equip(s,a[0]),
 service:(s)=>E.service(s),
 rescue:(s)=>E.rescue(s),
 event:(s,now,a,rng)=>E.resolveEvent(s,a[0],now,rng),
 tick:(s,now,a,rng)=>{E.maybeEvent(s,now,rng);return{ok:true,message:''};}
};

// Apply a batch of actions at server time. `week` is the player's league record (mutated by completed orders).
export function applyActions(state,actions,now,rng,week){
 const results=[];
 for(const act of actions.slice(0,MAX_ACTIONS)){
  const fn=ACTIONS[act?.t];
  if(!fn||!Array.isArray(act.a??[])){results.push({ok:false,message:'Unknown action.'});continue;}
  const a=act.a??[],before=act.t==='sell'?{...state.stock}:null;
  let r;try{r=fn(state,now,a,rng);}catch{r={ok:false,message:'Invalid action.'};}
  if(r.ok&&act.t==='sell')r.points=L.scoreOrder(week,a[0],L.jarsTaken(before,state.stock));
  results.push({ok:r.ok,message:r.message,points:r.points||0});
 }
 E.maybeEvent(state,now,rng);
 return results;
}

// Imported (local) saves are untrusted. Reject economies that cannot have been earned with the rules above.
// Deliberately generous: this blocks absurd edits, while the league itself only scores server-timed orders.
export function plausible(s){
 const bought=E.UPGRADES.reduce((n,u)=>n+(s.upgrades[u.id]?u.cost:0),0);
 const maxJars=60+s.harvests*60;
 if(s.cash+bought>500+s.sold+3000+s.harvests*50)return'Cash does not match your sales history.';
 if(s.jars>maxJars||s.sold>s.harvests*60*250+500)return'Stock or sales do not match your harvest history.';
 if(s.testCredits>1000)return'Test credits do not match.';
 return null;
}

export const publicRoom=(s,name,week,now)=>({name,division:week?.division,points:week?.points||0,
 pots:s.slots.map((t,i)=>t===null?null:{strain:s.kinds[i],stage:E.stg(s,i,now)}),
 upgrades:E.UPGRADES.filter(u=>s.upgrades[u.id]).map(u=>u.id),equipped:s.equipped,sold:s.sold});

export const cleanName=(raw)=>{const n=String(raw??'').replace(/[^A-Za-z0-9 _-]/g,'').trim().replace(/\s+/g,' ');return n.length>=3&&n.length<=16?n:null;};
const defaultName=(uid)=>'Grower-'+uid.replace(/-/g,'').slice(0,4).toUpperCase();

/* store: getSave(uid)->{state,version,imported}|null  putSave(uid,state,expectedVersion,imported)->bool
          getWeek(uid,week)->row|null  putWeek(uid,row)  listWeek(week,division,limit)->rows[{uid,points,...}]
          getName(uid)->string|null  setName(uid,name)  */
export async function handle({store,uid,now,rng=Math.random,body}){
 const op=body?.op,week=L.weekId(now),info={now,week,weekEnd:L.weekEnd(week)};
 const nameOf=async(u)=>(await store.getName(u))||defaultName(u);
 if(op==='load'){const s=await store.getSave(uid);return{status:200,body:{...info,state:s?.state??null,name:await nameOf(uid),score:await store.getWeek(uid,week)}};}
 if(op==='import'){
  const cur=await store.getSave(uid),inc=E.normalize(body.state,now);
  if(cur&&!body.replace)return{status:409,body:{error:'exists',message:'A cloud save already exists.',cloudRank:L.saveRank(cur.state),incomingRank:L.saveRank(inc)}};
  if(cur&&body.replace&&L.saveRank(cur.state)>L.saveRank(inc)&&!body.confirmWorse)return{status:409,body:{error:'worse',message:'The cloud save is further along.',cloudRank:L.saveRank(cur.state),incomingRank:L.saveRank(inc)}};
  const why=plausible(inc);if(why)return{status:422,body:{error:'implausible',message:why}};
  inc.lastSeen=now;
  if(!await store.putSave(uid,inc,cur?.version??0,true))return{status:409,body:{error:'conflict',message:'Save changed elsewhere. Try again.'}};
  return{status:200,body:{...info,state:inc}};
 }
 if(op==='act'){
  const cur=await store.getSave(uid);if(!cur)return{status:404,body:{error:'nosave',message:'No cloud save yet.'}};
  if(!Array.isArray(body.actions)||body.actions.length>MAX_ACTIONS)return{status:400,body:{error:'bad',message:'Bad actions.'}};
  const s=structuredClone(cur.state),old=await store.getWeek(uid,week),w=old||L.blankWeek(week,s.sold);
  const results=applyActions(s,body.actions,now,rng,w);s.lastSeen=now;
  if(!await store.putSave(uid,s,cur.version,cur.imported))return{status:409,body:{error:'conflict',message:'Save changed elsewhere.'}};
  if(!old||results.some(r=>r.points))await store.putWeek(uid,w);
  return{status:200,body:{...info,state:s,results,score:w}};
 }
 if(op==='league'){
  const s=(await store.getSave(uid))?.state,mine=await store.getWeek(uid,week);
  const division=body.division||mine?.division||L.divisionFor(s?.sold||0);
  const rows=await store.listWeek(week,division,50);
  const out=[];for(const r of rows)out.push({uid:r.uid,name:await nameOf(r.uid),points:r.points,orders:r.orders,premiumJars:r.premiumJars,me:r.uid===uid});
  return{status:200,body:{...info,division,divisions:L.DIVISIONS.map(d=>d.id),rows:out,mine}};
 }
 if(op==='room'){
  const target=String(body.user||''),w=await store.getWeek(target,week),t=w&&await store.getSave(target);
  if(!t)return{status:404,body:{error:'noroom',message:'That room is not on this week’s board.'}};
  return{status:200,body:{...info,room:publicRoom(t.state,await nameOf(target),w,now)}};
 }
 if(op==='setName'){const n=cleanName(body.name);if(!n)return{status:400,body:{error:'name',message:'Use 3-16 letters, numbers or spaces.'}};await store.setName(uid,n);return{status:200,body:{name:n}};}
 return{status:400,body:{error:'op',message:'Unknown request.'}};
}

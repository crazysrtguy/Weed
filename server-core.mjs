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
// ---------- Pay-by-sending orders (devnet). `pay` = {config, newReference(), findPayment(order)} is injected by the host. ----------
export const ORDER_TTL_MS=24*3600e3,MAX_PENDING=3,CHECK_GAP_MS=4000;
export function priceRaw(cfg,item,method){
 const it=cfg.items?.[item];if(!it)return null;
 const v=method==='sol'?it.sol:method==='token'?it.token:null;if(!(v>0))return null;
 return method==='sol'?Math.round(v*1e9):Math.round(v*10**cfg.decimals);
}
const orderView=(o,cfg)=>({id:o.id,item:o.item,method:o.method,amountRaw:Number(o.amount_raw),decimals:o.method==='sol'?9:cfg.decimals,reference:o.reference,
 treasury:cfg.treasuryOwner,mint:o.method==='token'?cfg.mint:null,status:o.status,expiresAt:Date.parse(o.expires_at),signature:o.signature??null});
async function payOps({store,uid,now,body,pay,op}){
 if(!pay)return{status:503,body:{error:'pay',message:'Payments are not enabled on this server.'}};
 const cfg=pay.config;
 if(op==='orders'){return{status:200,body:{orders:(await store.listOrders(uid)).map(o=>orderView(o,cfg)),items:await store.listItems(uid),catalog:cfg.items,decimals:cfg.decimals,treasury:cfg.treasuryOwner,mint:cfg.mint,symbol:cfg.symbol}};}
 if(op==='orderCreate'){
  const item=String(body.item||''),method=String(body.method||''),amt=priceRaw(cfg,item,method);
  if(amt===null)return{status:400,body:{error:'bad',message:'Unknown item or coin.'}};
  if((await store.listItems(uid)).includes(item))return{status:409,body:{error:'owned',message:'You already own that.'}};
  const open=(await store.listOrders(uid)).filter(o=>o.status==='pending'&&Date.parse(o.expires_at)>now);
  const same=open.find(o=>o.item===item&&o.method===method);if(same)return{status:200,body:{order:orderView(same,cfg),reused:true}};
  if(open.length>=MAX_PENDING)return{status:429,body:{error:'limit',message:'Too many open orders. Pay or wait for one to expire.'}};
  const o=await store.createOrder({user_id:uid,item,method,amount_raw:amt,reference:pay.newReference(),expires_at:new Date(now+ORDER_TTL_MS).toISOString()});
  return{status:200,body:{order:orderView(o,cfg)}};
 }
 if(op==='orderCheck'){
  const o=await store.getOrder(uid,String(body.id||''));if(!o)return{status:404,body:{error:'noorder',message:'Order not found.'}};
  if(o.status==='paid')return{status:200,body:{order:orderView(o,cfg),paid:true,items:await store.listItems(uid)}};
  if(Date.parse(o.expires_at)<=now)return{status:410,body:{error:'expired',message:'This order expired. Create a new one.'}};
  if(!await store.claimCheck(o.id,CHECK_GAP_MS))return{status:429,body:{error:'slow',message:'Checking… try again in a few seconds.'}};
  let r;try{r=await pay.findPayment(o);}catch(e){return{status:200,body:{order:orderView(o,cfg),paid:false,reason:'The network is busy. Try again shortly.'}};}
  if(!r.ok)return{status:200,body:{order:orderView(o,cfg),paid:false,reason:r.reason==='no payment yet'?'No payment seen yet.':r.reason}};
  const done=await store.settle(o.id,r.signature,r.payer);
  const fresh=await store.getOrder(uid,o.id);
  return{status:200,body:{order:orderView(fresh,cfg),paid:fresh.status==='paid',settledNow:done,items:await store.listItems(uid),reason:fresh.status==='paid'?'':'That payment was already used for another order.'}};
 }
 return null;
}

export async function handle({store,uid,now,rng=Math.random,body,pay}){
 const op=body?.op,week=L.weekId(now),info={now,week,weekEnd:L.weekEnd(week)};
 const nameOf=async(u)=>(await store.getName(u))||defaultName(u);
 if(op==='orders'||op==='orderCreate'||op==='orderCheck')return payOps({store,uid,now,body,pay,op});
 if(op==='load'){const s=await store.getSave(uid);return{status:200,body:{...info,state:s?.state??null,name:await nameOf(uid),score:await store.getWeek(uid,week),items:store.listItems?await store.listItems(uid):[]}};}
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

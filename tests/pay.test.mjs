import test from 'node:test';
import assert from 'node:assert/strict';
import {handle,priceRaw,ORDER_TTL_MS,MAX_PENDING,CHECK_GAP_MS} from '../server-core.mjs';
import {PAY_CONFIG} from '../supabase/functions/_shared/pay-config.mjs';

const T0=Date.UTC(2026,9,17,12);
let refN=0;
function payStore(){
 const orders=[],items=new Map(),sigs=new Set();
 return{orders,items,
  async getSave(){return null;},async getName(){return null;},async getWeek(){return null;},
  async listOrders(u){return orders.filter(o=>o.user_id===u).map(o=>({...o}));},
  async listItems(u){return[...(items.get(u)||[])];},
  async createOrder(r){const o={id:'00000000-0000-4000-8000-'+String(orders.length).padStart(12,'0'),status:'pending',signature:null,last_checked:null,...r};orders.push(o);return{...o};},
  async getOrder(u,id){const o=orders.find(x=>x.id===id&&x.user_id===u);return o&&{...o};},
  async claimCheck(id,gap){const o=orders.find(x=>x.id===id);if(o.status!=='pending'||(o.last_checked!==null&&o.last_checked>Date.now()-gap))return false;o.last_checked=Date.now();return true;},
  // mirrors hs_settle_order: pending->paid + grant item in one step, unique signature
  async settle(id,sig,payer){const o=orders.find(x=>x.id===id);if(o.status!=='pending'||sigs.has(sig))return false;sigs.add(sig);o.status='paid';o.signature=sig;o.payer=payer;
   (items.get(o.user_id)||items.set(o.user_id,new Set()).get(o.user_id)).add(o.item);return true;}};
}
function mkPay(found){return{config:PAY_CONFIG,newReference:()=>'REF'+(++refN),calls:[],async findPayment(o){this.calls.push(o);if(found instanceof Function)return found(o);return found;}};}
const noWait=(st)=>{for(const o of st.orders)o.last_checked=null;};   // lets tests skip the throttle gap
const call=(st,pay,uid,body,now=T0)=>handle({store:st,uid,now,body,pay});

test('prices come from the server catalog, in exact base units',()=>{
 assert.equal(priceRaw(PAY_CONFIG,'rack','sol'),50_000_000);
 assert.equal(priceRaw(PAY_CONFIG,'rack','token'),150_000_000);
 assert.equal(priceRaw(PAY_CONFIG,'nope','sol'),null);assert.equal(priceRaw(PAY_CONFIG,'rack','btc'),null);
});

test('client cannot choose the price: order amount is set by the server and body fields are ignored',async()=>{
 const st=payStore(),pay=mkPay({ok:false,reason:'no payment yet'});
 const r=await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol',amountRaw:1,amount:0.000001,price:1});
 assert.equal(r.status,200);assert.equal(r.body.order.amountRaw,50_000_000);assert.equal(r.body.order.treasury,PAY_CONFIG.treasuryOwner);
 assert.match(r.body.order.reference,/^REF/);assert.equal(r.body.order.status,'pending');
 const t=await call(st,pay,'u1',{op:'orderCreate',item:'lamp',method:'token'});
 assert.equal(t.body.order.amountRaw,100_000_000);assert.equal(t.body.order.mint,PAY_CONFIG.mint);
});

test('bad items/coins refused; same open order is reused; open orders are capped',async()=>{
 const st=payStore(),pay=mkPay({ok:false});
 assert.equal((await call(st,pay,'u1',{op:'orderCreate',item:'nope',method:'sol'})).status,400);
 assert.equal((await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'doge'})).status,400);
 const a=await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'}),b=await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'});
 assert.equal(a.body.order.id,b.body.order.id);assert.equal(st.orders.length,1);
 await call(st,pay,'u1',{op:'orderCreate',item:'lamp',method:'sol'});await call(st,pay,'u1',{op:'orderCreate',item:'bench',method:'sol'});
 assert.equal(MAX_PENDING,3);
 const over=await call(st,pay,'u1',{op:'orderCreate',item:'storage',method:'sol'});assert.equal(over.status,429);
});

test('unpaid order stays pending and grants nothing',async()=>{
 const st=payStore(),pay=mkPay({ok:false,reason:'no payment yet'});
 const o=(await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'})).body.order;
 const c=await call(st,pay,'u1',{op:'orderCheck',id:o.id});
 assert.equal(c.status,200);assert.equal(c.body.paid,false);assert.deepEqual(await st.listItems('u1'),[]);
});

test('a finalized payment settles once, grants the item once, and is idempotent',async()=>{
 const st=payStore(),pay=mkPay({ok:true,signature:'SIG1',payer:'PAYER1'});
 const o=(await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'})).body.order;
 const c=await call(st,pay,'u1',{op:'orderCheck',id:o.id});
 assert.equal(c.body.paid,true);assert.deepEqual(c.body.items,['rack']);assert.equal(st.orders[0].payer,'PAYER1');
 const again=await call(st,pay,'u1',{op:'orderCheck',id:o.id});assert.equal(again.body.paid,true);assert.equal(pay.calls.length,1,'no second chain lookup for a paid order');
 const dup=await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'token'});assert.equal(dup.status,409,'cannot buy what you own');
});

test('the checker is told the stored amount, method and reference, not anything from the client',async()=>{
 const st=payStore(),pay=mkPay({ok:false,reason:'no payment yet'});
 const o=(await call(st,pay,'u1',{op:'orderCreate',item:'bench',method:'token'})).body.order;
 await call(st,pay,'u1',{op:'orderCheck',id:o.id,amountRaw:1,reference:'EVIL',method:'sol'});
 const seen=pay.calls[0];assert.equal(seen.method,'token');assert.equal(Number(seen.amount_raw),200_000_000);assert.equal(seen.reference,o.reference);
});

test('one transaction cannot pay two orders (signature is unique)',async()=>{
 const st=payStore(),pay=mkPay({ok:true,signature:'SAME',payer:'P'});
 const a=(await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'})).body.order,b=(await call(st,pay,'u1',{op:'orderCreate',item:'lamp',method:'sol'})).body.order;
 assert.equal((await call(st,pay,'u1',{op:'orderCheck',id:a.id})).body.paid,true);
 noWait(st);
 const r=await call(st,pay,'u1',{op:'orderCheck',id:b.id});
 assert.equal(r.body.paid,false);assert.match(r.body.reason,/already used/);assert.deepEqual(await st.listItems('u1'),['rack']);
});

test("nobody can check, settle or see another player's order",async()=>{
 const st=payStore(),pay=mkPay({ok:true,signature:'S',payer:'P'});
 const o=(await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'})).body.order;
 const r=await call(st,pay,'u2',{op:'orderCheck',id:o.id});assert.equal(r.status,404);assert.equal(pay.calls.length,0);
 assert.deepEqual((await call(st,pay,'u2',{op:'orders'})).body.orders,[]);
});

test('expired orders are refused; checks are throttled; network errors never grant',async()=>{
 const st=payStore(),pay=mkPay({ok:false,reason:'no payment yet'});
 const o=(await call(st,pay,'u1',{op:'orderCreate',item:'rack',method:'sol'})).body.order;
 assert.equal((await call(st,pay,'u1',{op:'orderCheck',id:o.id},T0+ORDER_TTL_MS+1)).status,410);
 assert.equal((await call(st,pay,'u1',{op:'orderCheck',id:o.id})).status,200);
 assert.equal((await call(st,pay,'u1',{op:'orderCheck',id:o.id})).status,429,'second check inside the gap');
 assert.ok(CHECK_GAP_MS>=3000);
 const boom=mkPay(()=>{throw new Error('rpc down');});noWait(st);
 const r=await call(st,boom,'u1',{op:'orderCheck',id:o.id});assert.equal(r.status,200);assert.equal(r.body.paid,false);assert.deepEqual(await st.listItems('u1'),[]);
});

test('payments off (no pay config) is a clean 503; malformed ids do not crash',async()=>{
 const st=payStore();
 assert.equal((await call(st,null,'u1',{op:'orderCreate',item:'rack',method:'sol'})).status,503);
 assert.equal((await call(st,mkPay({ok:false}),'u1',{op:'orderCheck',id:{x:1}})).status,404);
});

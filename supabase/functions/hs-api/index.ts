// deno-lint-ignore-file no-explicit-any
// High Stakes API. Verifies the caller's Supabase JWT, then runs the shared game rules with the SERVER clock.
import {createClient} from 'npm:@supabase/supabase-js@2';
import {handle} from '../_shared/server-core.mjs';
import * as chain from '../_shared/chain.mjs';
import {PAY_CONFIG} from '../_shared/pay-config.mjs';

const cors={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, apikey, content-type','access-control-allow-methods':'POST, OPTIONS'};
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});

const store={
 async getSave(uid:string){const{data}=await db.from('hs_saves').select('state,version,imported').eq('user_id',uid).maybeSingle();return data;},
 async putSave(uid:string,state:any,expected:number,imported:boolean){const{data,error}=await db.rpc('hs_put_save',{p_user:uid,p_state:state,p_expected:expected,p_imported:imported});if(error)throw error;return data===true;},
 async getWeek(uid:string,week:number){const{data}=await db.from('hs_weekly_scores').select('*').eq('user_id',uid).eq('week',week).maybeSingle();
  return data&&{week:data.week,division:data.division,points:data.points,orders:data.orders,premiumJars:data.premium_jars,quality:data.quality,perBuyer:data.per_buyer};},
 async putWeek(uid:string,w:any){const{error}=await db.from('hs_weekly_scores').upsert({user_id:uid,week:w.week,division:w.division,points:w.points,orders:w.orders,premium_jars:w.premiumJars,quality:w.quality,per_buyer:w.perBuyer,updated_at:new Date().toISOString()});if(error)throw error;},
 async listWeek(week:number,division:string,limit:number){const{data}=await db.from('hs_weekly_scores').select('user_id,points,orders,premium_jars').eq('week',week).eq('division',division).order('points',{ascending:false}).limit(limit);
  return(data||[]).map((r:any)=>({uid:r.user_id,points:r.points,orders:r.orders,premiumJars:r.premium_jars}));},
 async getName(uid:string){const{data}=await db.from('hs_profiles').select('display_name').eq('user_id',uid).maybeSingle();return data?.display_name??null;},
 async setName(uid:string,name:string){const{error}=await db.from('hs_profiles').upsert({user_id:uid,display_name:name});if(error)throw error;},
 // ---- pay-by-sending orders ----
 async listOrders(uid:string){const{data,error}=await db.from('hs_orders').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(20);if(error)throw error;return data||[];},
 async listItems(uid:string){const{data,error}=await db.from('hs_items').select('item').eq('user_id',uid);if(error)throw error;return(data||[]).map((r:any)=>r.item);},
 async createOrder(row:any){const{data,error}=await db.from('hs_orders').insert(row).select('*').single();if(error)throw error;return data;},
 async getOrder(uid:string,id:string){if(!/^[0-9a-f-]{36}$/i.test(id))return null;const{data}=await db.from('hs_orders').select('*').eq('id',id).eq('user_id',uid).maybeSingle();return data;},
 async claimCheck(id:string,gap:number){const{data,error}=await db.rpc('hs_claim_check',{p_order:id,p_gap_ms:gap});if(error)throw error;return data===true;},
 async settle(id:string,sig:string,payer:string){const{data,error}=await db.rpc('hs_settle_order',{p_order:id,p_signature:sig,p_payer:payer});if(error)throw error;return data===true;}
};

// Devnet only: chain.rpc refuses anything that is not a devnet/localhost URL.
const RPC=chain.assertDevnet(Deno.env.get('HS_RPC')||chain.DEVNET_RPC);
const pay={config:PAY_CONFIG,newReference:()=>chain.newReference(),
 findPayment:(o:any)=>chain.findPayment(RPC,{method:o.method,reference:o.reference,treasuryOwner:PAY_CONFIG.treasuryOwner,minAmountRaw:o.amount_raw,mint:o.method==='token'?PAY_CONFIG.mint:undefined,commitment:'finalized'})};

Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 const json=(status:number,body:any)=>new Response(JSON.stringify(body),{status,headers:{...cors,'content-type':'application/json'}});
 const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
 const{data:{user}}=await db.auth.getUser(token);
 if(!user)return json(401,{error:'auth',message:'Sign in first.'});
 try{
  const body=await req.json();
  const r=await handle({store,uid:user.id,now:Date.now(),body,pay});
  return json(r.status,r.body);
 }catch(e){console.error(e);return json(500,{error:'server',message:'Something went wrong.'});}
});

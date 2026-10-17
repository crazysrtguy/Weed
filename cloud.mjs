// Opt-in cloud save client. The game never needs this: if it is off, unconfigured or offline, local play is unchanged.
// When on, each successful local action is also sent to the server, which re-runs it with ITS clock and returns the
// authoritative save. Server timestamps are shifted by the measured clock skew so the room looks right on this phone.
import {CONFIG} from './cloud-config.mjs';
import * as L from './league.mjs';

const FLAG='high-stakes-cloud-v1',SDK='https://esm.sh/@supabase/supabase-js@2.45.4';
export const configured=()=>Boolean(CONFIG.url&&CONFIG.anonKey);
const store={get(){try{return localStorage.getItem(FLAG);}catch{return null;}},set(v){try{v?localStorage.setItem(FLAG,v):localStorage.removeItem(FLAG);}catch{}}};
export const enabled=()=>configured()&&store.get()==='1';

let sb=null,user=null,skew=0,pending=[],running=false,hooks={},status='off',week=null,name=null,score=null;
export const info=()=>({status,week,name,score,anonymous:user?.is_anonymous??null,email:user?.email??null,pending:pending.length,skew});
const setStatus=(s)=>{status=s;hooks.onStatus?.(s);};

// Shift server timestamps into this phone's clock frame (and back).
const SHIFT_KEYS=['nextEvent','lastSeen'];
export function shift(state,delta){
 const s=structuredClone(state),mv=(t)=>Number.isFinite(t)?t+delta:t;
 s.slots=s.slots.map(mv);s.dry=(s.dry||[]).map(b=>({...b,t:mv(b.t)}));for(const k of SHIFT_KEYS)s[k]=mv(s[k]);if(s.event)s.event={...s.event,at:mv(s.event.at)};return s;
}
export const fromServer=(state)=>shift(state,-skew);
export const toServer=(state)=>shift(state,skew);

async function client(){
 if(sb)return sb;
 const{createClient}=await import(SDK);
 sb=createClient(CONFIG.url,CONFIG.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
 sb.auth.onAuthStateChange((_e,s)=>{user=s?.user??null;});
 return sb;
}
async function token(){
 const c=await client();let{data:{session}}=await c.auth.getSession();
 if(!session){const r=await c.auth.signInAnonymously();if(r.error)throw r.error;session=r.data.session;}
 user=session.user;return session.access_token;
}
async function call(body){
 const t0=Date.now(),res=await fetch(`${CONFIG.url}/functions/v1/hs-api`,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+await token(),apikey:CONFIG.anonKey},body:JSON.stringify(body)});
 const data=await res.json().catch(()=>({}));
 if(data.now)skew=data.now-(t0+Date.now())/2; // server time minus our clock at the midpoint of the request
 if(data.week!==undefined)week={id:data.week,end:data.weekEnd};
 if(data.score!==undefined)score=data.score;
 return{status:res.status,body:data};
}

// ---- lifecycle ----
// init({onState(state), onStatus(text), local()}) : local() returns the current local save object.
export function init(h){hooks=h;const re=()=>connect().then(r=>r?.needsChoice&&hooks.onChoice?.(r)).catch(()=>{});if(enabled())re();addEventListener('online',()=>enabled()&&re());setInterval(()=>{if(!enabled())return;if(status==='on')sync();else if(status==='offline')re();},20000);}

export async function turnOn(){store.set('1');return connect(true);}
export async function turnOff(){store.set(null);pending=[];setStatus('off');}
export async function signOut(){await turnOff();try{await(await client()).auth.signOut();}catch{}user=null;}

// Connect, then reconcile the local and cloud saves. Resolves with {needsChoice,...} when the player must decide.
export async function connect(first=false){
 setStatus('connecting');
 let r;try{r=await call({op:'load'});}catch{setStatus('offline');throw new Error('offline');}
 if(r.status!==200){setStatus('error');throw new Error(r.body.message||'Cloud error');}
 name=r.body.name;const local=hooks.local(),cloud=r.body.state;
 if(!cloud){return importLocal(false);}
 const cs=fromServer(cloud),lr=L.saveRank(local),cr=L.saveRank(cs),playedLocal=local.harvests>0||local.sold>0;
 if(!playedLocal||(lr===cr&&!pending.length)){hooks.onState(cs);pending=[];setStatus('on');return{done:true};}
 setStatus('choice');return{needsChoice:true,local:summary(local),cloud:summary(cs),localRank:lr,cloudRank:cr};
}
const summary=(s)=>({sold:s.sold,harvests:s.harvests,cash:s.cash,upgrades:Object.values(s.upgrades).filter(Boolean).length});
// Player's choice after a conflict: 'cloud' keeps the cloud save, 'local' uploads this device's save.
export async function resolve(choice,confirmWorse=false){
 if(choice==='cloud'){const r=await call({op:'load'});hooks.onState(fromServer(r.body.state));pending=[];setStatus('on');return{done:true};}
 return importLocal(true,confirmWorse);
}
async function importLocal(replace,confirmWorse=false){
 const r=await call({op:'import',state:toServer(hooks.local()),replace,confirmWorse});
 if(r.status===200){hooks.onState(fromServer(r.body.state));pending=[];setStatus('on');return{done:true};}
 if(r.body.error==='worse')return{needsConfirmWorse:true,message:r.body.message};
 setStatus('error');return{error:r.body.message||'Could not upload your save.'};
}

// ---- actions ----
export function queue(t,a){if(status!=='on'&&status!=='offline')return;pending.push({t,a});if(pending.length>500)pending.shift();flush();}
async function flush(){if(running)return;running=true;
 try{while(pending.length){const batch=pending.slice(0,25);const r=await call({op:'act',actions:batch});
  if(r.status!==200){if(r.status===409){await sleep(300);continue;}throw new Error(r.body.message||'err');}
  pending.splice(0,batch.length);if(!pending.length)hooks.onState(fromServer(r.body.state));}
  if(status==='offline')setStatus('on');}
 catch{setStatus('offline');}finally{running=false;}}
export async function sync(){if(running)return;pending.push({t:'tick',a:[]});await flush();}
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

// ---- league ----
export const league=async(division)=>{const r=await call({op:'league',division});if(r.status!==200)throw new Error(r.body.message);return r.body;};
export const room=async(uid)=>{const r=await call({op:'room',user:uid});if(r.status!==200)throw new Error(r.body.message);return r.body.room;};
export const setName=async(n)=>{const r=await call({op:'setName',name:n});if(r.status!==200)throw new Error(r.body.message);name=r.body.name;return name;};
export async function emailLink(addr){const c=await client();await token();
 const r=user?.is_anonymous?await c.auth.updateUser({email:addr},{emailRedirectTo:location.href.split('#')[0]}):await c.auth.signInWithOtp({email:addr,options:{emailRedirectTo:location.href.split('#')[0]}});
 if(r.error)throw r.error;}
// Sign in with an email link on a device that has no cloud account yet (new anonymous user is replaced).
export async function signInEmail(addr){const c=await client();const r=await c.auth.signInWithOtp({email:addr,options:{emailRedirectTo:location.href.split('#')[0]}});if(r.error)throw r.error;}

// ---- devnet purchases (pay by sending; the server creates orders, prices them, and confirms them on chain) ----
const must=(r)=>{if(r.status>=400&&r.status!==429&&r.status!==410)throw new Error(r.body.message||'Payment service error');return r.body;};
export const orders=async()=>must(await call({op:'orders'}));
export const orderCreate=async(item,method)=>must(await call({op:'orderCreate',item,method}));
export const orderCheck=async(id)=>{const r=await call({op:'orderCheck',id});if(r.status===429)return{slow:true};if(r.status===410)return{expired:true};return must(r);};

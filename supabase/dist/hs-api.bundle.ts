// @ts-nocheck
import {createClient} from 'npm:@supabase/supabase-js@2';
const chain=(()=>{
const TOKEN_PROGRAM='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';            // legacy SPL Token
const TOKEN_2022_PROGRAM='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';        // Token-2022 (token extensions)
const MEMO_PROGRAM='MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const DEVNET_RPC='https://api.devnet.solana.com';
const LAMPORTS_PER_SOL=1_000_000_000;
function assertDevnet(url){
const u=String(url||'');
if(!/devnet|localhost|127\.0\.0\.1/i.test(u)||/mainnet/i.test(u))throw new Error(`Refusing non-devnet RPC: ${u}`);
return u;
}
async function rpc(url,method,params=[],{retries=6}={}){
assertDevnet(url);
for(let attempt=0;;attempt++){
let j;
try{
const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});
if(res.status===429)throw Object.assign(new Error('rate limited'),{retry:true});
j=await res.json();
}catch(e){if(attempt<retries&&(e.retry||e.name==='TypeError')){await new Promise(r=>setTimeout(r,500*2**attempt));continue;}throw e;}
if(j.error){
if(attempt<retries&&/rate limit|too many|429/i.test(j.error.message)){await new Promise(r=>setTimeout(r,500*2**attempt));continue;}
throw new Error(`${method}: ${j.error.message}`);
}
return j.result;
}
}
async function solBalance(url,owner){return(await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value/LAMPORTS_PER_SOL;}
async function lamportsBalance(url,owner){return BigInt((await rpc(url,'getBalance',[owner,{commitment:'confirmed'}])).value);}
/** Raw token amount (BigInt) the owner holds of `mint`, summed over their token accounts (works for Token and Token-2022). */
async function tokenBalanceRaw(url,owner,mint){
const r=await rpc(url,'getTokenAccountsByOwner',[owner,{mint},{encoding:'jsonParsed',commitment:'confirmed'}]);
return r.value.reduce((n,a)=>n+BigInt(a.account.data.parsed.info.tokenAmount.amount),0n);
}
const toUi=(raw,decimals)=>Number(raw)/10**decimals;
const toRaw=(ui,decimals)=>BigInt(Math.round(ui*10**decimals));
const solToLamports=sol=>BigInt(Math.round(sol*LAMPORTS_PER_SOL));
/** Wait until a signature reaches `commitment` (default finalized: cannot be rolled back). */
async function confirmSignature(url,signature,{commitment='finalized',timeoutMs=90000,intervalMs=1500}={}){
const want=commitment==='confirmed'?['confirmed','finalized']:['finalized'];
const end=Date.now()+timeoutMs;
while(Date.now()<end){
const r=await rpc(url,'getSignatureStatuses',[[signature],{searchTransactionHistory:true}]);
const s=r.value[0];
if(s){if(s.err)throw new Error('Transaction failed: '+JSON.stringify(s.err));if(want.includes(s.confirmationStatus))return s;}
await new Promise(r=>setTimeout(r,intervalMs));
}
throw new Error('Timed out waiting for confirmation');
}
const B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58(bytes){
let n=0n;for(const b of bytes)n=n*256n+BigInt(b);
let s='';while(n>0n){s=B58[Number(n%58n)]+s;n/=58n;}
for(const b of bytes){if(b===0)s='1'+s;else break;}
return s||'1';
}
/** A fresh one-time reference (32 random bytes as a base58 address) that ties one payment to one order. */
function newReference(){const b=new Uint8Array(32);globalThis.crypto.getRandomValues(b);return base58(b);}
const enc=encodeURIComponent;
/** Solana Pay transfer-request URL (what a wallet app opens). `splToken` omitted = native SOL. */
function solanaPayUrl({recipient,amount,splToken,reference,label,message,memo}){
const q=[`amount=${enc(String(amount))}`];
if(splToken)q.push(`spl-token=${enc(splToken)}`);
q.push(`reference=${enc(reference)}`);
if(label)q.push(`label=${enc(label)}`);
if(message)q.push(`message=${enc(message)}`);
if(memo)q.push(`memo=${enc(memo)}`);
return `solana:${recipient}?${q.join('&')}`;
}
const formatAmount=(raw,decimals)=>{const s=(Number(raw)/10**decimals).toFixed(decimals);return s.replace(/\.?0+$/,'')||'0';};
/**
* Decide, from one parsed transaction, whether it pays an order. Pure function (no network), so it is unit tested with
* crafted adversarial transactions. It checks balance CHANGES, not instruction shapes, so any wallet's way of sending works.
*   - the transaction succeeded
*   - the order's one-time `reference` is in the transaction as a non-signer account
*   - the treasury's balance rose by at least `minAmountRaw` (SOL: lamports of `treasuryOwner`; token: `mint` owned by `treasuryOwner`)
*   - a signer actually paid that amount (so `payer` is a real sender, used to link a wallet by sending)
*/
function evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint}){
if(!tx)return{ok:false,reason:'not found'};
if(tx.meta?.err)return{ok:false,reason:'transaction failed'};
const keys=tx.transaction.message.accountKeys.map(k=>typeof k==='string'?{pubkey:k,signer:false}:k);
const ref=keys.find(k=>k.pubkey===reference);
if(!ref)return{ok:false,reason:'reference not in transaction'};
if(ref.signer)return{ok:false,reason:'reference must not be a signer'};
const min=BigInt(minAmountRaw);if(min<=0n)return{ok:false,reason:'invalid required amount'};
const m=tx.meta;let received=0n,payer=null;
if(method==='sol'){
const t=keys.findIndex(k=>k.pubkey===treasuryOwner);
if(t<0)return{ok:false,reason:'treasury not in transaction'};
received=BigInt(m.postBalances[t])-BigInt(m.preBalances[t]);
let worst=0n;
keys.forEach((k,i)=>{if(!k.signer)return;const d=BigInt(m.postBalances[i])-BigInt(m.preBalances[i]);if(d<worst&&-d>=min){worst=d;payer=k.pubkey;}});
}else{
if(!mint)return{ok:false,reason:'mint required'};
const sum=(list,owner)=>(list||[]).filter(b=>b.mint===mint&&(owner?b.owner===owner:true));
const amt=b=>BigInt(b.uiTokenAmount.amount);
const after=sum(m.postTokenBalances,treasuryOwner).reduce((n,b)=>n+amt(b),0n),before=sum(m.preTokenBalances,treasuryOwner).reduce((n,b)=>n+amt(b),0n);
received=after-before;
const owners=new Set(sum(m.preTokenBalances).map(b=>b.owner));
for(const o of owners){
if(o===treasuryOwner)continue;
const a=sum(m.postTokenBalances,o).reduce((n,b)=>n+amt(b),0n),b0=sum(m.preTokenBalances,o).reduce((n,b)=>n+amt(b),0n);
if(b0-a>=min){payer=o;break;}
}
}
if(received<min)return{ok:false,reason:`treasury received ${received} but ${min} required`};
if(!payer)return{ok:false,reason:'no signer paid this amount'};
return{ok:true,method,amountRaw:received,payer,slot:tx.slot};
}
/** Look for a payment for one order by its reference. Only counts transactions at `commitment` (default finalized). */
async function findPayment(url,{method,reference,treasuryOwner,minAmountRaw,mint,commitment='finalized'}){
const sigs=await rpc(url,'getSignaturesForAddress',[reference,{limit:20,commitment}]);
for(const s of sigs){
if(s.err)continue;
const tx=await rpc(url,'getTransaction',[s.signature,{encoding:'jsonParsed',maxSupportedTransactionVersion:0,commitment}]);
const r=evaluatePayment(tx,{method,reference,treasuryOwner,minAmountRaw,mint});
if(r.ok)return{...r,signature:s.signature};
}
return{ok:false,reason:sigs.length?'no transaction paid enough':'no payment yet'};
}
return {DEVNET_RPC,LAMPORTS_PER_SOL,MEMO_PROGRAM,TOKEN_2022_PROGRAM,TOKEN_PROGRAM,assertDevnet,base58,confirmSignature,evaluatePayment,findPayment,formatAmount,lamportsBalance,newReference,rpc,solBalance,solToLamports,solanaPayUrl,toRaw,toUi,tokenBalanceRaw};})();
const payCfgNs=(()=>{
const PAY_CONFIG={
"cluster": "devnet",
"symbol": "HSTEST",
"decimals": 6,
"mint": "C8ubGCMojFyrQ7qCR2iDDzsPRu9XnfAjDStZiJoXgvEd",
"treasuryOwner": "Cpwe9TrAWuCSSvyYgqHfLnSCnRiM6eGjmUL2zAZq9X42",
"payoutWallet": "6vGH7fMhGN1HafPvEgnkXwWwjCnUL9fREp1b5rU1h8ab",
"items": {
"rack": {
"token": 150,
"sol": 0.05
},
"lamp": {
"token": 100,
"sol": 0.03
},
"bench": {
"token": 200,
"sol": 0.07
},
"storage": {
"token": 150,
"sol": 0.05
},
"link": {
"sol": 0.001
}
}
};
return {PAY_CONFIG};})();
const {PAY_CONFIG}=payCfgNs;
const E=(()=>{
const WEAR_LIMIT=12,SERVICE_COST=120,DRY_MS=60000,CURE_BONUS=.2;
const VERSION=2,DURATION=90000,STARTER_COST=25;
const STRAINS={
og:{id:'og',name:'Garage OG',tag:'Fast starter',time:90000,cost:25,jars:12,tier:1,value:1,unlock:0,art:false,tint:''},
'midnight-purple':{id:'midnight-purple',name:'Midnight Purple',tag:'Balanced',time:150000,cost:60,jars:12,tier:2,value:1.3,unlock:600,art:true,tint:''},
'citrus-riot':{id:'citrus-riot',name:'Citrus Riot',tag:'Premium',time:240000,cost:140,jars:12,tier:3,value:1.75,unlock:1800,art:true,tint:''},
frostbite:{id:'frostbite',name:'Frostbite',tag:'Rare, slow',time:360000,cost:300,jars:12,tier:4,value:2.4,unlock:4000,art:true,tint:''}
};
const ALIAS={purple:'midnight-purple',lemon:'citrus-riot',gold:'frostbite'}; // ids used by the earlier placeholder build
const STRAIN_IDS=Object.keys(STRAINS);
const OFFERS=[{id:'tony',thanks:'Customers asked questions. Good ones. Pleasure doing business.',name:'Tony’s Dispensary',need:8,pay:640,line:'Put a label on it this time. My customers ask questions.'},{id:'bryce',thanks:'Elevated. That is the word. Elevated.',name:'Bryce Botanicals',need:12,pay:1040,minTier:2,line:'It’s not expensive. It’s an elevated brand experience.'},{id:'rick',thanks:'It actually showed up! Terrible parking, great product.',name:'Cousin Rick',need:4,pay:260,line:'Small order. Big dreams. Terrible parking.'}];
const UPGRADES=[{id:'expansion',name:'More grow space',cost:600,art:'storage',description:'Unlock two more pots and install storage shelves.'},{id:'equipment',name:'Better equipment',cost:900,art:'rack',description:'Upgrade production: 15 jars per harvest instead of 12.'},{id:'lights',name:'Pro LED lights',cost:900,art:'lamp-pro',description:'Six-bar stainless LEDs over every pot: all crops grow 20% faster.'},{id:'workstation',name:'Trim workstation',cost:1400,art:'bench-pro',description:'A proper stainless trimming station: +2 jars from every harvest.'},{id:'ventilation',name:'Inline ventilation',cost:600,art:'vent',description:'A filtered inline fan: the exhaust-fan incident can never hit your garage again.'},{id:'irrigation',name:'Flood tray irrigation',cost:1000,art:'flood-tray',description:'Flood trays under every pot water your crops automatically, so the watering bonus is always on.'},{id:'drying',name:'Drying line',cost:1100,art:'branch',description:'Hang harvests on a drying line: each batch finishes in 60 seconds and pays +20% jars when you collect it.'},{id:'staff',name:'Hire Marcus',cost:1200,art:'marcus-portrait',description:'Marcus replants every harvested pot for free and feeds your crops. You still collect them.'}];
const SKINS=[{id:'rack',name:'Black & Gold rack',price:150},{id:'lamp',name:'Black & Gold light',price:100},{id:'bench',name:'Black & Gold bench',price:200},{id:'storage',name:'Black & Gold shelves',price:150}];
function fresh(now=Date.now()){return{version:2,cash:500,jars:0,sold:0,harvests:0,testCredits:1000,upgrades:{expansion:false,equipment:false,staff:false,lights:false,workstation:false,ventilation:false,irrigation:false,drying:false},slots:[now-DURATION,now-DURATION,now-60000,now-30000,null,null],kinds:['og','og','og','og',null,null],stock:Object.fromEntries(STRAIN_IDS.map(id=>[id,0])),owned:[],equipped:[],sound:false,lastSeen:now,event:null,nextEvent:now+90000,lastEvent:null,crew:0,planted:0,tut:0,care:[0,0,0,0,0,0],wear:0,dry:[]};}
function normalize(raw,now=Date.now()){
const s=fresh(now);if(!raw||typeof raw!=='object')return s;
for(const k of ['cash','jars','sold','harvests'])if(Number.isFinite(raw[k])&&raw[k]>=0)s[k]=Math.floor(raw[k]);
for(const k of ['expansion','equipment','staff','lights','workstation','ventilation','irrigation','drying'])s.upgrades[k]=Boolean(raw.upgrades?.[k]??raw[k]);
s.slots=Array.from({length:s.upgrades.expansion?8:6},(_,i)=>Number.isFinite(raw.slots?.[i])?Math.max(0,Math.min(now,raw.slots[i])):null);
if(raw.version===2){s.testCredits=Number.isFinite(raw.testCredits)&&raw.testCredits>=0?Math.floor(raw.testCredits):1000;s.owned=SKINS.filter(x=>raw.owned?.includes(x.id)).map(x=>x.id);s.equipped=s.owned.filter(id=>raw.equipped?.includes(id));}
const rk=k=>ALIAS[k]||k;s.kinds=s.slots.map((t,i)=>t===null?null:(STRAINS[rk(raw.kinds?.[i])]?rk(raw.kinds[i]):'og'));
s.stock={og:0};for(const id of STRAIN_IDS){const old=Object.keys(ALIAS).find(k=>ALIAS[k]===id);const n=raw.stock?.[id]??raw.stock?.[old];s.stock[id]=Number.isFinite(n)&&n>0?Math.floor(n):0;}
if(!raw.stock)s.stock.og=s.jars;sync(s);
s.event=EVENTS.some(x=>x.id===raw.event?.id)?{id:raw.event.id,at:Number.isFinite(raw.event.at)?raw.event.at:now}:null;s.care=s.slots.map((t,i)=>t!==null&&Number.isInteger(raw.care?.[i])?raw.care[i]&3:0);s.wear=Number.isFinite(raw.wear)&&raw.wear>0?Math.min(WEAR_LIMIT*2,raw.wear):0;s.dry=(Array.isArray(raw.dry)?raw.dry:[]).filter(b=>b&&STRAINS[b.k]&&Number.isFinite(b.n)&&b.n>0&&Number.isFinite(b.t)).slice(0,dryCap(s)).map(b=>({k:b.k,n:Math.floor(b.n),t:b.t}));s.planted=Number.isFinite(raw.planted)&&raw.planted>0?Math.floor(raw.planted):0;s.tut=Number.isInteger(raw.tut)&&raw.tut>=0&&raw.tut<=TUT_DONE?raw.tut:(s.harvests>0?TUT_DONE:0);s.crew=Number.isFinite(raw.crew)&&raw.crew>0?Math.min(10,Math.floor(raw.crew)):0;s.lastEvent=EVENTS.some(x=>x.id===raw.lastEvent)?raw.lastEvent:null;s.nextEvent=Number.isFinite(raw.nextEvent)?raw.nextEvent:now+90000;
s.sound=Boolean(raw.sound);s.lastSeen=Number.isFinite(raw.lastSeen)?raw.lastSeen:now;return s;
}
function progress(t,now=Date.now(),dur=DURATION){return t===null?0:Math.min(1,Math.max(0,(now-t)/dur));}
function stage(t,now=Date.now(),dur=DURATION){const p=progress(t,now,dur);return p<.22?'starter':p<.52?'young':p<1?'developed':'ready';}
function dur(s,i){return Math.round((STRAINS[s.kinds?.[i]]?.time??DURATION)*(s.upgrades?.lights?.8:1)*((s.wear||0)>=WEAR_LIMIT?1.25:1));}
function prog(s,i,now=Date.now()){return progress(s.slots[i],now,dur(s,i));}
function stg(s,i,now=Date.now()){return stage(s.slots[i],now,dur(s,i));}
function left(s,i,now=Date.now()){return Math.ceil((1-prog(s,i,now))*dur(s,i)/1000);}
function isUnlocked(s,id){return Boolean(STRAINS[id])&&s.sold>=STRAINS[id].unlock;}
function total(s){return STRAIN_IDS.reduce((n,id)=>n+(s.stock[id]||0),0);}
function sync(s){const d=s.jars-total(s);if(d>0)s.stock.og=(s.stock.og||0)+d;else if(d<0){let r=-d;for(const id of STRAIN_IDS){const t=Math.min(r,s.stock[id]||0);s.stock[id]=(s.stock[id]||0)-t;r-=t;}}}
function readyCount(s,now=Date.now()){return s.slots.filter((t,i)=>t!==null&&prog(s,i,now)>=1).length;}
function plant(s,i,now=Date.now(),id='og'){const st=STRAINS[id];if(!st)return{ok:false,message:'Unknown strain.'};if(!Number.isInteger(i)||i<0||i>=s.slots.length)return{ok:false,message:'Invalid slot.'};if(s.slots[i]!==null)return{ok:false,message:'This pot is already growing.'};if(!isUnlocked(s,id))return{ok:false,message:`${st.name} unlocks at $${st.unlock.toLocaleString()} lifetime sales.`};if(s.cash<st.cost)return{ok:false,message:`${st.name} seeds cost $${st.cost}. Sell your jars first.`};s.cash-=st.cost;s.slots[i]=now;s.kinds[i]=id;s.care[i]=0;s.planted++;return{ok:true,message:`${st.name} planted · ready in ${Math.round(st.time/1000)} seconds.`};}
function harvest(s,i,now=Date.now()){if(!Number.isInteger(i)||i<0||i>=s.slots.length||s.slots[i]===null||prog(s,i,now)<1)return{ok:false,message:'This crop is not ready yet.'};const id=s.kinds[i]||'og',done=(careDone(s,i,'water')?1:0)+(careDone(s,i,'feed')?1:0),jars=Math.round(STRAINS[id].jars*(s.upgrades.equipment?1.25:1)*(1+.15*done))+(s.upgrades.workstation?2:0)+(s.crew>0?2:0);if(s.crew>0)s.crew--;sync(s);const dried=s.dry.length<dryCap(s);if(dried)s.dry.push({k:id,n:jars,t:now+DRY_MS});else{s.jars+=jars;s.stock[id]=(s.stock[id]||0)+jars;}s.harvests++;s.wear=(s.wear||0)+(s.upgrades.ventilation?.5:1);s.care[i]=0;if(s.upgrades.staff)s.slots[i]=now;else{s.slots[i]=null;s.kinds[i]=null;}return{ok:true,jars,id,dried,care:done,message:`${STRAINS[id].name} harvested · ${dried?`${jars} jars hung to dry`:`+${jars} jars`}${done?` · care bonus x${done}`:''}${s.upgrades.staff?' · Marcus replanted':''}`};}
function eligible(s,o){sync(s);return STRAIN_IDS.filter(id=>STRAINS[id].tier>=(o.minTier||1)).reduce((n,id)=>n+(s.stock[id]||0),0);}
function sell(s,id){const o=OFFERS.find(o=>o.id===id);if(!o)return{ok:false,message:'Unknown buyer.'};const have=eligible(s,o);if(have<o.need)return{ok:false,message:o.minTier&&total(s)>=o.need?`${o.name} only takes premium strains. Need ${o.need-have} more.`:`You need ${o.need-s.jars} more jars.`};let r=o.need,val=0;for(const sid of STRAIN_IDS.filter(x=>STRAINS[x].tier>=(o.minTier||1))){const t=Math.min(r,s.stock[sid]||0);s.stock[sid]-=t;r-=t;val+=t*STRAINS[sid].value;}const pay=Math.round(o.pay*val/o.need);s.jars-=o.need;s.cash+=pay;s.sold+=pay;return{ok:true,pay,message:`Order delivered · +$${pay.toLocaleString()}`};}
function buyUpgrade(s,id){const u=UPGRADES.find(u=>u.id===id);if(!u||s.upgrades[id])return{ok:false,message:'Upgrade already installed.'};if(s.cash<u.cost)return{ok:false,message:'Earn more game cash by completing orders.'};s.cash-=u.cost;s.upgrades[id]=true;if(id==='expansion'){s.slots.push(null,null);s.kinds.push(null,null);s.care.push(0,0);}return{ok:true,message:u.name+' unlocked.'};}
function buySkin(s,id){const k=SKINS.find(k=>k.id===id);if(!k)return{ok:false,message:'Unknown style.'};if(s.owned.includes(id))return{ok:false,message:'You already own this style.'};if(s.testCredits<k.price)return{ok:false,message:'Not enough test credits.'};s.testCredits-=k.price;s.owned.push(id);if(!s.equipped.includes(id))s.equipped.push(id);return{ok:true,message:'Style purchased with TEST credits and equipped.'};}
function equip(s,id){if(!s.owned.includes(id))return{ok:false,message:'Purchase this style first.'};s.equipped=s.equipped.includes(id)?s.equipped.filter(x=>x!==id):[...s.equipped,id];return{ok:true,message:s.equipped.includes(id)?'Style equipped.':'Original style restored.'};}
function rescue(s){if(s.cash>=25||s.jars>=4||s.slots.some(t=>t!==null))return{ok:false,message:'Your operation still has resources.'};s.cash=25;return{ok:true,message:'Rick found you a $25 starter grant. Back in business.'};}
const EVENTS=[
{id:'fan',title:'The exhaust fan just died',art:'marcus-portrait',body:'It rattled, coughed, and gave up. Your handyman Dale says he can look at it. "Probably."',
options:[{id:'repair',label:'Pay $80 for a proper repair',hint:'Safe. Dale is offended.',cost:80},{id:'dale',label:'Let Dale handle it',hint:'Free. 50% it works, 50% your crops sweat and run 15% slower.'}]},
{id:'inspection',title:'Landlord scheduled an inspection',art:null,body:'"Just checking the garage. Why is it so humid in here?"',
options:[{id:'tarps',label:'Hide everything with tarps ($60)',hint:'Safe. He leaves suspicious but satisfied.',cost:60},{id:'wing',label:'Wing it',hint:'55%: he’s oddly impressed and tips you $200. 45%: $150 fine.'}]},
{id:'friend',title:'Rick brought a friend',art:'rick',body:'"This is Kyle. Kyle is very motivated." Kyle is holding a gas-station hot dog and has not made eye contact.',
options:[{id:'hire',label:'Hire Kyle for $100',hint:'He trims fast: your next 3 harvests give +2 jars each.',cost:100},{id:'trial',label:'Free trial shift',hint:'50%: he trims 4 extra Garage OG jars. 50%: he samples 3 jars.'}]},
{id:'contest',title:'A rival challenges you to a contest',art:'bryce',body:'"Best flower in town. Judges are impartial." The judges are his cousins.',
options:[{id:'enter',label:'Enter 4 premium jars',hint:'Needs 4 jars of tier 2+. Odds rise with strain tier. Win $800.',jars:4,minTier:2},{id:'skip',label:'Decline politely',hint:'Nothing happens. Your pride takes a small hit.'}]},
{id:'packaging',title:'Bryce wants luxury packaging',art:'bryce',body:'"Premium presentation. Matte black. Embossed. Also, it should be cheap."',
options:[{id:'pack',label:'Rebrand 6 jars for $120',hint:'Uses your lowest-tier jars. Pays 130 per jar-value. Needs 6 jars.',cost:120,jars:6},{id:'artisanal',label:'Insist it is already artisanal',hint:'50%: he is moved and pays $250. 50%: he asks for the manager.'}]},
{id:'celebrity',title:'A celebrity mentioned your brand',art:'tony',body:'Sort of. They said "some guy in a garage." Phones are ringing anyway.',
options:[{id:'rush',label:'Fill a rush order: 6 jars for double pay',hint:'Uses your lowest-tier jars. Needs 6 jars in stock.',jars:6},{id:'hype',label:'Ride the hype',hint:'No stock needed. A fan "tips" you $150 and a weird poem.'}]}
];
function takeJars(s,n,minTier=1){sync(s);let r=n,val=0,maxTier=0;for(const sid of STRAIN_IDS.filter(x=>STRAINS[x].tier>=minTier)){const t=Math.min(r,s.stock[sid]||0);if(t>0)maxTier=Math.max(maxTier,STRAINS[sid].tier);s.stock[sid]=(s.stock[sid]||0)-t;r-=t;val+=t*STRAINS[sid].value;}s.jars-=n-r;return{val,maxTier,taken:n-r};}
function eligibleJars(s,minTier){return STRAIN_IDS.filter(id=>STRAINS[id].tier>=minTier).reduce((n,id)=>n+(s.stock[id]||0),0);}
function optionOk(s,o){sync(s);return(!o.cost||s.cash>=o.cost)&&(!o.jars||eligibleJars(s,o.minTier||1)>=o.jars);}
function maybeEvent(s,now=Date.now(),rng=Math.random){
if(s.event||now<s.nextEvent||s.harvests<2)return null;
const pool=EVENTS.filter(x=>x.id!==s.lastEvent&&!(x.id==='fan'&&s.upgrades.ventilation)),ev=pool[Math.floor(rng()*pool.length)];
s.event={id:ev.id,at:now};return ev;
}
function resolveEvent(s,optId,now=Date.now(),rng=Math.random){
const ev=EVENTS.find(x=>x.id===s.event?.id);if(!ev)return{ok:false,message:'Nothing needs your attention.'};
const o=ev.options.find(x=>x.id===optId);if(!o)return{ok:false,message:'Pick one of the options.'};
if(!optionOk(s,o))return{ok:false,message:o.cost?`You need ${money(o.cost)} for that.`:'You do not have enough jars.'};
let message;
if(o.cost)s.cash-=o.cost;
if(ev.id==='fan'){
if(o.id==='repair')message='Fan fixed properly. Dale is still offended.';
else if(rng()<.5)message='Dale fixed it with zip ties. It works. Nobody knows why.';
else{s.slots.forEach((t,i)=>{if(t!==null&&prog(s,i,now)<1)s.slots[i]=t+Math.round(dur(s,i)*.15);});message='Dale made it worse. Crops are sweating: growth set back 15%.';}
}else if(ev.id==='inspection'){
if(o.id==='tarps')message='He saw a very clean garage and left suspicious but satisfied.';
else if(rng()<.55){s.cash+=200;message='He asked if you sell "that lemon thing" and tipped you $200.';}
else{const f=Math.min(150,s.cash);s.cash-=f;message=`Fined ${money(f)} for "unpermitted humidity".`;}
}else if(ev.id==='friend'){
if(o.id==='hire'){s.crew=Math.min(10,s.crew+3);message='Kyle is on the payroll. He trims like his life depends on it.';}
else if(rng()<.5){s.jars+=4;s.stock.og+=4;message='Kyle trimmed 4 extra Garage OG jars and has not stopped talking about it.';}
else{const t=takeJars(s,3).taken;message=t?`Kyle sampled ${t} jars. He is now very relaxed and not very useful.`:'Kyle looked at your empty shelves and left.';}
}else if(ev.id==='contest'){
if(o.id==='skip')message='You declined. Someone local is already telling a different story.';
else{const{maxTier}=takeJars(s,4,2);if(rng()<.3+.1*maxTier){s.cash+=800;s.sold+=800;message='You won the contest. The judges were tied on cousins. +$800';}else message='You lost. The winning jar was suspiciously glossy.';}
}else if(ev.id==='packaging'){
if(o.id==='pack'){const{val}=takeJars(s,6);const pay=Math.round(val*130);s.cash+=pay;s.sold+=pay;message=`Matte black. Embossed. Cheap. Bryce paid ${money(pay)}.`;}
else if(rng()<.5){s.cash+=250;s.sold+=250;message='Bryce was moved by your confidence. +$250';}
else message='He asked for the manager. You are the manager.';
}else if(ev.id==='celebrity'){
if(o.id==='rush'){const{val}=takeJars(s,6);const pay=Math.round(val*160);s.cash+=pay;s.sold+=pay;message=`Rush order delivered · +${money(pay)}`;}
else{s.cash+=150;message='A fan tipped you $150 and left a weird poem.';}
}
s.event=null;s.lastEvent=ev.id;s.nextEvent=now+120000+Math.round(rng()*120000);
return{ok:true,message};
}
function money(n){return'$'+Math.round(n).toLocaleString();}
const TUT_DONE=6;
const TUTORIAL=[
{text:'Your first crops are ready. Tap a glowing pot label to harvest.'},
{text:'Collect everything that is ready at once with Harvest all.'},
{text:'Buyers want your jars. Open Orders.'},
{text:'Tony pays $640 for 8 jars. Deliver his order.'},
{text:'Empty pot? Tap it, pick a strain, and keep the cycle going.'},
{text:'Cash buys upgrades. Open Build to see what is next.'}
];
function tutorialAdvance(s,ctx={}){let n=0;while(s.tut<TUT_DONE){const t=s.tut,ok=t===0?s.harvests>=1:t===1?s.harvests>=2||readyCount(s)===0:t===2?ctx.tab==='orders':t===3?s.sold>0:t===4?s.planted>=1:ctx.tab==='build';if(!ok)break;s.tut++;n++;}return n;}
const CARE={water:{at:.33,label:'Water'},feed:{at:.66,label:'Feed'}};
function careDone(s,i,kind){const bit=kind==='water'?1:2;return Boolean((s.care?.[i]||0)&bit)||Boolean(kind==='water'?s.upgrades.irrigation:s.upgrades.staff);}
function careNeeded(s,i,now=Date.now()){if(s.slots[i]===null)return null;const p=prog(s,i,now);if(p>=1)return null;for(const k of['water','feed'])if(p>=CARE[k].at&&!careDone(s,i,k))return k;return null;}
function tend(s,i,now=Date.now()){const kind=careNeeded(s,i,now);if(!kind)return{ok:false,message:'Nothing needs care right now.'};s.care[i]=(s.care[i]||0)|(kind==='water'?1:2);return{ok:true,kind,message:kind==='water'?'Watered':'Fed'};}
function tendAll(s,now=Date.now()){let n=0;for(let i=0;i<s.slots.length;i++)for(let g=0;g<2;g++)if(tend(s,i,now).ok)n++;return n;}
function careCount(s,now=Date.now()){return s.slots.filter((t,i)=>careNeeded(s,i,now)).length;}
function service(s){if((s.wear||0)<6)return{ok:false,message:'Your equipment is still in good shape.'};if(s.cash<SERVICE_COST)return{ok:false,message:`Servicing costs ${money(SERVICE_COST)}.`};s.cash-=SERVICE_COST;s.wear=0;return{ok:true,message:'Bulbs swapped, filters changed, lamps cleaned. Like new.'};}
function dryCap(s){return s.upgrades.drying?(s.upgrades.expansion?6:4):0;}
function dryReady(s,now=Date.now()){return s.dry.filter(b=>b.t<=now).length;}
function dryNext(s,now=Date.now()){const w=s.dry.filter(b=>b.t>now).map(b=>b.t);return w.length?Math.ceil((Math.min(...w)-now)/1000):null;}
function collectDry(s,now=Date.now()){const done=s.dry.filter(b=>b.t<=now);if(!done.length)return{ok:false,message:'Nothing is dry yet.'};sync(s);let jars=0;for(const b of done){const n=Math.round(b.n*(1+CURE_BONUS));s.jars+=n;s.stock[b.k]=(s.stock[b.k]||0)+n;jars+=n;}s.dry=s.dry.filter(b=>b.t>now);return{ok:true,jars,batches:done.length,message:`Collected ${done.length} dried batch${done.length===1?'':'es'} · +${jars} jars (+20% cure bonus)`};}
return {CARE,CURE_BONUS,DRY_MS,DURATION,EVENTS,OFFERS,SERVICE_COST,SKINS,STARTER_COST,STRAINS,STRAIN_IDS,TUTORIAL,TUT_DONE,UPGRADES,VERSION,WEAR_LIMIT,buySkin,buyUpgrade,careCount,careDone,careNeeded,collectDry,dryCap,dryNext,dryReady,dur,eligible,equip,fresh,harvest,isUnlocked,left,maybeEvent,normalize,optionOk,plant,prog,progress,readyCount,rescue,resolveEvent,sell,service,stage,stg,sync,takeJars,tend,tendAll,total,tutorialAdvance};})();
const L=(()=>{const {STRAINS,STRAIN_IDS}=E;
const WEEK_MS=7*86400000,MONDAY_EPOCH=4*86400000; // 1970-01-05 00:00 UTC was a Monday
const WEEK_CAP=500,QUALITY_CAP=200,DECAY=.15,DECAY_FLOOR=.25;
const ORDER_POINTS={tony:20,rick:8,bryce:35};
const DIVISIONS=[{id:'garage',name:'Garage',max:1500},{id:'warehouse',name:'Warehouse',max:8000},{id:'empire',name:'Empire',max:Infinity}];
const weekId=(now)=>Math.floor((now-MONDAY_EPOCH)/WEEK_MS);
const weekStart=(id)=>MONDAY_EPOCH+id*WEEK_MS;
const weekEnd=(id)=>weekStart(id+1);
const divisionFor=(sold)=>DIVISIONS.find(d=>sold<d.max).id;
const blankWeek=(week,sold)=>({week,division:divisionFor(sold),points:0,orders:0,premiumJars:0,quality:0,perBuyer:{}});
function jarsTaken(before,after){const t={};for(const id of STRAIN_IDS){const n=(before[id]||0)-(after[id]||0);if(n>0)t[id]=n;}return t;}
function scoreOrder(w,offerId,taken){
const base=ORDER_POINTS[offerId];if(!base)return 0;
const n=w.perBuyer[offerId]||0,orderPts=Math.round(base*Math.max(DECAY_FLOOR,1-DECAY*n));
let q=0,pj=0;for(const[id,c]of Object.entries(taken)){const t=STRAINS[id]?.tier||1;if(t>=2){q+=2*(t-1)*c;pj+=c;}}
q=Math.min(q,Math.max(0,QUALITY_CAP-w.quality));
const gain=Math.max(0,Math.min(orderPts+q,WEEK_CAP-w.points));
w.perBuyer[offerId]=n+1;w.orders++;w.premiumJars+=pj;w.quality+=q;w.points+=gain;return gain;
}
const PRIZES=[500,250,100],PRIZE_MULT={garage:1,warehouse:2,empire:4};
const prizeFor=(division,rank)=>PRIZES[rank-1]?PRIZES[rank-1]*(PRIZE_MULT[division]||1):0;
const saveRank=(s)=>(s?.sold||0)*1000+(s?.harvests||0);
return {DECAY,DECAY_FLOOR,DIVISIONS,MONDAY_EPOCH,ORDER_POINTS,PRIZES,PRIZE_MULT,QUALITY_CAP,WEEK_CAP,WEEK_MS,blankWeek,divisionFor,jarsTaken,prizeFor,saveRank,scoreOrder,weekEnd,weekId,weekStart};})();
const S=(()=>{
const MAX_ACTIONS=25;
const UPGRADE_COST=Object.fromEntries(E.UPGRADES.map(u=>[u.id,u.cost]));
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
function applyActions(state,actions,now,rng,week){
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
function plausible(s){
const bought=E.UPGRADES.reduce((n,u)=>n+(s.upgrades[u.id]?u.cost:0),0);
const maxJars=60+s.harvests*60;
if(s.cash+bought>500+s.sold+3000+s.harvests*50)return'Cash does not match your sales history.';
if(s.jars>maxJars||s.sold>s.harvests*60*250+500)return'Stock or sales do not match your harvest history.';
if(s.testCredits>1000)return'Test credits do not match.';
return null;
}
/** Prize eligibility: a server-started save (never imported with progress) AND a payout wallet linked by sending. */
function prizeStatus(save,wallet){
const reasons=[];if(!save||save.imported)reasons.push('imported');if(!wallet)reasons.push('no-wallet');
return{eligible:reasons.length===0,reasons,wallet:wallet?wallet.slice(0,4)+'…'+wallet.slice(-4):null};
}
const prizeOf=async(store,uid)=>prizeStatus(await store.getSave(uid),store.getWallet?await store.getWallet(uid):null);
const publicRoom=(s,name,week,now)=>({name,division:week?.division,points:week?.points||0,
pots:s.slots.map((t,i)=>t===null?null:{strain:s.kinds[i],stage:E.stg(s,i,now)}),
upgrades:E.UPGRADES.filter(u=>s.upgrades[u.id]).map(u=>u.id),equipped:s.equipped,sold:s.sold});
const cleanName=(raw)=>{const n=String(raw??'').replace(/[^A-Za-z0-9 _-]/g,'').trim().replace(/\s+/g,' ');return n.length>=3&&n.length<=16?n:null;};
const defaultName=(uid)=>'Grower-'+uid.replace(/-/g,'').slice(0,4).toUpperCase();
/* store: getSave(uid)->{state,version,imported}|null  putSave(uid,state,expectedVersion,imported)->bool
getWeek(uid,week)->row|null  putWeek(uid,row)  listWeek(week,division,limit)->rows[{uid,points,...}]
getName(uid)->string|null  setName(uid,name)  */
const ORDER_TTL_MS=24*3600e3,MAX_PENDING=3,CHECK_GAP_MS=4000;
function priceRaw(cfg,item,method){
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
return{status:200,body:{order:orderView(fresh,cfg),paid:fresh.status==='paid',settledNow:done,items:await store.listItems(uid),reason:fresh.status==='paid'?'':'That payment could not be applied (already used, or that wallet is linked to another account).'}};
}
return null;
}
async function handle({store,uid,now,rng=Math.random,body,pay}){
const op=body?.op,week=L.weekId(now),info={now,week,weekEnd:L.weekEnd(week)};
const nameOf=async(u)=>(await store.getName(u))||defaultName(u);
if(op==='orders'||op==='orderCreate'||op==='orderCheck')return payOps({store,uid,now,body,pay,op});
if(op==='load'){const s=await store.getSave(uid);return{status:200,body:{...info,state:s?.state??null,name:await nameOf(uid),score:await store.getWeek(uid,week),items:store.listItems?await store.listItems(uid):[],prize:await prizeOf(store,uid)}};}
if(op==='import'){
const cur=await store.getSave(uid),raw=E.normalize(body.state,now);
const progress=raw.harvests>0||raw.sold>0,inc=progress?raw:{...E.fresh(now),owned:raw.owned,equipped:raw.equipped,sound:raw.sound};
if(cur&&!body.replace)return{status:409,body:{error:'exists',message:'A cloud save already exists.',cloudRank:L.saveRank(cur.state),incomingRank:L.saveRank(inc)}};
if(cur&&body.replace&&L.saveRank(cur.state)>L.saveRank(inc)&&!body.confirmWorse)return{status:409,body:{error:'worse',message:'The cloud save is further along.',cloudRank:L.saveRank(cur.state),incomingRank:L.saveRank(inc)}};
const why=plausible(raw);if(why)return{status:422,body:{error:'implausible',message:why}};
inc.lastSeen=now;
if(!await store.putSave(uid,inc,cur?.version??0,progress))return{status:409,body:{error:'conflict',message:'Save changed elsewhere. Try again.'}};
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
return{status:200,body:{...info,division,divisions:L.DIVISIONS.map(d=>d.id),rows:out,mine,prize:await prizeOf(store,uid)}};
}
if(op==='room'){
const target=String(body.user||''),w=await store.getWeek(target,week),t=w&&await store.getSave(target);
if(!t)return{status:404,body:{error:'noroom',message:'That room is not on this week’s board.'}};
return{status:200,body:{...info,room:publicRoom(t.state,await nameOf(target),w,now)}};
}
if(op==='setName'){const n=cleanName(body.name);if(!n)return{status:400,body:{error:'name',message:'Use 3-16 letters, numbers or spaces.'}};await store.setName(uid,n);return{status:200,body:{name:n}};}
return{status:400,body:{error:'op',message:'Unknown request.'}};
}
return {CHECK_GAP_MS,MAX_ACTIONS,MAX_PENDING,ORDER_TTL_MS,applyActions,cleanName,handle,plausible,priceRaw,prizeStatus,publicRoom};})();
const {handle}=S;
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
async getWallet(uid:string){const{data}=await db.from('hs_wallets').select('wallet').eq('user_id',uid).maybeSingle();return data?.wallet??null;},
async listOrders(uid:string){const{data,error}=await db.from('hs_orders').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(20);if(error)throw error;return data||[];},
async listItems(uid:string){const{data,error}=await db.from('hs_items').select('item').eq('user_id',uid);if(error)throw error;return(data||[]).map((r:any)=>r.item);},
async createOrder(row:any){const{data,error}=await db.from('hs_orders').insert(row).select('*').single();if(error)throw error;return data;},
async getOrder(uid:string,id:string){if(!/^[0-9a-f-]{36}$/i.test(id))return null;const{data}=await db.from('hs_orders').select('*').eq('id',id).eq('user_id',uid).maybeSingle();return data;},
async claimCheck(id:string,gap:number){const{data,error}=await db.rpc('hs_claim_check',{p_order:id,p_gap_ms:gap});if(error)throw error;return data===true;},
async settle(id:string,sig:string,payer:string){const{data,error}=await db.rpc('hs_settle_order',{p_order:id,p_signature:sig,p_payer:payer});if(error)throw error;return data===true;}
};
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
const raw=await req.text();
if(raw.length>100000)return json(413,{error:'big',message:'Request too large.'});
const body=JSON.parse(raw);
const r=await handle({store,uid:user.id,now:Date.now(),body,pay});
return json(r.status,r.body);
}catch(e){console.error(e);return json(500,{error:'server',message:'Something went wrong.'});}
});

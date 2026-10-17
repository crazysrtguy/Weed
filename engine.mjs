export const VERSION=2,DURATION=90000,STARTER_COST=25;
// Placeholder strains: rename freely. `art:true` once assets/v2/<id>-{starter,young,developed,ready}.webp exist.
// `value` multiplies order pay when these jars are used. `unlock` is lifetime sales needed.
export const STRAINS={
 og:{id:'og',name:'Garage OG',tag:'Fast starter',time:90000,cost:25,jars:12,tier:1,value:1,unlock:0,art:false,tint:''},
 purple:{id:'purple',name:'Purple Placeholder',tag:'Balanced',time:150000,cost:60,jars:12,tier:2,value:1.3,unlock:600,art:false,tint:'hue-rotate(170deg) saturate(1.15)'},
 lemon:{id:'lemon',name:'Lemon Placeholder',tag:'Premium',time:240000,cost:140,jars:12,tier:3,value:1.75,unlock:1800,art:false,tint:'hue-rotate(-40deg) saturate(1.4) brightness(1.12)'},
 gold:{id:'gold',name:'Gold Placeholder',tag:'Rare, slow',time:360000,cost:300,jars:12,tier:4,value:2.4,unlock:4000,art:false,tint:'hue-rotate(-75deg) saturate(1.6) brightness(1.05)'}
};
export const STRAIN_IDS=Object.keys(STRAINS);
export const OFFERS=[{id:'tony',name:'Tony’s Dispensary',need:8,pay:640,line:'Put a label on it this time. My customers ask questions.'},{id:'bryce',name:'Bryce Botanicals',need:12,pay:1040,minTier:2,line:'It’s not expensive. It’s an elevated brand experience.'},{id:'rick',name:'Cousin Rick',need:4,pay:260,line:'Small order. Big dreams. Terrible parking.'}];
export const UPGRADES=[{id:'expansion',name:'More grow space',cost:600,art:'storage',description:'Unlock two more pots and install storage shelves.'},{id:'equipment',name:'Better equipment',cost:900,art:'rack',description:'Upgrade production: 15 jars per harvest instead of 12.'},{id:'staff',name:'Hire Marcus',cost:1200,art:'marcus-portrait',description:'Marcus replants every harvested pot for free. You still collect the crops.'}];
export const SKINS=[{id:'rack',name:'Black & Gold rack',price:150},{id:'lamp',name:'Black & Gold light',price:100},{id:'bench',name:'Black & Gold bench',price:200},{id:'storage',name:'Black & Gold shelves',price:150}];
export function fresh(now=Date.now()){return{version:2,cash:500,jars:0,sold:0,harvests:0,testCredits:1000,upgrades:{expansion:false,equipment:false,staff:false},slots:[now-DURATION,now-DURATION,now-60000,now-30000,null,null],kinds:['og','og','og','og',null,null],stock:{og:0,purple:0,lemon:0,gold:0},owned:[],equipped:[],sound:false,lastSeen:now};}
export function normalize(raw,now=Date.now()){
 const s=fresh(now);if(!raw||typeof raw!=='object')return s;
 for(const k of ['cash','jars','sold','harvests'])if(Number.isFinite(raw[k])&&raw[k]>=0)s[k]=Math.floor(raw[k]);
 for(const k of ['expansion','equipment','staff'])s.upgrades[k]=Boolean(raw.upgrades?.[k]??raw[k]);
 s.slots=Array.from({length:s.upgrades.expansion?8:6},(_,i)=>Number.isFinite(raw.slots?.[i])?Math.max(0,Math.min(now,raw.slots[i])):null);
 if(raw.version===2){s.testCredits=Number.isFinite(raw.testCredits)&&raw.testCredits>=0?Math.floor(raw.testCredits):1000;s.owned=SKINS.filter(x=>raw.owned?.includes(x.id)).map(x=>x.id);s.equipped=s.owned.filter(id=>raw.equipped?.includes(id));}
 s.kinds=s.slots.map((t,i)=>t===null?null:(STRAINS[raw.kinds?.[i]]?raw.kinds[i]:'og'));
 s.stock={og:0};for(const id of STRAIN_IDS){const n=raw.stock?.[id];s.stock[id]=Number.isFinite(n)&&n>0?Math.floor(n):0;}
 if(!raw.stock)s.stock.og=s.jars;sync(s);
 s.sound=Boolean(raw.sound);s.lastSeen=Number.isFinite(raw.lastSeen)?raw.lastSeen:now;return s;
}
export function progress(t,now=Date.now(),dur=DURATION){return t===null?0:Math.min(1,Math.max(0,(now-t)/dur));}
export function stage(t,now=Date.now(),dur=DURATION){const p=progress(t,now,dur);return p<.22?'starter':p<.52?'young':p<1?'developed':'ready';}
export function dur(s,i){return STRAINS[s.kinds?.[i]]?.time??DURATION;}
export function prog(s,i,now=Date.now()){return progress(s.slots[i],now,dur(s,i));}
export function stg(s,i,now=Date.now()){return stage(s.slots[i],now,dur(s,i));}
export function left(s,i,now=Date.now()){return Math.ceil((1-prog(s,i,now))*dur(s,i)/1000);}
export function isUnlocked(s,id){return Boolean(STRAINS[id])&&s.sold>=STRAINS[id].unlock;}
export function total(s){return STRAIN_IDS.reduce((n,id)=>n+(s.stock[id]||0),0);}
// Keep per-strain stock and the legacy jar total in agreement (legacy writes go to Garage OG).
export function sync(s){const d=s.jars-total(s);if(d>0)s.stock.og=(s.stock.og||0)+d;else if(d<0){let r=-d;for(const id of STRAIN_IDS){const t=Math.min(r,s.stock[id]||0);s.stock[id]=(s.stock[id]||0)-t;r-=t;}}}
export function readyCount(s,now=Date.now()){return s.slots.filter((t,i)=>t!==null&&prog(s,i,now)>=1).length;}
export function plant(s,i,now=Date.now(),id='og'){const st=STRAINS[id];if(!st)return{ok:false,message:'Unknown strain.'};if(!Number.isInteger(i)||i<0||i>=s.slots.length)return{ok:false,message:'Invalid slot.'};if(s.slots[i]!==null)return{ok:false,message:'This pot is already growing.'};if(!isUnlocked(s,id))return{ok:false,message:`${st.name} unlocks at $${st.unlock.toLocaleString()} lifetime sales.`};if(s.cash<st.cost)return{ok:false,message:`${st.name} seeds cost $${st.cost}. Sell your jars first.`};s.cash-=st.cost;s.slots[i]=now;s.kinds[i]=id;return{ok:true,message:`${st.name} planted · ready in ${Math.round(st.time/1000)} seconds.`};}
export function harvest(s,i,now=Date.now()){if(!Number.isInteger(i)||i<0||i>=s.slots.length||s.slots[i]===null||prog(s,i,now)<1)return{ok:false,message:'This crop is not ready yet.'};const id=s.kinds[i]||'og',jars=Math.round(STRAINS[id].jars*(s.upgrades.equipment?1.25:1));sync(s);s.jars+=jars;s.stock[id]=(s.stock[id]||0)+jars;s.harvests++;if(s.upgrades.staff)s.slots[i]=now;else{s.slots[i]=null;s.kinds[i]=null;}return{ok:true,jars,id,message:`${STRAINS[id].name} harvested · +${jars} jars${s.upgrades.staff?' · Marcus replanted':''}`};}
export function eligible(s,o){sync(s);return STRAIN_IDS.filter(id=>STRAINS[id].tier>=(o.minTier||1)).reduce((n,id)=>n+(s.stock[id]||0),0);}
export function sell(s,id){const o=OFFERS.find(o=>o.id===id);if(!o)return{ok:false,message:'Unknown buyer.'};const have=eligible(s,o);if(have<o.need)return{ok:false,message:o.minTier&&total(s)>=o.need?`${o.name} only takes premium strains. Need ${o.need-have} more.`:`You need ${o.need-s.jars} more jars.`};let r=o.need,val=0;for(const sid of STRAIN_IDS.filter(x=>STRAINS[x].tier>=(o.minTier||1))){const t=Math.min(r,s.stock[sid]||0);s.stock[sid]-=t;r-=t;val+=t*STRAINS[sid].value;}const pay=Math.round(o.pay*val/o.need);s.jars-=o.need;s.cash+=pay;s.sold+=pay;return{ok:true,pay,message:`Order delivered · +$${pay.toLocaleString()}`};}
export function buyUpgrade(s,id){const u=UPGRADES.find(u=>u.id===id);if(!u||s.upgrades[id])return{ok:false,message:'Upgrade already installed.'};if(s.cash<u.cost)return{ok:false,message:'Earn more game cash by completing orders.'};s.cash-=u.cost;s.upgrades[id]=true;if(id==='expansion')s.slots.push(null,null);s.kinds.push(null,null);return{ok:true,message:u.name+' unlocked.'};}
export function buySkin(s,id){const k=SKINS.find(k=>k.id===id);if(!k)return{ok:false,message:'Unknown style.'};if(s.owned.includes(id))return{ok:false,message:'You already own this style.'};if(s.testCredits<k.price)return{ok:false,message:'Not enough test credits.'};s.testCredits-=k.price;s.owned.push(id);if(!s.equipped.includes(id))s.equipped.push(id);return{ok:true,message:'Style purchased with TEST credits and equipped.'};}
export function equip(s,id){if(!s.owned.includes(id))return{ok:false,message:'Purchase this style first.'};s.equipped=s.equipped.includes(id)?s.equipped.filter(x=>x!==id):[...s.equipped,id];return{ok:true,message:s.equipped.includes(id)?'Style equipped.':'Original style restored.'};}
export function rescue(s){if(s.cash>=25||s.jars>=4||s.slots.some(t=>t!==null))return{ok:false,message:'Your operation still has resources.'};s.cash=25;return{ok:true,message:'Rick found you a $25 starter grant. Back in business.'};}

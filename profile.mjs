// Profile cosmetics: milestone badges, grower avatar, and room decor.
// Deliberately kept OUT of the game save: the avatar is a per-device preference, and badges/decor are derived from progress
// (lifetime sales, harvests, upgrades). So cloud sync cannot overwrite them and there is nothing to cheat.
import * as E from './engine.mjs';

const ART='assets/v2/',KEY='hs-profile-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{return{};}};
const write=o=>{try{localStorage.setItem(KEY,JSON.stringify(o));}catch{}};

// ---------- Avatars ----------
export const AVATARS=[
  {id:'bald-hoodie',name:'The Calm One'},
  {id:'curls',name:'The Closer'},
  {id:'teal-bob',name:'The Analyst'},
  {id:'silver-beard',name:'The Veteran'}
];
export const getAvatar=()=>AVATARS.find(a=>a.id===read().avatar)?.id||AVATARS[0].id;
export function setAvatar(id){if(!AVATARS.some(a=>a.id===id))return false;write({...read(),avatar:id});return true;}
export const avatarUrl=(id=getAvatar())=>`${ART}avatar-${id}.webp`;

// ---------- Milestones (badge art from the medallion set) ----------
export const MILESTONES=[
  {id:'payday',title:'First payday',copy:'Complete your first buyer order',art:'badge-shipment',done:s=>s.sold>0},
  {id:'thumb',title:'Green thumb',copy:'Harvest 10 crops',art:'badge-bronze-leaf',done:s=>s.harvests>=10},
  {id:'room',title:'Room to grow',copy:'Unlock the extra plant slots',art:'badge-wrench-gear',done:s=>Boolean(s.upgrades.expansion)},
  {id:'staff',title:'Someone else’s problem',copy:'Hire Marcus for replanting',glyph:'✦',done:s=>Boolean(s.upgrades.staff)},
  {id:'taste',title:'Personal taste',copy:'Own your first cosmetic skin',glyph:'◈',done:s=>s.owned.length>0},
  {id:'collector',title:'Collector',copy:'Unlock all four strains',art:'badge-collector',done:s=>E.STRAIN_IDS.every(id=>E.isUnlocked(s,id))},
  {id:'empire',title:'Empire',copy:'Reach $10,000 in lifetime sales',art:'badge-crowned-leaf',done:s=>s.sold>=10000},
  {id:'champion',title:'League champion',copy:'Win a weekly league (coming soon)',art:'trophy-leaf',done:()=>false}
];
export const milestonesDone=s=>MILESTONES.filter(m=>m.done(s));

// ---------- Room decor, unlocked by lifetime sales ----------
export const DECOR=[
  {id:'chair',name:'Walnut lounge chair',at:1500,art:'decor-lounge-chair',x:215,y:615,w:150},
  {id:'neon',name:'Neon leaf plate',at:3000,art:'decor-neon-leaf',x:362,y:252,w:70},
  {id:'cabinet',name:'Display cabinet',at:6000,art:'decor-display-cabinet',x:1110,y:560,w:140},
  {id:'trophy',name:'Gold leaf trophy',at:10000,art:'trophy-leaf',x:690,y:268,w:44}
];
export const decorUnlocked=s=>DECOR.filter(d=>s.sold>=d.at);

// ---------- Profile tab markup ----------
const money=n=>'$'+n.toLocaleString();
function growerCard(){
  const cur=getAvatar();
  return`<article class="card grower"><h3>Your grower</h3><img class="grower-big" id="growerBig" src="${avatarUrl(cur)}" alt="Your avatar"><p>Pick the face on your leaderboard entries. Saved on this device.</p><div class="avatar-row">${AVATARS.map(a=>`<button class="avatar-pick${a.id===cur?' on':''}" data-avatar="${a.id}" title="${a.name}" aria-label="${a.name}"><img src="${avatarUrl(a.id)}" alt=""></button>`).join('')}</div></article>`;
}
function milestonesCard(s){
  const got=milestonesDone(s).length;
  return`<article class="card"><h3>Milestones <span class="tag">${got}/${MILESTONES.length}</span></h3>${MILESTONES.map(m=>{const yes=m.done(s);
    return`<div class="achievement ${yes?'':'locked'}">${m.art?`<img class="badge-img" src="${ART+m.art}.webp" alt="">`:`<span>${yes?m.glyph:'◇'}</span>`}<div><b>${m.title}</b><small>${m.copy}</small></div></div>`;}).join('')}</article>`;
}
function decorCard(s){
  return`<article class="card"><h3>Room decor</h3><p>Decor appears in your garage as your business grows.</p>${DECOR.map(d=>{const yes=s.sold>=d.at;
    return`<div class="achievement ${yes?'':'locked'}"><img class="badge-img decor-thumb" src="${ART+d.art}.webp" alt=""><div><b>${d.name}</b><small>${yes?'In your garage':'Unlocks at '+money(d.at)+' lifetime sales'}</small></div></div>`;}).join('')}</article>`;
}
/** Takes the Profile tab's html and returns it with the avatar card first and the milestones card upgraded. */
export function profilePanel(html,s){
  html=html.replace(/<article class="card"><h3>Milestones<\/h3>[\s\S]*?<\/article>/,()=>milestonesCard(s)+decorCard(s));
  return html.replace('<div class="cards">',()=>'<div class="cards">'+growerCard());
}

// ---------- Behavior: avatar picks and "new decor" toasts ----------
export function startProfile(getState,toast){
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-avatar]');if(!b||!setAvatar(b.dataset.avatar))return;
    document.querySelectorAll('[data-avatar]').forEach(x=>x.classList.toggle('on',x===b));
    const big=document.getElementById('growerBig');if(big)big.src=avatarUrl(b.dataset.avatar);
  });
  const check=()=>{
    const s=getState();if(!s)return;
    const now=decorUnlocked(s).map(d=>d.id),o=read();
    if(!Array.isArray(o.decorSeen)){write({...o,decorSeen:now});return;}   // first run: do not announce what you already earned
    const fresh=DECOR.filter(d=>now.includes(d.id)&&!o.decorSeen.includes(d.id));
    if(fresh.length){write({...o,decorSeen:now});toast(`New decor in your garage: ${fresh.map(d=>d.name).join(', ')}`);}
  };
  setTimeout(check,1500);setInterval(check,4000);
}

import{prog,stg,left,STRAINS,STRAIN_IDS,careNeeded,CARE,WEAR_LIMIT,dryCap,dryReady,dryNext}from'./engine.mjs';
export const ART='assets/v2/';
const cache=new Map();
const ids=['pot','starter','young','developed','ready','rack','lamp','bench','storage','fan','marcus','couch','coffee','sign','poster','gold-rack','gold-lamp','gold-bench','gold-storage','lamp-pro','bench-pro','vent','flood-tray','branch','tray-buds',...STRAIN_IDS.filter(id=>STRAINS[id].art).flatMap(id=>['starter','young','developed','ready'].map(st=>id+'-'+st))];
// Runtime sprite preparation suppresses low-opacity generation haze. Source masters stay untouched.
async function prepare(id){const img=new Image();img.src=ART+id+'.webp';await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const im=ctx.getImageData(0,0,c.width,c.height),d=im.data;let x0=c.width,y0=c.height,x1=0,y1=0;const cutoff=/(^|-)(pot|starter|young|developed|ready|marcus)$/.test(id)?160:70;
for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4,a=d[i+3];if(a<cutoff)d[i+3]=0;else{d[i+3]=Math.min(255,Math.round((a-cutoff)/(255-cutoff)*255));if(d[i+3]>20){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}}
ctx.putImageData(im,0,0);if(x1<x0){cache.set(id,{url:img.src,root:.5});return}const crop=document.createElement('canvas');crop.width=x1-x0+1;crop.height=y1-y0+1;crop.getContext('2d').drawImage(c,x0,y0,crop.width,crop.height,0,0,crop.width,crop.height);let sum=0,n=0;
for(let y=Math.max(y0,y1-4);y<=y1;y++)for(let x=x0;x<=x1;x++)if(d[(y*c.width+x)*4+3]>120){sum+=x-x0;n++}
// Cable eyelets: the highest well-separated peaks of the sprite's top edge (used to hang lamps from the gantry).
const cw=crop.width,ch=crop.height,tops=[];for(let x=x0;x<=x1;x++){for(let y=y0;y<=y1;y++){if(d[(y*c.width+x)*4+3]>120){tops.push([y-y0,x-x0]);break;}}}
tops.sort((a,b)=>a[0]-b[0]);const eyes=[];for(const[ty,tx]of tops){if(ty>ch*.5||eyes.length>=3)break;if(eyes.every(e=>Math.abs(e[0]-tx)>cw*.12))eyes.push([tx,ty]);}
eyes.sort((a,b)=>a[0]-b[0]);
cache.set(id,{url:crop.toDataURL('image/png'),root:n?sum/n/crop.width:.5,w:cw,h:ch,eyes});}
export async function loadArt(){return Promise.allSettled(ids.map(prepare));}
export function sprite(id){return cache.get(id)?.url??ART+id+'.webp';}
// Plant art for a strain at a growth stage; strains without their own art reuse the base sprites (tinted via CSS).
export function plantArt(kind,st){const own=STRAINS[kind]?.art&&kind!=='og'?kind+'-'+st:st;return{id:own,url:sprite(own),root:cache.get(own)?.root??.5,tint:STRAINS[kind]?.art?'':(STRAINS[kind]?.tint||'')};}
export const XY=[[470,420],[640,460],[810,500],[335,505],[505,550],[675,595],[370,640],[540,685]];
let preview=null;
export function setPreview(id){preview=id;}
function skin(s,id){return preview===id||s.equipped.includes(id)?'gold-'+id:id;}
function prop(id,x,y,w,z,extra=''){return`<div class="prop ${extra}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}"><img src="${sprite(id)}" alt="" draggable="false"></div>`}
// Steel cables from the lamp's own eyelets up and out of frame, plus a faint light cone down to the plants.
// Eyelets are detected from the prepared sprite (prop is drawn 150px wide, anchored bottom-centre).
function lampRig(x,y,z,lampId){const m=cache.get(lampId),k=m?150/m.w:150/640,T=y-(m?m.h*k:150),L=x-75,eyes=(m?.eyes??[[65,168],[430,27],[590,183]]).map(([px,py])=>[L+px*k,T+py*k]),id='cone'+x;
return`<svg class="rig" width="1200" height="800" viewBox="0 0 1200 800" style="z-index:${z-2}"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y-40}" x2="0" y2="${y+235}"><stop offset="0" stop-color="#fff0cc" stop-opacity=".20"/><stop offset=".6" stop-color="#ffe2a8" stop-opacity=".07"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></linearGradient></defs>`
+`<polygon points="${x-48},${y-40} ${x+48},${y-40} ${x+185},${y+235} ${x-185},${y+235}" fill="url(#${id})" style="mix-blend-mode:screen"/>`
+eyes.map(([cx,cy])=>`<line x1="${cx+.8}" y1="${cy}" x2="${cx+.8}" y2="-80" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="-80" stroke="#8b9096" stroke-width="1.2"/>`).join('')+`</svg>`;}
// Overhead steel gantry (warped to the room's floor axes) that the lamps hang from; sits behind pots, plants and lamps.
const RIG=`<img class="rig-img" src="${ART}rig-world.webp" alt="" draggable="false" style="left:97.5px;top:-50.5px;width:867px">`;
// Drying line strung from the left gantry post: one branch per batch (shown/ready state updated by updateSlots) and the bud tray on the bench.
function dryLine(s){const cap=dryCap(s);if(!cap)return'';const A=[140,240],B=[330,135],at=t=>[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t+Math.sin(t*Math.PI)*16];
let h=`<svg class="rig" width="1200" height="800" viewBox="0 0 1200 800" style="z-index:250"><path d="M${A[0]} ${A[1]} Q${(A[0]+B[0])/2} ${(A[1]+B[1])/2+32} ${B[0]} ${B[1]}" fill="none" stroke="#2a2418" stroke-width="3.2" opacity=".55"/><path d="M${A[0]} ${A[1]} Q${(A[0]+B[0])/2} ${(A[1]+B[1])/2+32} ${B[0]} ${B[1]}" fill="none" stroke="#b9a27a" stroke-width="1.8"/><circle cx="${A[0]}" cy="${A[1]}" r="3.5" fill="#8b9096"/><circle cx="${B[0]}" cy="${B[1]}" r="3.5" fill="#8b9096"/></svg>`;
for(let i=0;i<cap;i++){const[x,y]=at((i+.6)/(cap+.2));h+=`<div class="prop dryb" data-b="${i}" style="left:${x}px;top:${y-2}px;width:50px;z-index:${252+i};transform:translate(-50%,0)"><img src="${sprite('branch')}" alt="" draggable="false"></div>`;}
h+=`<div class="prop drytray" style="left:772px;top:262px;width:118px;z-index:296"><img src="${sprite('tray-buds')}" alt="" draggable="false"></div>`;return h;}
export function renderProps(s){const dim=(s.wear||0)>=WEAR_LIMIT,benchId=skin(s,'bench')==='bench'&&s.upgrades.workstation?'bench-pro':skin(s,'bench'),lampId=skin(s,'lamp')==='lamp'&&s.upgrades.lights?'lamp-pro':skin(s,'lamp');let html=RIG+prop('coffee',1030,490,95,470)+prop(benchId,750,300,210,290)+prop('poster',270,230,60,200)+prop('sign',660,190,145,170)+prop('fan',1040,600,65,590);
html+=`<div class="business-name" style="left:660px;top:150px">YOUR GARAGE</div>`;
// The rack is the visible "Better equipment" upgrade (or a preview of its skin), placed clear of the gantry.
if(s.upgrades.equipment||preview==='rack'||s.equipped.includes('rack'))html+=prop(skin(s,'rack'),1085,430,170,420);
if(s.upgrades.expansion||preview==='storage')html+=prop(skin(s,'storage'),980,340,150,330);
if(s.upgrades.irrigation)s.slots.forEach((t,i)=>{const[x,y]=XY[i];html+=prop('flood-tray',x,y+30,160,y-1);});
html+=dryLine(s);
if(s.upgrades.ventilation)html+=prop('vent',1125,262,125,280);
if(s.upgrades.staff)html+=prop('marcus',630,320,72,310,'worker');
// Lamps hang 70px higher than the pools/plants beneath them so tall ready plants clear the fixture.
[[470,275],[640,315],[810,355]].forEach(([x,yo])=>{const y=yo-70;html+=lampRig(x,y,yo,lampId)+prop(lampId,x,y,150,yo,dim?'dim':'')+`<div class="lightpool${dim?' dim':''}" style="left:${x}px;top:${yo+110}px;z-index:${yo-1}"></div>`});document.querySelector('#props').innerHTML=html;}
export function renderSlots(s,inspect,now=Date.now()){
const root=document.querySelector('#slots');root.innerHTML=s.slots.map((t,i)=>{const[x,y]=XY[i];return`<button class="plant-slot" data-slot="${i}" style="left:${x}px;top:${y}px;z-index:${y}" aria-label="Inspect pot ${i+1}"><span class="ground-shadow"></span><img class="pot" src="${sprite('pot')}" alt=""><span class="foliage"></span></button>`}).join('')+s.slots.map((t,i)=>{const[x,y]=XY[i];return`<button class="slot-tag" data-tag="${i}" style="left:${x}px;top:${y+9}px" aria-hidden="true" tabindex="-1"></button>`}).join('')+(s.upgrades.drying?'<button class="slot-tag dry-tag" data-dry style="left:232px;top:312px" aria-label="Drying line"></button>':'');root.querySelectorAll('button').forEach(b=>b.onclick=()=>inspect(b.dataset.dry!==undefined?'dry':Number(b.dataset.slot??b.dataset.tag)));updateSlots(s,now);
}
function updateDry(s,now){const cap=dryCap(s);if(!cap)return;const rd=dryReady(s,now),nx=dryNext(s,now),tag=document.querySelector('[data-dry]');
document.querySelectorAll('.dryb').forEach(el=>{const b=s.dry[+el.dataset.b];el.classList.toggle('on',Boolean(b));el.classList.toggle('ready',Boolean(b)&&b.t<=now);});
document.querySelector('.drytray')?.classList.toggle('on',rd>0);
if(tag){tag.classList.toggle('ready',rd>0);tag.classList.toggle('empty',!s.dry.length);tag.innerHTML=rd>0?`<b>✳ DRIED</b><small>Tap to collect ${rd}</small>`:s.dry.length?`<b>DRYING ${s.dry.length}/${cap}</b><small>${nx}s left</small>`:`<b>DRYING LINE</b><small>0/${cap} · harvests hang here</small>`;}}
export function updateSlots(s,now=Date.now()){updateDry(s,now);
s.slots.forEach((t,i)=>{const b=document.querySelector(`[data-slot="${i}"]`);if(!b)return;const p=prog(s,i,now),need=careNeeded(s,i,now),kind=s.kinds[i],st=t===null?null:STRAINS[kind]||STRAINS.og,key=t===null?'empty':kind+':'+stg(s,i,now);const tg=document.querySelector(`[data-tag="${i}"]`);for(const el of[b,tg]){el.classList.toggle('ready',t!==null&&p>=1);el.classList.toggle('empty',t===null);}b.setAttribute('aria-label',`Pot ${i+1}: ${t===null?'empty, tap to choose a strain':p>=1?st.name+' ready to harvest':need?st.name+' needs '+need:st.name+', '+left(s,i,now)+' seconds remaining'}`);
if(b.dataset.stage!==key){b.dataset.stage=key;const height={starter:35,young:85,developed:140,ready:180}[stg(s,i,now)];const a=t===null?null:plantArt(kind,stg(s,i,now));b.querySelector('.foliage').innerHTML=t===null?'':`<img src="${a.url}" alt="" style="height:${height}px;transform:translateX(-${a.root*100}%);${a.tint?'filter:'+a.tint+';':''}">`;}
tg.classList.toggle('care',Boolean(need));tg.innerHTML=t===null?`<b>＋ PLANT</b><small>Pick a strain</small>`:p>=1?'<b>✳ READY</b><small>Tap to harvest</small>':need?`<b>◆ ${CARE[need].label.toUpperCase()}</b><small>Tap to ${need}</small>`:`<b>${st.name.toUpperCase()}</b><small>${left(s,i,now)}s <i><em style="width:${p*100}%"></em></i></small>`;});}

// Harvest feedback: a floating label and a small sparkle burst above a pot.
export function burst(i,text,color='#c7ef83'){const w=document.querySelector('#world'),p=XY[i];if(!w||!p)return;
const f=document.createElement('div');f.className='fx-float';f.textContent=text;f.style.cssText=`left:${p[0]}px;top:${p[1]-150}px;color:${color}`;w.append(f);
for(let k=0;k<12;k++){const a=Math.PI*2*k/12+Math.random()*.4,d=40+Math.random()*50,sp=document.createElement('i');sp.className='fx-spark';sp.style.cssText=`left:${p[0]}px;top:${p[1]-100}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-30}px`;w.append(sp);setTimeout(()=>sp.remove(),900);}
setTimeout(()=>f.remove(),1500);}

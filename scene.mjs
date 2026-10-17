import{progress,stage}from'./engine.mjs';
export const ART='assets/v2/';
const cache=new Map();
const ids=['pot','starter','young','developed','ready','rack','lamp','bench','storage','fan','marcus','couch','coffee','sign','poster','gold-rack','gold-lamp','gold-bench','gold-storage'];
// Runtime sprite preparation suppresses low-opacity generation haze. Source masters stay untouched.
async function prepare(id){const img=new Image();img.src=ART+id+'.webp';await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const im=ctx.getImageData(0,0,c.width,c.height),d=im.data;let x0=c.width,y0=c.height,x1=0,y1=0;const cutoff=['pot','starter','young','developed','ready','marcus'].includes(id)?160:70;
for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4,a=d[i+3];if(a<cutoff)d[i+3]=0;else{d[i+3]=Math.min(255,Math.round((a-cutoff)/(255-cutoff)*255));if(d[i+3]>20){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}}
ctx.putImageData(im,0,0);if(x1<x0){cache.set(id,{url:img.src,root:.5});return}const crop=document.createElement('canvas');crop.width=x1-x0+1;crop.height=y1-y0+1;crop.getContext('2d').drawImage(c,x0,y0,crop.width,crop.height,0,0,crop.width,crop.height);let sum=0,n=0;
for(let y=Math.max(y0,y1-4);y<=y1;y++)for(let x=x0;x<=x1;x++)if(d[(y*c.width+x)*4+3]>120){sum+=x-x0;n++}
cache.set(id,{url:crop.toDataURL('image/png'),root:n?sum/n/crop.width:.5});}
export async function loadArt(){return Promise.allSettled(ids.map(prepare));}
export function sprite(id){return cache.get(id)?.url??ART+id+'.webp';}
const XY=[[470,420],[640,460],[810,500],[335,505],[505,550],[675,595],[370,640],[540,685]];
let preview=null;
export function setPreview(id){preview=id;}
function skin(s,id){return preview===id||s.equipped.includes(id)?'gold-'+id:id;}
function prop(id,x,y,w,z,extra=''){return`<div class="prop ${extra}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}"><img src="${sprite(id)}" alt="" draggable="false"></div>`}
export function renderProps(s){let html=prop('couch',170,480,210,450)+prop('coffee',1030,490,95,470)+prop(skin(s,'bench'),750,300,210,290)+prop('poster',270,230,60,200)+prop('sign',660,190,145,170)+prop('fan',1040,600,65,590)+prop(skin(s,'rack'),920,420,180,390);
html+=`<div class="business-name" style="left:660px;top:150px">YOUR GARAGE</div>`;
if(s.upgrades.expansion||preview==='storage')html+=prop(skin(s,'storage'),980,340,150,330);
if(s.upgrades.staff)html+=prop('marcus',630,320,72,310,'worker');
[[470,275],[640,315],[810,355]].forEach(([x,y])=>{html+=prop(skin(s,'lamp'),x,y,150,Math.round(y))+`<div class="lightpool" style="left:${x}px;top:${y+110}px;z-index:${y-1}"></div>`});document.querySelector('#props').innerHTML=html;}
export function renderSlots(s,inspect,now=Date.now()){
const root=document.querySelector('#slots');root.innerHTML=s.slots.map((t,i)=>{const[x,y]=XY[i];return`<button class="plant-slot" data-slot="${i}" style="left:${x}px;top:${y}px;z-index:${y}" aria-label="Inspect pot ${i+1}"><span class="ground-shadow"></span><img class="pot" src="${sprite('pot')}" alt=""><span class="foliage"></span><span class="slot-tag"></span></button>`}).join('');root.querySelectorAll('button').forEach(b=>b.onclick=()=>inspect(Number(b.dataset.slot)));updateSlots(s,now);
}
export function updateSlots(s,now=Date.now()){
s.slots.forEach((t,i)=>{const b=document.querySelector(`[data-slot="${i}"]`);if(!b)return;const p=progress(t,now),key=t===null?'empty':stage(t,now);b.classList.toggle('ready',t!==null&&p>=1);b.classList.toggle('empty',t===null);b.setAttribute('aria-label',`Pot ${i+1}: ${t===null?'empty, plant for 25 dollars':p>=1?'ready to harvest':Math.ceil((1-p)*90)+' seconds remaining'}`);
if(b.dataset.stage!==key){b.dataset.stage=key;const height={starter:35,young:85,developed:140,ready:180}[key];b.querySelector('.foliage').innerHTML=key==='empty'?'':`<img src="${sprite(key)}" alt="" style="height:${height}px;transform:translateX(-${(cache.get(key)?.root??.5)*100}%)">`;}
b.querySelector('.slot-tag').innerHTML=t===null?`<b>＋ PLANT</b><small>$25</small>`:p>=1?'<b>✳ READY</b><small>Tap to harvest</small>':`<b>GARAGE OG</b><small>${Math.ceil((1-p)*90)}s <i><em style="width:${p*100}%"></em></i></small>`;});}

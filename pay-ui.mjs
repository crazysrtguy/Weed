// Premium shop (DEVNET): players pay by SENDING SOL or the test token to the treasury. No wallet connection, no signing here.
// Everything shown about an order (price, treasury, reference) comes from the server. All server text goes through esc().
import * as C from './cloud.mjs';
import {solanaPayUrl,formatAmount} from './chain.mjs';

const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const NAMES={rack:'Display rack',lamp:'Neon grow lamp',bench:'Trim bench',storage:'Storage crate',link:'Payout wallet link'};
const nameOf=(id)=>NAMES[id]||id;
let data=null,active=null,timer=null;

export const payCard=()=>C.enabled()?`<article class="card" id="payBox"><span class="tag">Premium shop · DEVNET TEST</span><p>Loading…</p></article>`:'';

const orderBox=(o)=>{
 const amt=formatAmount(o.amountRaw,o.decimals),sym=o.method==='sol'?'SOL':(data?.symbol||'TOKEN');
 const url=solanaPayUrl({recipient:o.treasury,amount:amt,splToken:o.mint||undefined,reference:o.reference,label:'High Stakes',message:nameOf(o.item)});
 return`<div class="order"><b>${esc(nameOf(o.item))}: send exactly ${esc(amt)} ${esc(sym)}</b>
  <small>Devnet only. Use a wallet set to <b>Devnet</b>. Nothing here connects to or signs with your wallet.</small>
  <a class="primary" href="${esc(url)}">Open in wallet app</a>
  <small>Or send manually to this address:</small><code class="addr" data-copy="${esc(o.treasury)}">${esc(o.treasury)}</code>
  <small>Include this reference (a read-only account on the transfer) so we can match your payment:</small><code class="addr" data-copy="${esc(o.reference)}">${esc(o.reference)}</code>
  <button class="secondary" id="payCheck">I’ve paid — check now</button><small id="payStatus">Waiting for payment. This updates by itself once it is final on chain.</small></div>`;
};

function view(){
 const box=document.querySelector('#payBox');if(!box)return;
 const owned=new Set(data.items),cat=data.catalog;
 box.innerHTML=`<span class="tag">Premium shop · DEVNET TEST · no real money</span><h3>Premium shop</h3><p>Paid with free devnet SOL or ${esc(data.symbol)}. Cosmetic only: it never changes growth speed, quality or yield.</p><p class="dialog-notice">Payout wallet link: send ${cat.link?.sol||'a tiny amount of'} SOL from the wallet that should receive league prizes. Sending proves you control it; nothing is connected. One wallet per account.</p>`
  +Object.keys(cat).map(id=>owned.has(id)?`<div class="stat"><span>${esc(nameOf(id))}</span><b>Owned ✓</b></div>`:
   `<div class="stat"><span>${esc(nameOf(id))}</span><span>${cat[id].sol?`<button class="secondary" data-buy="${esc(id)}|sol">${cat[id].sol} SOL</button>`:''} ${cat[id].token?`<button class="secondary" data-buy="${esc(id)}|token">${cat[id].token} ${esc(data.symbol)}</button>`:''}</span></div>`).join('')
  +`<div id="payOrder">${active?orderBox(active):''}</div>`;
 box.querySelectorAll('[data-buy]').forEach(b=>b.onclick=async()=>{const[item,method]=b.dataset.buy.split('|');b.disabled=true;try{active=(await C.orderCreate(item,method)).order;view();poll(true);}catch(e){note(e.message);}b.disabled=false;});
 box.querySelectorAll('[data-copy]').forEach(c=>c.onclick=()=>{try{navigator.clipboard.writeText(c.dataset.copy);note('Copied.');}catch{}});
 const chk=box.querySelector('#payCheck');if(chk)chk.onclick=()=>poll(true);
}
const note=(t)=>{const el=document.querySelector('#payStatus');if(el)el.textContent=t;};

async function poll(now){
 clearTimeout(timer);if(!active||!document.querySelector('#payBox'))return;
 if(now){try{
   const r=await C.orderCheck(active.id);
   if(r.slow){note('Checking… one moment.');}
   else if(r.expired){note('This order expired. Start a new one.');active=null;await load();return;}
   else if(r.paid){data.items=r.items;active=null;view();const b=document.querySelector('#payBox');if(b)b.insertAdjacentHTML('beforeend','<p class="dialog-notice">Payment confirmed on chain. Thank you!</p>');return;}
   else note(r.reason||'Waiting for payment…');
  }catch(e){note(e.message);}}
 timer=setTimeout(()=>poll(true),7000);
}

async function load(){
 try{data=await C.orders();const open=data.orders.find(o=>o.status==='pending'&&o.expiresAt>Date.now());active=open||null;view();if(active)poll(true);}
 catch(e){const b=document.querySelector('#payBox');if(b)b.innerHTML=`<span class="tag">Premium shop</span><p>${esc(e.message)}</p>`;}
}
export function bindPay(){clearTimeout(timer);if(document.querySelector('#payBox'))load();}

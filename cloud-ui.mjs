// League tab and cloud-save card. All DOM text from the server goes through esc().
import * as E from './engine.mjs';
import * as L from './league.mjs';
import * as C from './cloud.mjs';

const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const left=(end)=>{const ms=Math.max(0,end-C.info().skew-Date.now()),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5);return d?`${d}d ${h}h`:`${h}h ${Math.floor(ms%36e5/6e4)}m`;};
const divName=(id)=>L.DIVISIONS.find(d=>d.id===id)?.name||id;
const STATUS={off:'Cloud save is off',connecting:'Connecting…',on:'Synced · server-checked',offline:'Offline · playing locally',choice:'Choose which save to keep',error:'Cloud unavailable'};

export function cloudCard(ctx){
 const i=C.info(),on=C.enabled();
 if(!C.configured())return`<article class="card"><span class="tag">Cloud save</span><h3>Not set up yet</h3><p>This build has no server connected, so everything is saved on this device. Your game works fully offline.</p></article>`;
 if(!on)return`<article class="card"><span class="tag">Cloud save · optional</span><h3>Back up &amp; join the weekly league</h3><p>No password. We create an anonymous account and copy this device’s save to the cloud. You can keep playing offline either way, and we ask before replacing any save.</p><button class="primary" id="cloudOn">Turn on cloud save</button><button class="secondary" id="cloudSignIn">I already have an email link account</button><div id="cloudEmailBox"></div></article>`;
 return`<article class="card"><span class="tag">Cloud save · ${esc(STATUS[i.status]||i.status)}</span><h3>${esc(i.name||'Your grower name')}</h3><p>${i.anonymous===false?`Signed in as ${esc(i.email)}.`:'Anonymous account. Add an email so you can recover it on another device.'}</p>
 <label class="field"><small>Grower name</small><input id="cloudName" maxlength="16" value="${esc(i.name||'')}" autocomplete="off"><button class="secondary" id="cloudNameSave">Save name</button></label>
 ${i.anonymous!==false?`<label class="field"><small>Email (magic link, no password)</small><input id="cloudEmail" type="email" autocomplete="email" placeholder="you@example.com"><button class="secondary" id="cloudEmailSend">Email me a link</button></label>`:''}
 <button class="secondary" id="cloudOff">Turn off cloud save</button></article>`;
}

export function bindCloud(ctx){
 const $=(s)=>document.querySelector(s),run=(el,fn)=>{if(!el)return;el.onclick=async()=>{el.disabled=true;try{await fn();}catch(e){ctx.toast(e.message||'Something went wrong.');}el.disabled=false;};};
 run($('#cloudOn'),async()=>{const r=await C.turnOn();handleConnect(ctx,r);});
 run($('#cloudSignIn'),async()=>{$('#cloudEmailBox').innerHTML='<label class="field"><small>Email you used before</small><input id="cloudEmail2" type="email" autocomplete="email"><button class="primary" id="cloudEmailGo">Send sign-in link</button></label>';
  $('#cloudEmailGo').onclick=async()=>{try{await C.signInEmail($('#cloudEmail2').value.trim());ctx.toast('Check your email for the sign-in link.');}catch(e){ctx.toast(e.message);}};});
 run($('#cloudOff'),async()=>{await C.turnOff();ctx.toast('Cloud save off. This device keeps your save.');ctx.rerender();});
 run($('#cloudNameSave'),async()=>{const n=await C.setName($('#cloudName').value);ctx.toast('Name saved: '+n);ctx.rerender();});
 run($('#cloudEmailSend'),async()=>{await C.emailLink($('#cloudEmail').value.trim());ctx.toast('Check your email for a confirmation link.');});
}

// Conflict dialog: never replaces a save without the player choosing.
export function handleConnect(ctx,r){
 if(r?.error){ctx.toast(r.error);return;}
 if(r?.needsChoice)return choose(ctx,r);
 if(r?.done)ctx.toast('Cloud save is on.');
 ctx.rerender();
}
export function choose(ctx,r){
 const row=(t,s)=>`<div class="stat"><span>${t}</span><b>$${s.sold.toLocaleString()} sold · ${s.harvests} harvests</b></div>`;
 ctx.openModal(ctx.modalHead('TWO SAVES FOUND','Which one do you keep?')+`<p>This device and the cloud are different. Nothing is replaced until you choose.</p>${row('This device',r.local)}${row('Cloud',r.cloud)}<p class="dialog-notice">${r.localRank>r.cloudRank?'This device is further along.':r.localRank<r.cloudRank?'The cloud save is further along.':'Both look equal.'}</p><button class="${r.localRank>r.cloudRank?'secondary':'primary'}" id="keepCloud">Use the cloud save</button><button class="${r.localRank>r.cloudRank?'primary':'secondary'}" id="keepLocal">Upload this device’s save</button><button class="secondary" data-close>Decide later (play offline)</button>`);
 document.querySelector('#keepCloud').onclick=async()=>{const x=await C.resolve('cloud');ctx.closeModal();handleConnect(ctx,x);};
 document.querySelector('#keepLocal').onclick=async()=>{
  const go=async(confirmWorse)=>{const x=await C.resolve('local',confirmWorse);if(x.needsConfirmWorse){ctx.openModal(ctx.modalHead('ARE YOU SURE','Replace a better save?')+`<p>${esc(x.message)} Uploading this device’s save will overwrite it for good.</p><button class="secondary" id="yesWorse">Yes, overwrite the cloud save</button><button class="primary" data-close>Cancel</button>`);document.querySelector('#yesWorse').onclick=async()=>{const y=await C.resolve('local',true);ctx.closeModal();handleConnect(ctx,y);};return;}ctx.closeModal();handleConnect(ctx,x);};
  try{await go(false);}catch(e){ctx.toast(e.message);}};
}

export function leaguePanel(ctx){
 const head=ctx.head('WEEKLY LEAGUE','Leaderboard','Points come from completed orders and premium-strain jars. Resets every Monday, and you only race players in your own division.');
 if(!C.configured())return head+`<div class="cards"><article class="card"><h3>League not connected</h3><p>This build has no server yet. The game stays fully playable on this device; the league switches on once the cloud is configured.</p></article>${how()}</div>`;
 if(!C.enabled())return head+`<div class="cards"><article class="card"><span class="tag">Optional</span><h3>Join the league</h3><p>Turn on cloud save to score. It is anonymous, free, and uses game cash and TEST credits only.</p><button class="primary" id="leagueJoin">Turn on cloud save</button></article>${how()}</div>`;
 return head+`<div class="cards"><article class="card" id="boardBox"><p>Loading this week’s board…</p></article>${how()}</div>`;
}
const how=()=>`<article class="card"><h3>How points work</h3><div class="stat"><span>Tony / Rick / Bryce</span><b>${L.ORDER_POINTS.tony} / ${L.ORDER_POINTS.rick} / ${L.ORDER_POINTS.bryce} pts</b></div><div class="stat"><span>Repeat of same buyer</span><b>−15% each, min 25%</b></div><div class="stat"><span>Premium jars</span><b>+2 per tier above OG</b></div><div class="stat"><span>Weekly cap</span><b>${L.WEEK_CAP} pts</b></div><p class="dialog-notice">Points are never based on cash, so bigger upgrades do not win by themselves. Orders are scored by the server clock.</p></article>`;

export async function bindLeague(ctx,division){
 const j=document.querySelector('#leagueJoin');if(j)j.onclick=async()=>{j.disabled=true;try{handleConnect(ctx,await C.turnOn());}catch(e){ctx.toast(e.message);}j.disabled=false;};
 const box=document.querySelector('#boardBox');if(!box)return;
 try{const d=await C.league(division);if(!document.body.contains(box))return;
  const mine=d.mine,rank=d.rows.findIndex(r=>r.me)+1,pz=d.prize||{eligible:false,reasons:[]};
  const prizeLine=pz.eligible?`Prize-eligible ✓ · payout wallet ${esc(pz.wallet)}`:`Not prize-eligible yet: ${pz.reasons.includes('imported')?'this save was imported with progress (prize players start fresh on the cloud). ':''}${pz.reasons.includes('no-wallet')?'link a payout wallet in Profile (send a tiny SOL amount; nothing is connected).':''}`;
  box.innerHTML=`<span class="tag">${esc(divName(d.division))} division · resets in ${left(d.weekEnd)}</span><h3>${mine?mine.points:0} pts${rank?` · #${rank}`:''}</h3><p>${mine?`${mine.orders} orders · ${mine.premiumJars} premium jars this week.`:'Complete an order to join this week’s board.'}</p><p class="dialog-notice">${prizeLine}<br>Weekly test prizes (devnet HSTEST, top 3 per division): ${L.PRIZES.map((p,i)=>`#${i+1} ${p}`).join(' · ')} × ${L.PRIZE_MULT[d.division]||1}. No real money.</p>
  <div class="chips">${d.divisions.map(x=>`<button class="chip ${x===d.division?'on':''}" data-div="${x}">${esc(divName(x))}</button>`).join('')}</div>
  ${d.rows.length?`<ol class="board">${d.rows.map((r,i)=>`<li class="${r.me?'me':''}"><span class="rk">${i<3?`<img class="rank-medal" src="assets/v2/badge-rank-${['gold','silver','bronze'][i]}.webp" alt="#${i+1}">`:i+1}</span><span class="nm">${esc(r.name)}${r.me?' (you)':''}</span><b>${r.points}</b>${r.me?'':`<button class="secondary" data-visit="${esc(r.uid)}">Visit</button>`}</li>`).join('')}</ol>`:'<p>Nobody has scored in this division yet. Be first.</p>'}`;
  box.querySelectorAll('[data-div]').forEach(b=>b.onclick=()=>bindLeague(ctx,b.dataset.div));
  box.querySelectorAll('[data-visit]').forEach(b=>b.onclick=async()=>{try{showRoom(ctx,await C.room(b.dataset.visit));}catch(e){ctx.toast(e.message);}});
 }catch(e){if(document.body.contains(box))box.innerHTML=`<p>${esc(e.message==='Failed to fetch'?'You are offline. The league needs a connection; your game is unaffected.':e.message)}</p>`;}
}

function showRoom(ctx,r){
 const pots=r.pots.map(p=>p?`<div class="stat"><span>${esc(E.STRAINS[p.strain]?.name||'Garage OG')}</span><b>${esc(p.stage)}</b></div>`:`<div class="stat"><span>Empty pot</span><b>—</b></div>`).join('');
 const ups=r.upgrades.map(id=>esc(E.UPGRADES.find(u=>u.id===id)?.name||id)).join(' · ')||'No upgrades yet';
 ctx.openModal(ctx.modalHead(`${esc(divName(r.division))} DIVISION`,esc(r.name)+'’s garage')+`<div class="stat"><span>This week</span><b>${r.points} pts</b></div><div class="stat"><span>Lifetime sales</span><b>$${r.sold.toLocaleString()}</b></div>${pots}<p class="dialog-notice">${ups}${r.equipped.length?` · ${r.equipped.length} Black &amp; Gold style${r.equipped.length>1?'s':''}`:''}</p>`);
}

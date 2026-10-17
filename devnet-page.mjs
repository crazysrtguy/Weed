// Devnet "pay by sending" demo. No wallet connection, no signing, no third-party scripts: this page only builds a
// payment link and READS the chain. In the real game the order is created and checked on the server.
import {newReference,solanaPayUrl,toRaw,solToLamports,formatAmount,findPayment} from './chain.mjs';
const $=s=>document.querySelector(s),log=t=>{const d=document.createElement('div');d.textContent=t;$('#log').append(d);$('#log').scrollTop=1e9;};
const short=a=>a.slice(0,5)+'…'+a.slice(-5),exp=(k,v)=>`https://explorer.solana.com/${k}/${v}?cluster=devnet`;
const link=(k,v,t)=>{const a=document.createElement('a');a.href=exp(k,v);a.target='_blank';a.rel='noopener noreferrer';a.textContent=t;return a;};
let cfg,order=null,timer=null;
try{cfg=await (await fetch('devnet-config.json',{cache:'no-store'})).json();}
catch{log('devnet-config.json not found. The host needs to run: cd devnet && npm run setup');}
if(cfg){
  $('#cluster').textContent=cfg.cluster;
  $('#tOwner').replaceChildren(link('address',cfg.treasuryOwner,cfg.treasuryOwner));
  $('#mint').replaceChildren(link('address',cfg.mint,`${cfg.symbol} (${short(cfg.mint)}, Token-2022)`));
  for(const id of Object.keys(cfg.itemsSol)){const o=document.createElement('option');o.value=id;o.textContent=`${id} — ${cfg.itemsSol[id]} SOL or ${cfg.itemsToken[id]} ${cfg.symbol}`;$('#item').append(o);}
}
function setStatus(text,cls){const s=$('#status');s.textContent=text;s.className=cls;}
async function check(){
  if(!order)return;
  try{
    const r=await findPayment(cfg.rpc,{method:order.method,reference:order.reference,treasuryOwner:cfg.treasuryOwner,minAmountRaw:order.minAmountRaw,mint:cfg.mint});
    if(r.ok){clearInterval(timer);setStatus(`Paid and finalized ✓  The game would now unlock "${order.item}" and link wallet ${short(r.payer)}.`,'ok');log(`Paid by ${r.payer}`);log(`Transaction: ${exp('tx',r.signature)}`);}
    else setStatus(r.reason==='no payment yet'?'Waiting for payment…':`Waiting… (${r.reason})`,'wait');
  }catch(e){setStatus('Could not read the chain right now; retrying…','bad');log(e.message);}
}
$('#create').onclick=()=>{
  if(!cfg)return;
  const item=$('#item').value,method=$('#coin').value,reference=newReference();
  const minAmountRaw=method==='sol'?solToLamports(cfg.itemsSol[item]):toRaw(cfg.itemsToken[item],cfg.decimals);
  order={item,method,reference,minAmountRaw};
  try{sessionStorage.setItem('hs_devnet_order',JSON.stringify({...order,minAmountRaw:String(minAmountRaw)}));}catch{}
  const amount=formatAmount(minAmountRaw,method==='sol'?9:cfg.decimals);
  const url=solanaPayUrl({recipient:cfg.treasuryOwner,amount,splToken:method==='token'?cfg.mint:undefined,reference,label:'High Stakes',message:item});
  $('#orderCard').hidden=false;
  $('#oAmount').textContent=`${amount} ${method==='sol'?'SOL':cfg.symbol}`;
  $('#oTo').textContent=cfg.treasuryOwner;$('#oRef').textContent=reference;
  $('#payUrl').textContent=url;$('#payLink').href=url;
  setStatus('Waiting for payment…','wait');log(`Order created for ${item} (${method}).`);
  clearInterval(timer);timer=setInterval(check,6000);
};
$('#check').onclick=check;

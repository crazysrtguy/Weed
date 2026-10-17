// Devnet prize payout from the treasury.  Usage: npm run payout -- winners.json [--send]
// winners.json: [{"id":"wk2900-garage-1","wallet":"<address>","asset":"sol"|"token","amount":0.5}, ...]   Dry run by default; add --send to pay.
// Every entry needs a unique `id`. Paid ids are written to .payouts.json BEFORE the next send, so re-running the same file never pays twice.
// Safety: a hard per-payout cap and a total cap apply, and every wallet address is validated before anything is sent.
import fs from 'node:fs';
import {getOrCreateAssociatedTokenAccount,getAccount,transferChecked} from '@solana/spl-token';
import {SystemProgram,Transaction,sendAndConfirmTransaction,LAMPORTS_PER_SOL,PublicKey} from '@solana/web3.js';
import {connection,loadOrCreateKeypair,readConfig,pk,sol,TP} from './lib.mjs';

const ledgerPath=new URL('./.payouts.json',import.meta.url);
const ledger=fs.existsSync(ledgerPath)?JSON.parse(fs.readFileSync(ledgerPath,'utf8')):{};
const MAX_SOL_EACH=2,MAX_TOKEN_EACH=100000,MAX_WINNERS=100;
const [file,...flags]=process.argv.slice(2);
if(!file){console.error('Usage: npm run payout -- winners.json [--send]');process.exit(1);}
const send=flags.includes('--send');
const winners=JSON.parse(fs.readFileSync(file,'utf8'));
if(!Array.isArray(winners)||winners.length>MAX_WINNERS){console.error(`winners.json must be a list of at most ${MAX_WINNERS}`);process.exit(1);}
const cfg=readConfig(),authority=loadOrCreateKeypair('authority'),mint=pk(cfg.mint);
const ids=new Set();
for(const w of winners){
  if(typeof w.id!=='string'||!/^[A-Za-z0-9_.:-]{3,64}$/.test(w.id)||ids.has(w.id)){console.error('Every entry needs a unique id (3-64 letters, numbers, - _ . :):',JSON.stringify(w));process.exit(1);}
  ids.add(w.id);
  let valid=false;try{valid=PublicKey.isOnCurve(new PublicKey(w.wallet).toBytes());}catch{}
  const cap=w.asset==='sol'?MAX_SOL_EACH:MAX_TOKEN_EACH;
  if(!valid||!['sol','token'].includes(w.asset)||!(w.amount>0&&w.amount<=cap)){console.error('Invalid entry (bad address, asset, or amount over the cap):',JSON.stringify(w));process.exit(1);}
}
const todo=winners.filter(w=>!ledger[w.id]);
if(todo.length<winners.length)console.log(`Skipping ${winners.length-todo.length} already paid (see .payouts.json).`);
const totalSol=todo.filter(w=>w.asset==='sol').reduce((n,w)=>n+w.amount,0),totalTok=winners.filter(w=>w.asset==='token').reduce((n,w)=>n+w.amount,0);
const haveTok=Number((await getAccount(connection,pk(cfg.treasuryAta),'confirmed',TP)).amount)/10**cfg.decimals,haveSol=await sol(authority);
console.log(`${send?'SENDING':'DRY RUN'}: ${todo.length} to pay | ${totalSol} SOL (treasury ${haveSol.toFixed(3)}) + ${totalTok} ${cfg.symbol} (treasury ${haveTok}).`);
if(totalSol>haveSol-0.01||totalTok>haveTok){console.error('Treasury balance is too low for this payout.');process.exit(1);}
for(const w of todo){
  console.log(` - ${w.wallet}  ${w.amount} ${w.asset==='sol'?'SOL':cfg.symbol}`);
  if(!send)continue;
  let sig;
  if(w.asset==='sol')sig=await sendAndConfirmTransaction(connection,new Transaction().add(SystemProgram.transfer({fromPubkey:authority.publicKey,toPubkey:pk(w.wallet),lamports:Math.round(w.amount*LAMPORTS_PER_SOL)})),[authority]);
  else{
    const dest=await getOrCreateAssociatedTokenAccount(connection,authority,mint,pk(w.wallet),false,'confirmed',undefined,TP);
    sig=await transferChecked(connection,authority,pk(cfg.treasuryAta),mint,dest.address,authority,BigInt(Math.round(w.amount*10**cfg.decimals)),cfg.decimals,[],undefined,TP);
  }
  ledger[w.id]={wallet:w.wallet,asset:w.asset,amount:w.amount,sig,at:new Date().toISOString()};
  fs.writeFileSync(ledgerPath,JSON.stringify(ledger,null,1));
  console.log('   paid:',`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}
if(!send)console.log('\nNothing was sent. Re-run with --send to pay out.');

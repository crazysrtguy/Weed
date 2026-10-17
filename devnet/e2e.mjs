// End-to-end DEVNET test of pay-by-sending, with a simulated player (a fresh keypair acting like a wallet app opening a
// Solana Pay link). The game side only READS the chain (findPayment). Usage: npm run e2e   (takes about 2 minutes)
import {Keypair,SystemProgram,Transaction,sendAndConfirmTransaction,LAMPORTS_PER_SOL} from '@solana/web3.js';
import {getOrCreateAssociatedTokenAccount,mintTo,createTransferCheckedInstruction,getAssociatedTokenAddressSync} from '@solana/spl-token';
import {connection,loadOrCreateKeypair,readConfig,pk,sol,rpcUrl,TP} from './lib.mjs';
import {findPayment,confirmSignature,newReference,solanaPayUrl,toRaw,solToLamports,tokenBalanceRaw,lamportsBalance,formatAmount} from '../chain.mjs';

const cfg=readConfig(),authority=loadOrCreateKeypair('authority'),player=loadOrCreateKeypair('e2e-player');
const item='rack',tokenPrice=cfg.itemsToken[item],solPrice=cfg.itemsSol[item],D=cfg.decimals;
let failed=0;const check=(name,ok,extra='')=>{console.log(`${ok?'PASS':'FAIL'}  ${name}${extra?'  '+extra:''}`);if(!ok)failed++;};
const t0=Date.now(),secs=()=>((Date.now()-t0)/1000).toFixed(0)+'s';
const order=(method,amountRaw)=>({method,reference:newReference(),treasuryOwner:cfg.treasuryOwner,minAmountRaw:amountRaw,mint:cfg.mint});
const find=(o,commitment='finalized')=>findPayment(cfg.rpc,{...o,commitment});

/** Send like a wallet app would from a payment link: the transfer plus the order's reference as a read-only extra account. */
async function walletSendsSol(to,lamports,reference){
  const ix=SystemProgram.transfer({fromPubkey:player.publicKey,toPubkey:pk(to),lamports});
  ix.keys.push({pubkey:pk(reference),isSigner:false,isWritable:false});
  return sendAndConfirmTransaction(connection,new Transaction().add(ix),[player],{commitment:'finalized'});
}
async function walletSendsToken(amountRaw,reference){
  const src=getAssociatedTokenAddressSync(pk(cfg.mint),player.publicKey,false,TP);
  const ix=createTransferCheckedInstruction(src,pk(cfg.mint),pk(cfg.treasuryAta),player.publicKey,amountRaw,D,[],TP);
  ix.keys.push({pubkey:pk(reference),isSigner:false,isWritable:false});
  return sendAndConfirmTransaction(connection,new Transaction().add(ix),[player],{commitment:'finalized'});
}

console.log('Network :',rpcUrl,'\nPlayer  :',player.publicKey.toBase58(),'\nTreasury:',cfg.treasuryOwner);
// Setup: give the simulated player SOL (from the authority, no faucet) and some game tokens.
if(await sol(player)<0.4)await sendAndConfirmTransaction(connection,new Transaction().add(SystemProgram.transfer({fromPubkey:authority.publicKey,toPubkey:player.publicKey,lamports:0.5*LAMPORTS_PER_SOL})),[authority]);
const pAta=await getOrCreateAssociatedTokenAccount(connection,authority,pk(cfg.mint),player.publicKey,false,'confirmed',undefined,TP);
await mintTo(connection,authority,pk(cfg.mint),pAta.address,authority,toRaw(1000,D),[],undefined,TP);
check('player funded with SOL and game tokens',await sol(player)>=0.4&&await tokenBalanceRaw(cfg.rpc,player.publicKey.toBase58(),cfg.mint)>=toRaw(tokenPrice,D));

// 1. SOL purchase.
const solOrder=order('sol',solToLamports(solPrice));
console.log(`\n[${secs()}] Order for ${item} in SOL. Payment link a wallet would open:\n  `+solanaPayUrl({recipient:cfg.treasuryOwner,amount:formatAmount(solOrder.minAmountRaw,9),reference:solOrder.reference,label:'High Stakes',message:item}));
check('no payment found before the player pays',(await find(solOrder,'confirmed')).reason==='no payment yet');
const tBefore=await lamportsBalance(cfg.rpc,cfg.treasuryOwner);
const solSig=await walletSendsSol(cfg.treasuryOwner,solOrder.minAmountRaw,solOrder.reference);
const solFound=await find(solOrder);
check('SOL payment found by reference once finalized',solFound.ok&&solFound.signature===solSig&&solFound.payer===player.publicKey.toBase58(),`[${secs()}]`);
const tAfter=await lamportsBalance(cfg.rpc,cfg.treasuryOwner);
check('treasury SOL rose by exactly the price (authority is also the fee payer of nothing here)',tAfter-tBefore===solOrder.minAmountRaw);

// 2. Token purchase (Token-2022).
const tokOrder=order('token',toRaw(tokenPrice,D));
const kBefore=await tokenBalanceRaw(cfg.rpc,cfg.treasuryOwner,cfg.mint);
const tokSig=await walletSendsToken(tokOrder.minAmountRaw,tokOrder.reference);
const tokFound=await find(tokOrder);
check('token payment found by reference once finalized',tokFound.ok&&tokFound.signature===tokSig&&tokFound.payer===player.publicKey.toBase58(),`[${secs()}]`);
check('treasury tokens rose by exactly the price',(await tokenBalanceRaw(cfg.rpc,cfg.treasuryOwner,cfg.mint))-kBefore===tokOrder.minAmountRaw);

// 3. Attacks against the real chain.
const under=order('sol',solToLamports(solPrice));
await walletSendsSol(cfg.treasuryOwner,under.minAmountRaw-1n,under.reference);
check('underpaying by one lamport is NOT accepted',!(await find(under)).ok);
const wrongTo=order('sol',solToLamports(solPrice));
await walletSendsSol(authority.publicKey.toBase58()===cfg.treasuryOwner?player.publicKey.toBase58():authority.publicKey.toBase58(),wrongTo.minAmountRaw,wrongTo.reference);
check('paying someone other than the treasury is NOT accepted',!(await find(wrongTo)).ok);
check('a different order cannot reuse a finished payment (references are one-time)',!(await find(order('sol',solOrder.minAmountRaw))).ok);
const wrongMethod={...solOrder,method:'token'};
check('a SOL payment cannot satisfy a token order',!(await find(wrongMethod)).ok);
console.log(`\nTx links:\n  SOL   https://explorer.solana.com/tx/${solSig}?cluster=devnet\n  token https://explorer.solana.com/tx/${tokSig}?cluster=devnet`);
console.log(failed?`\n${failed} check(s) FAILED`:`\nAll checks passed on devnet in ${secs()}.`);
process.exit(failed?1:0);

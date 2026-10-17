// Simulates a player's wallet app paying an order from a Solana Pay link (devnet only).
// Usage: node pay.mjs <reference> <sol|token> <amount>      (uses the throwaway e2e-player key)
import {SystemProgram,Transaction,sendAndConfirmTransaction} from '@solana/web3.js';
import {createTransferCheckedInstruction,getAssociatedTokenAddressSync} from '@solana/spl-token';
import {connection,loadOrCreateKeypair,readConfig,pk,TP} from './lib.mjs';
import {toRaw,solToLamports} from '../chain.mjs';
const [reference,method,amountArg]=process.argv.slice(2);
if(!reference||!['sol','token'].includes(method)||!(Number(amountArg)>0)){console.error('Usage: node pay.mjs <reference> <sol|token> <amount>');process.exit(1);}
const cfg=readConfig(),player=loadOrCreateKeypair('e2e-player');
let ix;
if(method==='sol')ix=SystemProgram.transfer({fromPubkey:player.publicKey,toPubkey:pk(cfg.treasuryOwner),lamports:solToLamports(Number(amountArg))});
else ix=createTransferCheckedInstruction(getAssociatedTokenAddressSync(pk(cfg.mint),player.publicKey,false,TP),pk(cfg.mint),pk(cfg.treasuryAta),player.publicKey,toRaw(Number(amountArg),cfg.decimals),cfg.decimals,[],TP);
ix.keys.push({pubkey:pk(reference),isSigner:false,isWritable:false});
const sig=await sendAndConfirmTransaction(connection,new Transaction().add(ix),[player],{commitment:'finalized'});
console.log('Paid. Tx:',`https://explorer.solana.com/tx/${sig}?cluster=devnet`);

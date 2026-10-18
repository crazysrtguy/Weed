// Tops up the HOT payout wallet (the small wallet the auto-payout function spends from) from the treasury. DEVNET.
// The hot wallet should only ever hold about one week of prizes plus fee SOL: that is the most a stolen hot key can lose.
// Usage: node fund-hot.mjs [--tokens 10000] [--sol 0.3] [--send]      (dry run unless --send)
// Mainnet note: the treasury will be a multisig, so this becomes a proposal that signers approve instead of a script.
import {SystemProgram,Transaction,sendAndConfirmTransaction,LAMPORTS_PER_SOL} from '@solana/web3.js';
import {createAssociatedTokenAccountIdempotentInstruction,createTransferCheckedInstruction,getAssociatedTokenAddressSync,getAccount} from '@solana/spl-token';
import {connection,loadOrCreateKeypair,readConfig,pk,TP,sol} from './lib.mjs';

const args=process.argv.slice(2),flag=(n,d)=>{const i=args.indexOf('--'+n);return i>=0?Number(args[i+1]):d;};
const wantTokens=flag('tokens',10000),wantSol=flag('sol',0.3),send=args.includes('--send');
const MAX_TOKENS=50000,MAX_SOL=2;
if(!(wantTokens>=0&&wantTokens<=MAX_TOKENS&&wantSol>=0&&wantSol<=MAX_SOL)){console.error(`Targets must be within ${MAX_TOKENS} tokens and ${MAX_SOL} SOL.`);process.exit(1);}

const cfg=readConfig(),authority=loadOrCreateKeypair('authority'),hot=pk(cfg.payoutWallet),mint=pk(cfg.mint);
const hotAta=getAssociatedTokenAddressSync(mint,hot,false,TP);
let haveTok=0;try{haveTok=Number((await getAccount(connection,hotAta,'confirmed',TP)).amount)/10**cfg.decimals;}catch{}
const haveSol=await sol(hot);
const needTok=Math.max(0,wantTokens-haveTok),needSol=Math.max(0,wantSol-haveSol);
console.log(`${send?'SENDING':'DRY RUN'}: hot wallet ${cfg.payoutWallet}`);
console.log(`  tokens: has ${haveTok}, target ${wantTokens}, will send ${needTok}`);
console.log(`  SOL   : has ${haveSol.toFixed(3)}, target ${wantSol}, will send ${needSol.toFixed(3)}`);
if(needTok>0&&needTok*10**cfg.decimals>Number((await getAccount(connection,pk(cfg.treasuryAta),'confirmed',TP)).amount)){console.error('Treasury does not hold enough tokens.');process.exit(1);}
if(needSol>0&&needSol>(await sol(authority))-0.05){console.error('Treasury SOL too low.');process.exit(1);}
if(!send){console.log('\nNothing sent. Re-run with --send.');process.exit(0);}
const tx=new Transaction();
if(needTok>0)tx.add(createAssociatedTokenAccountIdempotentInstruction(authority.publicKey,hotAta,hot,mint,TP),createTransferCheckedInstruction(pk(cfg.treasuryAta),mint,hotAta,authority.publicKey,BigInt(Math.round(needTok*10**cfg.decimals)),cfg.decimals,[],TP));
if(needSol>0)tx.add(SystemProgram.transfer({fromPubkey:authority.publicKey,toPubkey:hot,lamports:Math.round(needSol*LAMPORTS_PER_SOL)}));
if(!tx.instructions.length){console.log('Already at target.');process.exit(0);}
const sig=await sendAndConfirmTransaction(connection,tx,[authority],{commitment:'finalized'});
console.log('Done:',`https://explorer.solana.com/tx/${sig}?cluster=devnet`);

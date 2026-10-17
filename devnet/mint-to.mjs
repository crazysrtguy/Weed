// Devnet faucet: mint the game token to any wallet.  Usage: npm run faucet -- <wallet> [amount=1000]
import {getOrCreateAssociatedTokenAccount,mintTo} from '@solana/spl-token';
import {SystemProgram,Transaction,sendAndConfirmTransaction,LAMPORTS_PER_SOL} from '@solana/web3.js';
import {connection,loadOrCreateKeypair,readConfig,pk,sol,TP} from './lib.mjs';

const [wallet,amountArg='1000']=process.argv.slice(2);
if(!wallet){console.error('Usage: npm run faucet -- <wallet address> [amount]');process.exit(1);}
const amount=Number(amountArg);
if(!(amount>0&&amount<=100000)){console.error('Amount must be between 1 and 100000');process.exit(1);}
const cfg=readConfig(),authority=loadOrCreateKeypair('authority');
const owner=pk(wallet);
// Top up a little SOL for transaction fees (the public faucet is rate limited), paid by the devnet authority.
if(await sol(owner)<0.005){
  await sendAndConfirmTransaction(connection,new Transaction().add(SystemProgram.transfer({fromPubkey:authority.publicKey,toPubkey:owner,lamports:0.01*LAMPORTS_PER_SOL})),[authority]);
  console.log('Sent 0.01 devnet SOL for fees');
}
const ata=await getOrCreateAssociatedTokenAccount(connection,authority,pk(cfg.mint),owner,true,'confirmed',undefined,TP);
const sig=await mintTo(connection,authority,pk(cfg.mint),ata.address,authority,BigInt(amount)*10n**BigInt(cfg.decimals),[],undefined,TP);
console.log(`Minted ${amount} ${cfg.symbol} to ${wallet}`);
console.log('Token account:',ata.address.toBase58());
console.log('Tx:',`https://explorer.solana.com/tx/${sig}?cluster=devnet`);

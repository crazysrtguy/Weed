// Creates the DEVNET game token (Token-2022 with on-chain name/symbol) and the treasury token account once.
// Safe to rerun: it reuses what already exists. Keys stay in devnet/.keys (gitignored).
import fs from 'node:fs';
import {Keypair,SystemProgram,Transaction,sendAndConfirmTransaction} from '@solana/web3.js';
import {ExtensionType,getMintLen,createInitializeMetadataPointerInstruction,createInitializeMintInstruction,getOrCreateAssociatedTokenAccount,getTokenMetadata,TYPE_SIZE,LENGTH_SIZE} from '@solana/spl-token';
import {createInitializeInstruction,pack} from '@solana/spl-token-metadata';
import {connection,rpcUrl,loadOrCreateKeypair,configPath,publicConfigPath,sol,pk,TP,keysDir} from './lib.mjs';
import path from 'node:path';

const DECIMALS=6,NAME='High Stakes (devnet test)',SYMBOL='HSTEST';
// Shop prices. Players PAY BY SENDING: SOL goes to the treasury wallet, the token goes to the treasury token account.
const ITEMS_TOKEN={rack:150,lamp:100,bench:200,storage:150};
const ITEMS_SOL={rack:0.05,lamp:0.03,bench:0.07,storage:0.05};
const LINK_SOL=0.001;                                   // "link your wallet by sending": the sender becomes the player's wallet

const authority=loadOrCreateKeypair('authority');       // mint authority + treasury owner (devnet only; use a multisig on mainnet)
console.log('Network      :',rpcUrl);
console.log('Authority    :',authority.publicKey.toBase58());
const bal=await sol(authority);
console.log('Devnet SOL   :',bal.toFixed(3));
if(bal<0.05)throw new Error('Authority needs at least 0.05 devnet SOL (free at https://faucet.solana.com).');

let cfg=fs.existsSync(configPath)?JSON.parse(fs.readFileSync(configPath,'utf8')):null;
if(!cfg?.mint){
  const mintKp=Keypair.generate();
  const metadata={mint:mintKp.publicKey,name:NAME,symbol:SYMBOL,uri:'',additionalMetadata:[]};
  const mintLen=getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen=TYPE_SIZE+LENGTH_SIZE+pack(metadata).length;
  const rent=await connection.getMinimumBalanceForRentExemption(mintLen+metadataLen);
  const tx=new Transaction().add(
    SystemProgram.createAccount({fromPubkey:authority.publicKey,newAccountPubkey:mintKp.publicKey,space:mintLen,lamports:rent,programId:TP}),
    createInitializeMetadataPointerInstruction(mintKp.publicKey,authority.publicKey,mintKp.publicKey,TP),
    createInitializeMintInstruction(mintKp.publicKey,DECIMALS,authority.publicKey,null,TP),
    createInitializeInstruction({programId:TP,mint:mintKp.publicKey,metadata:mintKp.publicKey,name:NAME,symbol:SYMBOL,uri:'',mintAuthority:authority.publicKey,updateAuthority:authority.publicKey}));
  await sendAndConfirmTransaction(connection,tx,[authority,mintKp]);
  fs.writeFileSync(path.join(keysDir,'mint.json'),JSON.stringify(Array.from(mintKp.secretKey)),{mode:0o600});
  console.log('Created mint :',mintKp.publicKey.toBase58(),'(Token-2022)');
  cfg={cluster:'devnet',rpc:rpcUrl,symbol:SYMBOL,decimals:DECIMALS,mint:mintKp.publicKey.toBase58(),tokenProgram:TP.toBase58()};
}else console.log('Reusing mint :',cfg.mint);

const treasury=await getOrCreateAssociatedTokenAccount(connection,authority,pk(cfg.mint),authority.publicKey,false,'confirmed',undefined,TP);
Object.assign(cfg,{treasuryOwner:authority.publicKey.toBase58(),treasuryAta:treasury.address.toBase58(),itemsToken:ITEMS_TOKEN,itemsSol:ITEMS_SOL,linkSol:LINK_SOL});
fs.writeFileSync(configPath,JSON.stringify(cfg,null,2));
// Public copy for the website: addresses and prices only, never keys.
const {cluster,rpc,symbol,decimals,mint,tokenProgram,treasuryOwner,treasuryAta,itemsToken,itemsSol,linkSol}=cfg;
fs.writeFileSync(publicConfigPath,JSON.stringify({cluster,rpc,symbol,decimals,mint,tokenProgram,treasuryOwner,treasuryAta,itemsToken,itemsSol,linkSol},null,2));

const md=await getTokenMetadata(connection,pk(cfg.mint),'confirmed',TP);
console.log('On-chain name:',md?.name,'| symbol:',md?.symbol);
console.log('Treasury SOL address :',cfg.treasuryOwner);
console.log('Treasury token acct  :',cfg.treasuryAta);
console.log('Remaining SOL:',(await sol(authority)).toFixed(3));
console.log('\nExplorer:',`https://explorer.solana.com/address/${cfg.mint}?cluster=devnet`);
console.log('Next: npm run e2e   |   npm run faucet -- <wallet> 1000');

// Shared helpers for the DEVNET scripts. Nothing here can touch mainnet: the RPC URL must look like devnet.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Connection,Keypair,LAMPORTS_PER_SOL,PublicKey} from '@solana/web3.js';
import {TOKEN_2022_PROGRAM_ID} from '@solana/spl-token';
import {assertDevnet,DEVNET_RPC} from '../chain.mjs';

export const here=path.dirname(fileURLToPath(import.meta.url));
export const keysDir=path.join(here,'.keys');
export const configPath=path.join(here,'config.json');
export const publicConfigPath=path.join(here,'..','devnet-config.json');   // public addresses only; served by the site
export const ordersPath=path.join(here,'.orders.json');
export const TP=TOKEN_2022_PROGRAM_ID;                                     // the game token is a Token-2022 mint

export const rpcUrl=assertDevnet(process.env.DEVNET_RPC||DEVNET_RPC);
export const connection=new Connection(rpcUrl,'confirmed');

/** Load a Solana-CLI-format keypair file, creating a fresh one if missing. Keys live in devnet/.keys (gitignored). */
export function loadOrCreateKeypair(name){
  fs.mkdirSync(keysDir,{recursive:true});
  const file=path.join(keysDir,name+'.json');
  if(fs.existsSync(file))return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(file,'utf8'))));
  const kp=Keypair.generate();
  fs.writeFileSync(file,JSON.stringify(Array.from(kp.secretKey)),{mode:0o600});
  return kp;
}
export function readConfig(){
  if(!fs.existsSync(configPath))throw new Error('No devnet/config.json yet. Run: npm run setup');
  return JSON.parse(fs.readFileSync(configPath,'utf8'));
}
export const pk=s=>new PublicKey(s);
export const sol=async k=>(await connection.getBalance(k.publicKey??k))/LAMPORTS_PER_SOL;

/** Ask the public devnet faucet for SOL; it is rate limited, so retry politely and fail with instructions. */
export async function ensureSol(kp,minSol=0.5){
  for(let i=0;i<4&&(await sol(kp))<minSol;i++){
    try{
      const sig=await connection.requestAirdrop(kp.publicKey,1*LAMPORTS_PER_SOL);
      const bh=await connection.getLatestBlockhash();
      await connection.confirmTransaction({signature:sig,...bh},'confirmed');
    }catch(e){console.log(`  airdrop attempt ${i+1} failed: ${e.message.split('\n')[0]}`);await new Promise(r=>setTimeout(r,3000*(i+1)));}
  }
  const bal=await sol(kp);
  if(bal<minSol)throw new Error(`Authority has ${bal} devnet SOL (needs ${minSol}). Send some free devnet SOL (https://faucet.solana.com) to ${kp.publicKey.toBase58()} then rerun.`);
  return bal;
}

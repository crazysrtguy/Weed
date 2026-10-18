// The Solana side of automatic payouts (devnet): builds, signs and broadcasts ONE token transfer per payout row.
// The web3/spl-token modules are passed in, so the same file runs in Node tests and in the Deno edge function.
// The hot payout wallet is a SEPARATE small wallet funded with only the prize pool: its key never touches the treasury or the mint authority.
import {assertDevnet,base58} from './chain.mjs';

export function makeChain({web3,spl,rpcUrl,hotSecret,mint,expectedWallet,decimals}){
  const {Connection,Keypair,PublicKey,Transaction}=web3;
  assertDevnet(rpcUrl);
  const hot=Keypair.fromSecretKey(Uint8Array.from(hotSecret));
  if(hot.publicKey.toBase58()!==expectedWallet)throw new Error('payout key does not match the configured payout wallet');
  const conn=new Connection(rpcUrl,'confirmed'),mintPk=new PublicKey(mint),TP=spl.TOKEN_2022_PROGRAM_ID;
  const srcAta=spl.getAssociatedTokenAddressSync(mintPk,hot.publicKey,false,TP);
  return{
    hotAddress:hot.publicKey.toBase58(),
    validWallet(w){try{const k=new PublicKey(w);return PublicKey.isOnCurve(k.toBytes())&&k.toBase58()===w;}catch{return false;}},
    /** Build + sign. The signature is known BEFORE sending, so the caller can save it first. Creates the winner's token account if missing. */
    async prepare(row){
      const dest=new PublicKey(row.wallet),destAta=spl.getAssociatedTokenAddressSync(mintPk,dest,false,TP);
      const {blockhash,lastValidBlockHeight}=await conn.getLatestBlockhash('finalized');
      const tx=new Transaction({feePayer:hot.publicKey,blockhash,lastValidBlockHeight})
        .add(spl.createAssociatedTokenAccountIdempotentInstruction(hot.publicKey,destAta,dest,mintPk,TP))
        .add(spl.createTransferCheckedInstruction(srcAta,mintPk,destAta,hot.publicKey,BigInt(row.amount_raw),decimals,[],TP));
      tx.sign(hot);
      return{signature:base58(tx.signature),raw:tx.serialize().toString('base64'),lastValidHeight:lastValidBlockHeight};
    },
    async send(rawB64){return conn.sendRawTransaction(Uint8Array.from(atob(rawB64),c=>c.charCodeAt(0)),{skipPreflight:false,maxRetries:3});},
    /** 'finalized' | 'failed' | 'pending' (seen, not final) | null (unknown to the network) */
    async status(sig){
      const r=await conn.getSignatureStatuses([sig],{searchTransactionHistory:true}),s=r.value[0];
      if(!s)return null;if(s.err)return'failed';return s.confirmationStatus==='finalized'?'finalized':'pending';
    },
    /** Hot wallet balances: SOL (fees) and prize tokens. A missing token account counts as 0. */
    async balances(){
      const lamports=await conn.getBalance(hot.publicKey,'confirmed');let tokenRaw=0;
      try{tokenRaw=Number((await conn.getTokenAccountBalance(srcAta,'confirmed')).value.amount);}catch{}
      return{lamports,tokenRaw};
    },
    async expired(lastValidHeight){return(await conn.getBlockHeight('finalized'))>Number(lastValidHeight);}
  };
}

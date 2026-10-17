// Offline checks (no network, no keys): payment evaluation against crafted ADVERSARIAL transactions, plus helpers.
import {Keypair,PublicKey} from '@solana/web3.js';
import {evaluatePayment,base58,newReference,solanaPayUrl,formatAmount,toRaw,solToLamports,assertDevnet} from '../chain.mjs';
let failed=0;const check=(n,ok)=>{console.log((ok?'PASS  ':'FAIL  ')+n);if(!ok)failed++;};
const addr=()=>Keypair.generate().publicKey.toBase58();
const payer=addr(),treasury=addr(),mint=addr(),reference=newReference(),other=addr(),SYS='11111111111111111111111111111111';

// ---- SOL payments ----
const sol=({amount=50_000_000n,refIn=true,refSigner=false,err=null,toTreasury=true,payerPays=true,fee=5000n}={})=>({
  slot:1,meta:{err,
    preBalances:[10_000_000_000,1_000_000_000,1,0].map(BigInt).map(Number),
    postBalances:[Number(10_000_000_000n-(payerPays?amount+fee:fee)),Number(1_000_000_000n+(toTreasury?amount:0n)),1,0]},
  transaction:{message:{accountKeys:[{pubkey:payer,signer:true},{pubkey:toTreasury?treasury:other,signer:false},{pubkey:SYS,signer:false},...(refIn?[{pubkey:reference,signer:refSigner}]:[])]}}});
const S={method:'sol',reference,treasuryOwner:treasury,minAmountRaw:50_000_000n};
let r=evaluatePayment(sol(),S);
check('SOL: exact payment accepted and payer identified',r.ok&&r.payer===payer&&r.amountRaw===50_000_000n);
check('SOL: overpayment accepted',evaluatePayment(sol({amount:80_000_000n}),S).ok);
check('SOL: one lamport short is rejected',!evaluatePayment(sol({amount:49_999_999n}),S).ok);
check('SOL: missing reference rejected',!evaluatePayment(sol({refIn:false}),S).ok);
check('SOL: reference used as a signer rejected',!evaluatePayment(sol({refSigner:true}),S).ok);
check('SOL: failed transaction rejected',!evaluatePayment(sol({err:{InstructionError:[0,'x']}}),S).ok);
check('SOL: payment to someone else (treasury absent) rejected',!evaluatePayment(sol({toTreasury:false}),S).ok);
check('SOL: treasury balance rose but no signer paid rejected',!evaluatePayment(sol({payerPays:false}),S).ok);
check('SOL: wrong reference rejected',!evaluatePayment(sol(),{...S,reference:newReference()}).ok);
check('SOL: zero required amount rejected',!evaluatePayment(sol(),{...S,minAmountRaw:0n}).ok);
check('SOL: a SOL tx never satisfies a token order',!evaluatePayment(sol(),{method:'token',reference,treasuryOwner:treasury,minAmountRaw:1n,mint}).ok);
check('missing transaction rejected',!evaluatePayment(null,S).ok);

// ---- Token payments (Token or Token-2022, judged by balance changes) ----
const tb=(idx,owner,m,amount)=>({accountIndex:idx,mint:m,owner,uiTokenAmount:{amount:String(amount)}});
const tok=({amount=150_000_000n,mintUsed=mint,treasuryNew=false,toOwner=treasury,refIn=true,err=null}={})=>({
  slot:2,meta:{err,preBalances:[1e9,1,1,1,0],postBalances:[1e9-5000,1,1,1,0],
    preTokenBalances:[tb(1,payer,mintUsed,1_000_000_000),...(treasuryNew?[]:[tb(2,toOwner,mintUsed,5_000_000)])],
    postTokenBalances:[tb(1,payer,mintUsed,1_000_000_000n-amount),tb(2,toOwner,mintUsed,5_000_000n+amount)].map(b=>({...b,uiTokenAmount:{amount:String(b.uiTokenAmount.amount)}}))},
  transaction:{message:{accountKeys:[{pubkey:payer,signer:true},{pubkey:addr(),signer:false},{pubkey:addr(),signer:false},{pubkey:SYS,signer:false},...(refIn?[{pubkey:reference,signer:false}]:[])]}}});
const T={method:'token',reference,treasuryOwner:treasury,minAmountRaw:150_000_000n,mint};
r=evaluatePayment(tok(),T);
check('Token: exact payment accepted and payer identified',r.ok&&r.payer===payer);
check('Token: first-ever deposit (new treasury account) accepted',evaluatePayment(tok({treasuryNew:true}),T).ok);
check('Token: underpayment rejected',!evaluatePayment(tok({amount:149_999_999n}),T).ok);
check('Token: wrong mint (counterfeit token) rejected',!evaluatePayment(tok({mintUsed:addr()}),T).ok);
check('Token: sent to a different owner rejected',!evaluatePayment(tok({toOwner:other}),T).ok);
check('Token: missing reference rejected',!evaluatePayment(tok({refIn:false}),T).ok);
check('Token: failed transaction rejected',!evaluatePayment(tok({err:'x'}),T).ok);
check('Token: no mint configured rejected',!evaluatePayment(tok(),{...T,mint:undefined}).ok);

// ---- Helpers ----
const pkb=Keypair.generate().publicKey;
check('base58 matches the Solana library',base58(pkb.toBytes())===pkb.toBase58()&&base58(new Uint8Array(32))==='1'.repeat(32));
check('references are unique and 32 bytes when decoded',new Set(Array.from({length:50},newReference)).size===50&&new PublicKey(newReference()).toBytes().length===32);
check('amount helpers are exact',toRaw(150,6)===150_000_000n&&solToLamports(0.05)===50_000_000n&&formatAmount(150_000_000n,6)==='150'&&formatAmount(1_500_000n,6)==='1.5');
const url=solanaPayUrl({recipient:treasury,amount:'0.05',reference,label:'High Stakes',message:'Black & Gold rack'});
const parsed=new URL(url);
check('Solana Pay URL is well formed',url.startsWith(`solana:${treasury}?`)&&parsed.searchParams.get('amount')==='0.05'&&parsed.searchParams.get('reference')===reference&&parsed.searchParams.get('message')==='Black & Gold rack'&&!parsed.searchParams.has('spl-token'));
check('Solana Pay token URL carries the mint',new URL(solanaPayUrl({recipient:treasury,amount:'150',splToken:mint,reference})).searchParams.get('spl-token')===mint);
let blocked=false;try{assertDevnet('https://api.mainnet-beta.solana.com');}catch{blocked=true;}
check('mainnet RPC URLs are refused',blocked);
console.log(failed?`\n${failed} FAILED`:'\nAll offline checks passed.');process.exit(failed?1:0);

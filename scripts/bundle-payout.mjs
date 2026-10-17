// Builds ONE self-contained file for the hs-payout edge function (payout-core + payout-chain + chain + config + handler),
// for deploying through the Supabase dashboard editor. Usage: node scripts/bundle-payout.mjs <outfile>
import fs from 'node:fs';
const out=process.argv[2]||'hs-payout-bundle.ts';
const shared=n=>new URL('../supabase/functions/_shared/'+n,import.meta.url);
const read=u=>fs.readFileSync(u,'utf8').replace(/\r\n?/g,'\n');
const names=async n=>Object.keys(await import(shared(n).href));
const strip=src=>src
  .replace(/^import\s[^;]*;?[ \t]*$/gm,'')
  .replace(/^export\s*\{[^}]*\};?[ \t]*$/gm,'')
  .replace(/^export\s+(?=(?:async\s+)?(?:const|let|var|function|class)\b)/gm,'');
const wrap=(ns,src,ex,pre='')=>`const ${ns}=(()=>{${pre}\n${strip(src)}\nreturn {${ex.join(',')}};})();\n`;

const chainSrc=read(shared('chain.mjs')),cfgSrc=read(shared('pay-config.mjs')),coreSrc=read(shared('payout-core.mjs')),pchainSrc=read(shared('payout-chain.mjs'));
const cNames=await names('chain.mjs'),coreNames=await names('payout-core.mjs'),pcNames=await names('payout-chain.mjs');
// payout-chain uses assertDevnet/base58 from chain.mjs: bring them into scope inside its wrapper.
const handler=read(new URL('../supabase/functions/hs-payout/index.ts',import.meta.url))
  .replace(/^\/\/ deno-lint-ignore-file[^\n]*\n/,'').replace(/^import[^\n]*\n/gm,'');
let b="// @ts-nocheck\nimport {createClient} from 'npm:@supabase/supabase-js@2';\nimport * as web3 from 'npm:@solana/web3.js@1.98.0';\nimport * as spl from 'npm:@solana/spl-token@0.4.9';\n"
  +wrap('chainLib',chainSrc,cNames)+wrap('cfgNs',cfgSrc,['PAY_CONFIG'])+'const {PAY_CONFIG}=cfgNs;\n'
  +wrap('coreNs',coreSrc,coreNames)+'const {runPayouts}=coreNs;\n'
  +wrap('pchainNs',pchainSrc,pcNames,'const {assertDevnet,base58}=chainLib;')+'const {makeChain}=pchainNs;\n'
  +handler;
b=b.split('\n').filter(l=>!/^\s*\/\/(?!\s*@ts-nocheck)/.test(l)&&l.trim()!=='').map(l=>l.replace(/^\s+/,'')).join('\n')+'\n';
fs.writeFileSync(out,b);
console.log(`wrote ${out} (${b.length} chars)`);

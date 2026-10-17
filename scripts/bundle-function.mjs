// Builds ONE self-contained file for the hs-api edge function (engine + league + server-core + handler), for deploying
// through the Supabase dashboard editor (which cannot resolve ../_shared imports).
// Export lists come from importing the REAL modules, so nothing is guessed from the source text.
// Usage: node scripts/bundle-function.mjs <outfile>
import fs from 'node:fs';

const out=process.argv[2]||'hs-api-bundle.ts';
const shared=name=>new URL('../supabase/functions/_shared/'+name,import.meta.url);
const read=u=>fs.readFileSync(u,'utf8').replace(/\r\n?/g,'\n');
const exportsOf=async name=>Object.keys(await import(shared(name).href));

const strip=src=>src
  .replace(/^import\s[^;]*;?[ \t]*$/gm,'')
  .replace(/^export\s*\{[^}]*\};?[ \t]*$/gm,'')
  .replace(/^export\s+(?=(?:async\s+)?(?:const|let|var|function|class)\b)/gm,'');
const wrap=(ns,src,names,pre='')=>`const ${ns}=(()=>{${pre}\n${strip(src)}\nreturn {${names.join(',')}};})();\n`;

const chainSrc=read(shared('chain.mjs')),cfgSrc=read(shared('pay-config.mjs')),cNames=await exportsOf('chain.mjs');
const engine=read(shared('engine.mjs')),league=read(shared('league.mjs')),server=read(shared('server-core.mjs'));
const eNames=await exportsOf('engine.mjs'),lNames=await exportsOf('league.mjs'),sNames=await exportsOf('server-core.mjs');

// Safety net: every name another module takes from E or L must exist in that module's real exports.
const problems=[];
for(const [ns,names,mods] of [['E',eNames,[league,server]],['L',lNames,[server]]]){
  for(const src of mods){
    for(const m of src.matchAll(new RegExp(`\\b${ns}\\.([A-Za-z0-9_$]+)`,'g')))if(!names.includes(m[1]))problems.push(`${ns}.${m[1]}`);
  }
}
for(const m of league.matchAll(/import\s*\{([^}]*)\}\s*from\s*'\.\/engine\.mjs'/g))for(const n of m[1].split(',').map(s=>s.trim()).filter(Boolean))if(!eNames.includes(n))problems.push('engine import '+n);
if(!sNames.includes('handle'))problems.push('server-core.handle');
if(problems.length){console.error('Bundle would be missing:',[...new Set(problems)].join(', '));process.exit(1);}

const handler=read(new URL('../supabase/functions/hs-api/index.ts',import.meta.url))
  .replace(/^\/\/ deno-lint-ignore-file[^\n]*\n/,'').replace(/^import[^\n]*\n/gm,'').replace(/^\/\/ High Stakes API[^\n]*\n/m,'');

let bundle="// @ts-nocheck\nimport {createClient} from 'npm:@supabase/supabase-js@2';\n"
  +wrap('chain',chainSrc,cNames)+wrap('payCfgNs',cfgSrc,['PAY_CONFIG'])+'const {PAY_CONFIG}=payCfgNs;\n'+wrap('E',engine,eNames)+wrap('L',league,lNames,'const {STRAINS,STRAIN_IDS}=E;')+wrap('S',server,sNames)+'const {handle}=S;\n'+handler;
// Slim: drop full-line comments, blank lines and indentation (code unchanged).
bundle=bundle.split('\n')
  .filter(l=>!/^\s*\/\/(?!\s*@ts-nocheck)/.test(l)&&l.trim()!=='')
  .map(l=>l.replace(/^\s+/,'')).join('\n')+'\n';
fs.writeFileSync(out,bundle);
console.log(`wrote ${out} (${bundle.length} chars); engine exports ${eNames.length}, league ${lNames.length}, server ${sNames.length}; no missing names`);

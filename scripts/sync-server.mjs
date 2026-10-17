// Copies the shared rule modules into the edge function so the server runs the exact same engine as the client.
import {copyFileSync,mkdirSync} from 'node:fs';
mkdirSync('supabase/functions/_shared',{recursive:true});
for(const f of ['engine.mjs','league.mjs','server-core.mjs'])copyFileSync(f,`supabase/functions/_shared/${f}`);
console.log('synced engine, league, server-core to supabase/functions/_shared');

# High Stakes prototype v2

2.5D garage using layered WebP sprites. Free play: plant ($25), wait 90 seconds, harvest, fill buyer orders, purchase upgrades with earned game cash. Marcus replants harvested pots. Black & Gold cosmetics use TEST credits only. No real Solana balances, deposits, purchases, withdrawals or prizes are implemented.

Open through a static HTTP host. Entry point index.html; game.mjs UI; engine.mjs rules; scene.mjs art renderer. Progress lives in this browser localStorage. Earlier saves migrate automatically.

Run `node --test tests/engine.test.mjs`. Eight rule tests cover transaction guards, timed growth, upgrades, ownership, migration and recovery. Browser visual/mobile QA remains pending.

Art uses existing generated masters, resized as WebP runtime assets. Canvas suppresses faint edge alpha and aligns foliage above a fixed pot. Final edge cleanup and perspective review remain art polish work.

## Strains (placeholders)

`STRAINS` in `engine.mjs` defines 4 strains (name, grow time, seed cost, order value, unlock by lifetime sales). Until real art exists they reuse the Garage OG sprites with a CSS tint. To swap in real art: add `assets/v2/<id>-starter|young|developed|ready.webp` (transparent, same camera angle and pot position) and set `art:true` on that strain. Rename strains by editing `name`. Bryce only buys `tier>=2` jars; order pay scales by the strain `value` of the jars used.

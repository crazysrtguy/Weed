# High Stakes prototype v2

2.5D garage using layered WebP sprites. Free play: plant ($25), wait 90 seconds, harvest, fill buyer orders, purchase upgrades with earned game cash. Marcus replants harvested pots. Black & Gold cosmetics use TEST credits only. No real Solana balances, deposits, purchases, withdrawals or prizes are implemented.

Open through a static HTTP host. Entry point index.html; game.mjs UI; engine.mjs rules; scene.mjs art renderer. Progress lives in this browser localStorage. Earlier saves migrate automatically.

Run `node --test tests/engine.test.mjs`. Eight rule tests cover transaction guards, timed growth, upgrades, ownership, migration and recovery. Browser visual/mobile QA remains pending.

Art uses existing generated masters, resized as WebP runtime assets. Canvas suppresses faint edge alpha and aligns foliage above a fixed pot. Final edge cleanup and perspective review remain art polish work.

## Strains

`STRAINS` in `engine.mjs` defines 4 strains: Garage OG, Midnight Purple, Citrus Riot, Frostbite (name, grow time, seed cost, order value, unlock by lifetime sales). Real art is in `assets/v2/<id>-{starter,young,developed,ready,seed,jar}.webp`; Garage OG reuses the original base sprites for its growth stages. A strain without its own art can set `art:false` plus a CSS `tint` to reuse the OG sprites. Bryce only buys `tier>=2` jars; order pay scales by the `value` of the jars used. The art is still marked as needing alpha-edge cleanup and in-game alignment QA.

## Upgrades and staged art (tier-2 batch)

Build-tab upgrades now include Pro LED lights (all crops grow 20% faster, swaps lamps to `lamp-pro`), Trim workstation (+2 jars per harvest, swaps the bench to `bench-pro`) and Inline ventilation (removes the fan incident, adds the `vent` prop). Lamp cables hang from eyelets that `scene.mjs` detects from each lamp sprite, so new lamp art works without hard-coded positions. Delivering an order shows the buyer's `-happy` portrait with the `carton`.

Converted but not used yet (staged for the next features): `shelves-pro` (tier-2 storage), `tray-buds`, `branch` (dry and cure step), `flood-tray` (watering), `door`, `room-industrial` (second location). Originals are in `art/png-masters/tier2-batch/`.

## Care and maintenance

Growing pots ask for **Water** at 33% growth and **Feed** at 66%; each completed task adds +15% jars at harvest, and neglect only forgoes the bonus (crops never die). Tap the glowing pot label, or use **Tend all** (it becomes **Harvest & tend** when crops are also ready). **Flood tray irrigation** (upgrade, uses `flood-tray` art) waters automatically; **Marcus** feeds automatically. Lamps and filters **wear** with each harvest (half as fast with ventilation); at the limit crops grow 25% slower and lamps render dim until a $120 **service** in the Build tab. Logic lives in `engine.mjs` (`careNeeded`, `tend`, `tendAll`, `service`, `WEAR_LIMIT`).

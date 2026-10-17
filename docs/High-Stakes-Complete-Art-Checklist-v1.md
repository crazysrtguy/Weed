# High Stakes — Complete Production Art Checklist

Version 1.0 · October 17, 2026 · Working production scope

This checklist covers the full long-term 2.5D game, not just the garage demo. It incorporates the latest direction: Solana/Pump.fun project token; free core gameplay; optional cosmetics, collectibles, and bounded convenience purchases. Actual token branding is pending. The earlier master plan contains broader monetization proposals; this art checklist follows the newer conversation where those differ.

All entries start **unapproved**. Existing mockups, the empty garage, and the mature plant sprite are reference/prototype candidates; none is automatically counted as production-ready. This checklist does not assert that art has been generated or integrated.

## How to use this checklist

Each checkbox is one independently reviewable deliverable. An animation frame is one deliverable; a component state sheet is one design deliverable covering several states. Counts are **not** numbers of image-generation calls, unique painted scenes, or runtime files. Atlas packing, derived thumbnails, and reusable components reduce final runtime files. Audio and QA are separately identified.

- **P0 — First polished playable garage:** art lock, one strain’s four real stages, stable pot, starter equipment, basic interactions.
- **P1 — Persistent content alpha / shop foundation:** six strains total, workshop and packaging, first four staff/buyers, essential UI, first twelve decor items.
- **P2 — Public-game scope:** twelve strains total, barn, supporting rooms, social/challenge screens, initial paid cosmetic sets.
- **P3 — Long-term expansion:** remaining permanent strains, warehouse/flagship/estate, advanced equipment and worker walking.
- **P4 — Seasonal content:** themed strains and events; release only when needed.

Priorities specify content availability, not permission to skip prerequisites. A P2 room may reuse P1 components; final integration requires compatible camera and anchors.

### Status workflow

Unstarted → brief locked → generated/drawn → cleaned → art approved → integrated → in-game approved. Keep the checkbox empty until **in-game approved**. Track owner, source path, source rights, revision, dependency IDs, and review notes in the project manifest. A visually pleasing isolated image is not accepted until it fits the actual scene.

## Locked visual direction

- Detailed realistic **pre-rendered-looking 2.5D**, fixed elevated three-quarter view; cooler concrete interiors, violet practical lights, lime UI accents.
- Adult business comedy; believable objects and expressive adults. No anthropomorphic plants or toy-like proportions.
- Pick one camera and lighting reference per room. Do not independently guess angles for each generation.
- Use an initial orthographic-like camera reference of about 30° elevation; approve a calibration image before production. Painted perspective and vanishing points must agree with that reference.
- One stable root anchor for all plant stages; one stable heel anchor for each character loop. No changing pot size to imply growth.
- All purchasable, moving, harvestable, or replaceable elements stay separate from room bases. Static tools, wall wear, and inaccessible scenery may be baked in.
- Foreground art, masks, glows, and contact shadows are separate where layering requires it. No baked buttons, timers, balances, prices, labels, or player names in scene art.
- Paid visual variants inherit gameplay footprints and hit targets. A skin must look like the shop preview after equipping.

## Master and export specifications

These are proposed source standards; runtime dimensions are derived from actual on-screen size and profiling. Do not load every source-resolution image at once.

| Spec | Source canvas / output rule |
|---|---|
| ENV | 3072×2048 landscape master with generous floor coverage; compose for a tested mobile crop; layered editable source plus opaque lossless master |
| ENV-ALPHA | Exact same canvas and registration as its ENV; transparent PNG master |
| MASK | Exact registration of owning asset; grayscale PNG or explicit polygons; never JPEG |
| LAYOUT | JSON/scene metadata in normalized coordinates plus annotated review image; sockets, anchors, paths, occlusion and hit shapes |
| PLANT | 1024×1536 transparent PNG; root anchor (512, 1382), stable canopy envelope; foliage only, pot separate |
| PROP | Up to 1536×1536 transparent PNG; per-family fixed canvas and approved ground pivot |
| SMALL-PROP | 768×768 transparent PNG; pivot recorded |
| CHARACTER | 768×1152 transparent PNG per frame; heel anchor (384, 1056); identical framing throughout a loop |
| PORTRAIT | 1024×1024 master; transparent background; safe circle crop and square crop |
| ICON | 512×512 transparent master, tested at 48 px; 1024 source only if needed for close views |
| CARD | 1600×1000 master; subject safe for 4:3 and square thumbnails; text separate |
| THUMB | 800×500 derived room preview, manually reviewed |
| VECTOR | Editable SVG/design source; theme tokens and accessible contrast; no raster substitute for basic interface icons |
| DESIGN | Editable component/layout design with states and spacing; code-native implementation |
| SCREEN | 1080×1920 mobile and 1920×1080 desktop composition references; test narrow 360 CSS px layout separately |
| FX | Usually 512×512 transparent elements/frames; glow edges feathered; blend mode declared |
| REVIEW | Annotated contact sheet or acceptance record, not player-facing art |
| AUDIO | Lossless WAV master plus compact runtime encode; loop boundaries and loudness reviewed |
| MARKETING | App icon 1024²; landscape 1200×630; square 1080²; portrait 1080×1920; loading art adapts to viewport |

Opaque scene textures can export to WebP/AVIF; alpha sprites to tested WebP/PNG/atlas format. Retain PNG masters. Check premultiplied-alpha handling against dark and light backgrounds. Avoid wasteful full-canvas textures for tiny particles.

### File and dependency rules

Use lowercase filenames such as `plant-garage-og-ready-v001.png`. ID remains stable across revisions. Store `source/`, `exports/`, `atlases/`, and `metadata/` separately. Record pivot, crop bounds, scale, camera preset, room compatibility, shadow reference, frame duration, licensing/source history, and content ID. An atlas is a derivative; retain individual frames.

For mirrored directions, check clothing asymmetry and props. For paid outfits, a body sprite alone is insufficient once the character walks: either generate every compatible action/direction or explicitly restrict the outfit to the supported stationary role. Do not silently show default clothes during work.

## Scope counts

| Priority | Checklist deliverables |
|---|---:|
| P0 | 167 |
| P1 | 326 |
| P2 | 359 |
| P3 | 444 |
| P4 | 85 |
| **Total** | **1381** |

### Category totals

| Category | Deliverables |
|---|---:|
| 01 — Art direction | 10 |
| 02 — Environments | 112 |
| 03 — World and travel | 15 |
| 04 — Plants and genetics | 168 |
| 05 — Pots and placement | 12 |
| 06 — Equipment | 120 |
| 07 — Products and packaging | 44 |
| 08 — Staff | 128 |
| 09 — Later worker movement | 264 |
| 10 — Buyers and player identity | 40 |
| 11 — Token shop cosmetics | 148 |
| 12 — Decor and collectibles | 48 |
| 13 — Competition and crews | 23 |
| 14 — UI visual system | 86 |
| 15 — Screen compositions | 46 |
| 16 — Effects and ambient parts | 58 |
| 17 — Event packs | 21 |
| 18 — Branding and launch | 11 |
| 19 — Companion audio scope | 14 |
| 20 — Integration and acceptance | 13 |

### Important scope boundaries

The full target has 14 room scenes (six core properties plus eight specialized rooms). This expands the earlier rough six-property count; ancillary room art is included explicitly. It does not mean every property needs every room repainted. Reuse compatible ancillary scenes until a distinct layout earns its cost.

There are 96 strain-stage paintings in the long-term roster, plus collection/seed/clone views. The 24 stage paintings for the first six strains are the alpha subset, not additional to the 96.

The eight workers require 256 walk frames at the proposed four-direction/eight-frame standard, plus route reviews. This expensive P3 pack is optional for initial launch; stationary work loops provide activity sooner. The six stationary Marcus outfit packs include their own idle/work frames separately; none is included in the 256 walk frames.

The equipment list reserves five tiers for ten families. Start with tiers 1–3; later tiers are explicitly P3. Do not paint tiers 4–5 before their gameplay silhouettes are approved.

The six cosmetic sets are a finite initial catalog. They are not promised to fit every room and character automatically. Additional compatibility variants require new checklist entries before sale.

## Detailed asset checklist

## 01 — Art direction

- [ ] **AD-style** — Visual style bible · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-camera** — Camera and perspective reference board · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-palette** — Lighting, material, and palette board · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-scale** — Human, plant, pot, and equipment scale sheet · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-anchor** — Sprite anchors and ground-contact rules · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-ui** — UI components and typography guide · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-currency** — Game cash, project token, and XP visual distinction · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-character** — Character lineup and proportion sheet · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-plant** — Four-stage plant continuity sheet · P0 · `Design source + review sheet` · Lock before mass production
- [ ] **AD-export** — Export, atlas, mask, and naming guide · P0 · `Design source + review sheet` · Lock before mass production

## 02 — Environments

- [ ] **ENV-garage-base** — Garage: empty base environment · P0 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-foreground** — Garage: foreground occlusion color layer · P0 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-mask** — Garage: foreground occlusion mask · P0 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-light** — Garage: separate practical-light overlay · P0 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-shadow** — Garage: static separable prop shadow layer · P0 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-layout** — Garage: socket, walk-path, and interaction layout · P0 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-thumb** — Garage: property selection thumbnail · P0 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-garage-crop** — Garage: portrait and landscape framing validation sheet · P0 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-base** — Converted workshop: empty base environment · P1 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-foreground** — Converted workshop: foreground occlusion color layer · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-mask** — Converted workshop: foreground occlusion mask · P1 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-light** — Converted workshop: separate practical-light overlay · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-shadow** — Converted workshop: static separable prop shadow layer · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-layout** — Converted workshop: socket, walk-path, and interaction layout · P1 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-thumb** — Converted workshop: property selection thumbnail · P1 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-workshop-crop** — Converted workshop: portrait and landscape framing validation sheet · P1 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-base** — Rural barn: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-foreground** — Rural barn: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-mask** — Rural barn: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-light** — Rural barn: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-shadow** — Rural barn: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-layout** — Rural barn: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-thumb** — Rural barn: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-barn-crop** — Rural barn: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-base** — Commercial warehouse grow room: empty base environment · P3 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-foreground** — Commercial warehouse grow room: foreground occlusion color layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-mask** — Commercial warehouse grow room: foreground occlusion mask · P3 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-light** — Commercial warehouse grow room: separate practical-light overlay · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-shadow** — Commercial warehouse grow room: static separable prop shadow layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-layout** — Commercial warehouse grow room: socket, walk-path, and interaction layout · P3 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-thumb** — Commercial warehouse grow room: property selection thumbnail · P3 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-warehouse-crop** — Commercial warehouse grow room: portrait and landscape framing validation sheet · P3 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-base** — Flagship grow room: empty base environment · P3 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-foreground** — Flagship grow room: foreground occlusion color layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-mask** — Flagship grow room: foreground occlusion mask · P3 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-light** — Flagship grow room: separate practical-light overlay · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-shadow** — Flagship grow room: static separable prop shadow layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-layout** — Flagship grow room: socket, walk-path, and interaction layout · P3 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-thumb** — Flagship grow room: property selection thumbnail · P3 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-flagship-crop** — Flagship grow room: portrait and landscape framing validation sheet · P3 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-base** — Prestige estate grow room: empty base environment · P3 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-foreground** — Prestige estate grow room: foreground occlusion color layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-mask** — Prestige estate grow room: foreground occlusion mask · P3 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-light** — Prestige estate grow room: separate practical-light overlay · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-shadow** — Prestige estate grow room: static separable prop shadow layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-layout** — Prestige estate grow room: socket, walk-path, and interaction layout · P3 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-thumb** — Prestige estate grow room: property selection thumbnail · P3 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-estate-crop** — Prestige estate grow room: portrait and landscape framing validation sheet · P3 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-base** — Nursery / collection room: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-foreground** — Nursery / collection room: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-mask** — Nursery / collection room: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-light** — Nursery / collection room: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-shadow** — Nursery / collection room: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-layout** — Nursery / collection room: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-thumb** — Nursery / collection room: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-nursery-crop** — Nursery / collection room: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-base** — Packaging room: empty base environment · P1 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-foreground** — Packaging room: foreground occlusion color layer · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-mask** — Packaging room: foreground occlusion mask · P1 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-light** — Packaging room: separate practical-light overlay · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-shadow** — Packaging room: static separable prop shadow layer · P1 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-layout** — Packaging room: socket, walk-path, and interaction layout · P1 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-thumb** — Packaging room: property selection thumbnail · P1 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-packaging-crop** — Packaging room: portrait and landscape framing validation sheet · P1 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-base** — Fictional product studio: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-foreground** — Fictional product studio: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-mask** — Fictional product studio: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-light** — Fictional product studio: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-shadow** — Fictional product studio: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-layout** — Fictional product studio: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-thumb** — Fictional product studio: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-studio-crop** — Fictional product studio: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-base** — Storage and dispatch: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-foreground** — Storage and dispatch: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-mask** — Storage and dispatch: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-light** — Storage and dispatch: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-shadow** — Storage and dispatch: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-layout** — Storage and dispatch: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-thumb** — Storage and dispatch: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-dispatch-crop** — Storage and dispatch: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-base** — Business office: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-foreground** — Business office: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-mask** — Business office: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-light** — Business office: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-shadow** — Business office: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-layout** — Business office: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-thumb** — Business office: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-office-crop** — Business office: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-base** — Staff lounge: empty base environment · P3 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-foreground** — Staff lounge: foreground occlusion color layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-mask** — Staff lounge: foreground occlusion mask · P3 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-light** — Staff lounge: separate practical-light overlay · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-shadow** — Staff lounge: static separable prop shadow layer · P3 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-layout** — Staff lounge: socket, walk-path, and interaction layout · P3 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-thumb** — Staff lounge: property selection thumbnail · P3 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-lounge-crop** — Staff lounge: portrait and landscape framing validation sheet · P3 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-base** — Public showroom: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-foreground** — Public showroom: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-mask** — Public showroom: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-light** — Public showroom: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-shadow** — Public showroom: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-layout** — Public showroom: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-thumb** — Public showroom: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-showroom-crop** — Public showroom: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-base** — Equal-resource competition room: empty base environment · P2 · `ENV` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-foreground** — Equal-resource competition room: foreground occlusion color layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-mask** — Equal-resource competition room: foreground occlusion mask · P2 · `MASK` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-light** — Equal-resource competition room: separate practical-light overlay · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-shadow** — Equal-resource competition room: static separable prop shadow layer · P2 · `ENV-ALPHA` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-layout** — Equal-resource competition room: socket, walk-path, and interaction layout · P2 · `LAYOUT` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-thumb** — Equal-resource competition room: property selection thumbnail · P2 · `THUMB` · Base excludes all purchasable / moving / harvestable objects
- [ ] **ENV-challenge-crop** — Equal-resource competition room: portrait and landscape framing validation sheet · P2 · `REVIEW` · Base excludes all purchasable / moving / harvestable objects

## 03 — World and travel

- [ ] **WORLD-garage-exterior** — Garage exterior destination card · P0 · `CARD`
- [ ] **WORLD-garage-map** — Garage map marker illustration · P0 · `ICON`
- [ ] **WORLD-workshop-exterior** — Converted workshop exterior destination card · P1 · `CARD`
- [ ] **WORLD-workshop-map** — Converted workshop map marker illustration · P1 · `ICON`
- [ ] **WORLD-barn-exterior** — Rural barn exterior destination card · P2 · `CARD`
- [ ] **WORLD-barn-map** — Rural barn map marker illustration · P2 · `ICON`
- [ ] **WORLD-warehouse-exterior** — Commercial warehouse grow room exterior destination card · P3 · `CARD`
- [ ] **WORLD-warehouse-map** — Commercial warehouse grow room map marker illustration · P3 · `ICON`
- [ ] **WORLD-flagship-exterior** — Flagship grow room exterior destination card · P3 · `CARD`
- [ ] **WORLD-flagship-map** — Flagship grow room map marker illustration · P3 · `ICON`
- [ ] **WORLD-estate-exterior** — Prestige estate grow room exterior destination card · P3 · `CARD`
- [ ] **WORLD-estate-map** — Prestige estate grow room map marker illustration · P3 · `ICON`
- [ ] **WORLD-map** — Neighborhood world map background · P1 · `ENV`
- [ ] **WORLD-travel** — Travel transition composition · P1 · `DESIGN`
- [ ] **WORLD-locked** — Locked-property silhouette kit · P1 · `DESIGN`

## 04 — Plants and genetics

- [ ] **PLANT-garage-og-starter** — Garage OG: starter · P0 · `PLANT` · broad green crown; identical root anchor, pot supplied separately
- [ ] **PLANT-garage-og-young** — Garage OG: young · P0 · `PLANT` · broad green crown; identical root anchor, pot supplied separately
- [ ] **PLANT-garage-og-developed** — Garage OG: developed · P0 · `PLANT` · broad green crown; identical root anchor, pot supplied separately
- [ ] **PLANT-garage-og-ready** — Garage OG: ready · P0 · `PLANT` · broad green crown; identical root anchor, pot supplied separately
- [ ] **GEN-garage-og-portrait** — Garage OG: collection portrait · P0 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-garage-og-seed** — Garage OG: seed packet illustration · P0 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-garage-og-clone** — Garage OG: clone tray illustration · P0 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-paper-hands-starter** — Paper Hands: starter · P1 · `PLANT` · compact lime foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-paper-hands-young** — Paper Hands: young · P1 · `PLANT` · compact lime foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-paper-hands-developed** — Paper Hands: developed · P1 · `PLANT` · compact lime foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-paper-hands-ready** — Paper Hands: ready · P1 · `PLANT` · compact lime foliage; identical root anchor, pot supplied separately
- [ ] **GEN-paper-hands-portrait** — Paper Hands: collection portrait · P1 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-paper-hands-seed** — Paper Hands: seed packet illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-paper-hands-clone** — Paper Hands: clone tray illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-diamond-bud-starter** — Diamond Bud: starter · P1 · `PLANT` · dense cool highlights; identical root anchor, pot supplied separately
- [ ] **PLANT-diamond-bud-young** — Diamond Bud: young · P1 · `PLANT` · dense cool highlights; identical root anchor, pot supplied separately
- [ ] **PLANT-diamond-bud-developed** — Diamond Bud: developed · P1 · `PLANT` · dense cool highlights; identical root anchor, pot supplied separately
- [ ] **PLANT-diamond-bud-ready** — Diamond Bud: ready · P1 · `PLANT` · dense cool highlights; identical root anchor, pot supplied separately
- [ ] **GEN-diamond-bud-portrait** — Diamond Bud: collection portrait · P1 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-diamond-bud-seed** — Diamond Bud: seed packet illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-diamond-bud-clone** — Diamond Bud: clone tray illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-couchlock-classic-starter** — Couchlock Classic: starter · P1 · `PLANT` · broad dark leaves; identical root anchor, pot supplied separately
- [ ] **PLANT-couchlock-classic-young** — Couchlock Classic: young · P1 · `PLANT` · broad dark leaves; identical root anchor, pot supplied separately
- [ ] **PLANT-couchlock-classic-developed** — Couchlock Classic: developed · P1 · `PLANT` · broad dark leaves; identical root anchor, pot supplied separately
- [ ] **PLANT-couchlock-classic-ready** — Couchlock Classic: ready · P1 · `PLANT` · broad dark leaves; identical root anchor, pot supplied separately
- [ ] **GEN-couchlock-classic-portrait** — Couchlock Classic: collection portrait · P1 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-couchlock-classic-seed** — Couchlock Classic: seed packet illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-couchlock-classic-clone** — Couchlock Classic: clone tray illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-exit-liquidity-starter** — Exit Liquidity: starter · P1 · `PLANT` · purple tips; identical root anchor, pot supplied separately
- [ ] **PLANT-exit-liquidity-young** — Exit Liquidity: young · P1 · `PLANT` · purple tips; identical root anchor, pot supplied separately
- [ ] **PLANT-exit-liquidity-developed** — Exit Liquidity: developed · P1 · `PLANT` · purple tips; identical root anchor, pot supplied separately
- [ ] **PLANT-exit-liquidity-ready** — Exit Liquidity: ready · P1 · `PLANT` · purple tips; identical root anchor, pot supplied separately
- [ ] **GEN-exit-liquidity-portrait** — Exit Liquidity: collection portrait · P1 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-exit-liquidity-seed** — Exit Liquidity: seed packet illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-exit-liquidity-clone** — Exit Liquidity: clone tray illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-gas-station-gelato-starter** — Gas Station Gelato: starter · P1 · `PLANT` · pale violet accents; identical root anchor, pot supplied separately
- [ ] **PLANT-gas-station-gelato-young** — Gas Station Gelato: young · P1 · `PLANT` · pale violet accents; identical root anchor, pot supplied separately
- [ ] **PLANT-gas-station-gelato-developed** — Gas Station Gelato: developed · P1 · `PLANT` · pale violet accents; identical root anchor, pot supplied separately
- [ ] **PLANT-gas-station-gelato-ready** — Gas Station Gelato: ready · P1 · `PLANT` · pale violet accents; identical root anchor, pot supplied separately
- [ ] **GEN-gas-station-gelato-portrait** — Gas Station Gelato: collection portrait · P1 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-gas-station-gelato-seed** — Gas Station Gelato: seed packet illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-gas-station-gelato-clone** — Gas Station Gelato: clone tray illustration · P1 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-margin-call-starter** — Margin Call: starter · P2 · `PLANT` · narrow jagged crown; identical root anchor, pot supplied separately
- [ ] **PLANT-margin-call-young** — Margin Call: young · P2 · `PLANT` · narrow jagged crown; identical root anchor, pot supplied separately
- [ ] **PLANT-margin-call-developed** — Margin Call: developed · P2 · `PLANT` · narrow jagged crown; identical root anchor, pot supplied separately
- [ ] **PLANT-margin-call-ready** — Margin Call: ready · P2 · `PLANT` · narrow jagged crown; identical root anchor, pot supplied separately
- [ ] **GEN-margin-call-portrait** — Margin Call: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-margin-call-seed** — Margin Call: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-margin-call-clone** — Margin Call: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-whale-breath-starter** — Whale Breath: starter · P2 · `PLANT` · heavy wide crown; identical root anchor, pot supplied separately
- [ ] **PLANT-whale-breath-young** — Whale Breath: young · P2 · `PLANT` · heavy wide crown; identical root anchor, pot supplied separately
- [ ] **PLANT-whale-breath-developed** — Whale Breath: developed · P2 · `PLANT` · heavy wide crown; identical root anchor, pot supplied separately
- [ ] **PLANT-whale-breath-ready** — Whale Breath: ready · P2 · `PLANT` · heavy wide crown; identical root anchor, pot supplied separately
- [ ] **GEN-whale-breath-portrait** — Whale Breath: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-whale-breath-seed** — Whale Breath: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-whale-breath-clone** — Whale Breath: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-candle-wick-starter** — Candle Wick: starter · P2 · `PLANT` · tall slender form; identical root anchor, pot supplied separately
- [ ] **PLANT-candle-wick-young** — Candle Wick: young · P2 · `PLANT` · tall slender form; identical root anchor, pot supplied separately
- [ ] **PLANT-candle-wick-developed** — Candle Wick: developed · P2 · `PLANT` · tall slender form; identical root anchor, pot supplied separately
- [ ] **PLANT-candle-wick-ready** — Candle Wick: ready · P2 · `PLANT` · tall slender form; identical root anchor, pot supplied separately
- [ ] **GEN-candle-wick-portrait** — Candle Wick: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-candle-wick-seed** — Candle Wick: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-candle-wick-clone** — Candle Wick: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-green-candle-starter** — Green Candle: starter · P2 · `PLANT` · upright bright foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-green-candle-young** — Green Candle: young · P2 · `PLANT` · upright bright foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-green-candle-developed** — Green Candle: developed · P2 · `PLANT` · upright bright foliage; identical root anchor, pot supplied separately
- [ ] **PLANT-green-candle-ready** — Green Candle: ready · P2 · `PLANT` · upright bright foliage; identical root anchor, pot supplied separately
- [ ] **GEN-green-candle-portrait** — Green Candle: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-green-candle-seed** — Green Candle: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-green-candle-clone** — Green Candle: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-goblin-mode-starter** — Goblin Mode: starter · P2 · `PLANT` · asymmetric crown; identical root anchor, pot supplied separately
- [ ] **PLANT-goblin-mode-young** — Goblin Mode: young · P2 · `PLANT` · asymmetric crown; identical root anchor, pot supplied separately
- [ ] **PLANT-goblin-mode-developed** — Goblin Mode: developed · P2 · `PLANT` · asymmetric crown; identical root anchor, pot supplied separately
- [ ] **PLANT-goblin-mode-ready** — Goblin Mode: ready · P2 · `PLANT` · asymmetric crown; identical root anchor, pot supplied separately
- [ ] **GEN-goblin-mode-portrait** — Goblin Mode: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-goblin-mode-seed** — Goblin Mode: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-goblin-mode-clone** — Goblin Mode: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-rent-money-starter** — Rent Money: starter · P2 · `PLANT` · muted green stocky form; identical root anchor, pot supplied separately
- [ ] **PLANT-rent-money-young** — Rent Money: young · P2 · `PLANT` · muted green stocky form; identical root anchor, pot supplied separately
- [ ] **PLANT-rent-money-developed** — Rent Money: developed · P2 · `PLANT` · muted green stocky form; identical root anchor, pot supplied separately
- [ ] **PLANT-rent-money-ready** — Rent Money: ready · P2 · `PLANT` · muted green stocky form; identical root anchor, pot supplied separately
- [ ] **GEN-rent-money-portrait** — Rent Money: collection portrait · P2 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-rent-money-seed** — Rent Money: seed packet illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-rent-money-clone** — Rent Money: clone tray illustration · P2 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-midnight-mint-starter** — Midnight Mint: starter · P3 · `PLANT` · blue green; identical root anchor, pot supplied separately
- [ ] **PLANT-midnight-mint-young** — Midnight Mint: young · P3 · `PLANT` · blue green; identical root anchor, pot supplied separately
- [ ] **PLANT-midnight-mint-developed** — Midnight Mint: developed · P3 · `PLANT` · blue green; identical root anchor, pot supplied separately
- [ ] **PLANT-midnight-mint-ready** — Midnight Mint: ready · P3 · `PLANT` · blue green; identical root anchor, pot supplied separately
- [ ] **GEN-midnight-mint-portrait** — Midnight Mint: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-midnight-mint-seed** — Midnight Mint: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-midnight-mint-clone** — Midnight Mint: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-velvet-static-starter** — Velvet Static: starter · P3 · `PLANT` · dark purple; identical root anchor, pot supplied separately
- [ ] **PLANT-velvet-static-young** — Velvet Static: young · P3 · `PLANT` · dark purple; identical root anchor, pot supplied separately
- [ ] **PLANT-velvet-static-developed** — Velvet Static: developed · P3 · `PLANT` · dark purple; identical root anchor, pot supplied separately
- [ ] **PLANT-velvet-static-ready** — Velvet Static: ready · P3 · `PLANT` · dark purple; identical root anchor, pot supplied separately
- [ ] **GEN-velvet-static-portrait** — Velvet Static: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-velvet-static-seed** — Velvet Static: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-velvet-static-clone** — Velvet Static: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-moonroof-starter** — Moonroof: starter · P3 · `PLANT` · tall open canopy; identical root anchor, pot supplied separately
- [ ] **PLANT-moonroof-young** — Moonroof: young · P3 · `PLANT` · tall open canopy; identical root anchor, pot supplied separately
- [ ] **PLANT-moonroof-developed** — Moonroof: developed · P3 · `PLANT` · tall open canopy; identical root anchor, pot supplied separately
- [ ] **PLANT-moonroof-ready** — Moonroof: ready · P3 · `PLANT` · tall open canopy; identical root anchor, pot supplied separately
- [ ] **GEN-moonroof-portrait** — Moonroof: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-moonroof-seed** — Moonroof: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-moonroof-clone** — Moonroof: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-trailer-royal-starter** — Trailer Royal: starter · P3 · `PLANT` · broad stocky; identical root anchor, pot supplied separately
- [ ] **PLANT-trailer-royal-young** — Trailer Royal: young · P3 · `PLANT` · broad stocky; identical root anchor, pot supplied separately
- [ ] **PLANT-trailer-royal-developed** — Trailer Royal: developed · P3 · `PLANT` · broad stocky; identical root anchor, pot supplied separately
- [ ] **PLANT-trailer-royal-ready** — Trailer Royal: ready · P3 · `PLANT` · broad stocky; identical root anchor, pot supplied separately
- [ ] **GEN-trailer-royal-portrait** — Trailer Royal: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-trailer-royal-seed** — Trailer Royal: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-trailer-royal-clone** — Trailer Royal: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-lemon-ledger-starter** — Lemon Ledger: starter · P3 · `PLANT` · yellow green; identical root anchor, pot supplied separately
- [ ] **PLANT-lemon-ledger-young** — Lemon Ledger: young · P3 · `PLANT` · yellow green; identical root anchor, pot supplied separately
- [ ] **PLANT-lemon-ledger-developed** — Lemon Ledger: developed · P3 · `PLANT` · yellow green; identical root anchor, pot supplied separately
- [ ] **PLANT-lemon-ledger-ready** — Lemon Ledger: ready · P3 · `PLANT` · yellow green; identical root anchor, pot supplied separately
- [ ] **GEN-lemon-ledger-portrait** — Lemon Ledger: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-lemon-ledger-seed** — Lemon Ledger: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-lemon-ledger-clone** — Lemon Ledger: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-purple-receipt-starter** — Purple Receipt: starter · P3 · `PLANT` · compact purple; identical root anchor, pot supplied separately
- [ ] **PLANT-purple-receipt-young** — Purple Receipt: young · P3 · `PLANT` · compact purple; identical root anchor, pot supplied separately
- [ ] **PLANT-purple-receipt-developed** — Purple Receipt: developed · P3 · `PLANT` · compact purple; identical root anchor, pot supplied separately
- [ ] **PLANT-purple-receipt-ready** — Purple Receipt: ready · P3 · `PLANT` · compact purple; identical root anchor, pot supplied separately
- [ ] **GEN-purple-receipt-portrait** — Purple Receipt: collection portrait · P3 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-purple-receipt-seed** — Purple Receipt: seed packet illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-purple-receipt-clone** — Purple Receipt: clone tray illustration · P3 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-after-hours-starter** — After Hours: starter · P4 · `PLANT` · deep violet; identical root anchor, pot supplied separately
- [ ] **PLANT-after-hours-young** — After Hours: young · P4 · `PLANT` · deep violet; identical root anchor, pot supplied separately
- [ ] **PLANT-after-hours-developed** — After Hours: developed · P4 · `PLANT` · deep violet; identical root anchor, pot supplied separately
- [ ] **PLANT-after-hours-ready** — After Hours: ready · P4 · `PLANT` · deep violet; identical root anchor, pot supplied separately
- [ ] **GEN-after-hours-portrait** — After Hours: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-after-hours-seed** — After Hours: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-after-hours-clone** — After Hours: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-last-call-starter** — Last Call: starter · P4 · `PLANT` · copper accents; identical root anchor, pot supplied separately
- [ ] **PLANT-last-call-young** — Last Call: young · P4 · `PLANT` · copper accents; identical root anchor, pot supplied separately
- [ ] **PLANT-last-call-developed** — Last Call: developed · P4 · `PLANT` · copper accents; identical root anchor, pot supplied separately
- [ ] **PLANT-last-call-ready** — Last Call: ready · P4 · `PLANT` · copper accents; identical root anchor, pot supplied separately
- [ ] **GEN-last-call-portrait** — Last Call: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-last-call-seed** — Last Call: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-last-call-clone** — Last Call: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-tax-write-off-starter** — Tax Write-Off: starter · P4 · `PLANT` · ragged but healthy; identical root anchor, pot supplied separately
- [ ] **PLANT-tax-write-off-young** — Tax Write-Off: young · P4 · `PLANT` · ragged but healthy; identical root anchor, pot supplied separately
- [ ] **PLANT-tax-write-off-developed** — Tax Write-Off: developed · P4 · `PLANT` · ragged but healthy; identical root anchor, pot supplied separately
- [ ] **PLANT-tax-write-off-ready** — Tax Write-Off: ready · P4 · `PLANT` · ragged but healthy; identical root anchor, pot supplied separately
- [ ] **GEN-tax-write-off-portrait** — Tax Write-Off: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-tax-write-off-seed** — Tax Write-Off: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-tax-write-off-clone** — Tax Write-Off: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-boardroom-reserve-starter** — Boardroom Reserve: starter · P4 · `PLANT` · balanced crown; identical root anchor, pot supplied separately
- [ ] **PLANT-boardroom-reserve-young** — Boardroom Reserve: young · P4 · `PLANT` · balanced crown; identical root anchor, pot supplied separately
- [ ] **PLANT-boardroom-reserve-developed** — Boardroom Reserve: developed · P4 · `PLANT` · balanced crown; identical root anchor, pot supplied separately
- [ ] **PLANT-boardroom-reserve-ready** — Boardroom Reserve: ready · P4 · `PLANT` · balanced crown; identical root anchor, pot supplied separately
- [ ] **GEN-boardroom-reserve-portrait** — Boardroom Reserve: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-boardroom-reserve-seed** — Boardroom Reserve: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-boardroom-reserve-clone** — Boardroom Reserve: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-founders-cut-starter** — Founder's Cut: starter · P4 · `PLANT` · silver green; identical root anchor, pot supplied separately
- [ ] **PLANT-founders-cut-young** — Founder's Cut: young · P4 · `PLANT` · silver green; identical root anchor, pot supplied separately
- [ ] **PLANT-founders-cut-developed** — Founder's Cut: developed · P4 · `PLANT` · silver green; identical root anchor, pot supplied separately
- [ ] **PLANT-founders-cut-ready** — Founder's Cut: ready · P4 · `PLANT` · silver green; identical root anchor, pot supplied separately
- [ ] **GEN-founders-cut-portrait** — Founder's Cut: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-founders-cut-seed** — Founder's Cut: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-founders-cut-clone** — Founder's Cut: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **PLANT-lunar-dividend-starter** — Lunar Dividend: starter · P4 · `PLANT` · cool frosted; identical root anchor, pot supplied separately
- [ ] **PLANT-lunar-dividend-young** — Lunar Dividend: young · P4 · `PLANT` · cool frosted; identical root anchor, pot supplied separately
- [ ] **PLANT-lunar-dividend-developed** — Lunar Dividend: developed · P4 · `PLANT` · cool frosted; identical root anchor, pot supplied separately
- [ ] **PLANT-lunar-dividend-ready** — Lunar Dividend: ready · P4 · `PLANT` · cool frosted; identical root anchor, pot supplied separately
- [ ] **GEN-lunar-dividend-portrait** — Lunar Dividend: collection portrait · P4 · `CARD` · Strain name typeset in code, not baked into image
- [ ] **GEN-lunar-dividend-seed** — Lunar Dividend: seed packet illustration · P4 · `ICON` · Strain name typeset in code, not baked into image
- [ ] **GEN-lunar-dividend-clone** — Lunar Dividend: clone tray illustration · P4 · `ICON` · Strain name typeset in code, not baked into image

## 05 — Pots and placement

- [ ] **POT-fabric-empty** — Fabric pot: empty · P0 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-fabric-soil-filled** — Fabric pot: soil-filled · P0 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-plastic-empty** — Starter plastic pot: empty · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-plastic-soil-filled** — Starter plastic pot: soil-filled · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-ceramic-empty** — Ceramic pot: empty · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-ceramic-soil-filled** — Ceramic pot: soil-filled · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-steel-empty** — Industrial planter: empty · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **POT-steel-soil-filled** — Industrial planter: soil-filled · P2 · `PROP` · Fixed floor anchor; must not scale with foliage
- [ ] **PLACE-pot-shadow** — Shared pot contact shadow · P0 · `PROP`
- [ ] **PLACE-slot** — Empty slot ground plate · P0 · `PROP`
- [ ] **PLACE-expanded** — Extra-slot platform · P0 · `PROP`
- [ ] **PLACE-socket** — Placement socket specification · P0 · `LAYOUT`

## 06 — Equipment

- [ ] **EQ-rack-t1-sprite** — Plant rack tier 1: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t1-icon** — Plant rack tier 1: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t2-sprite** — Plant rack tier 2: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t2-icon** — Plant rack tier 2: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t3-sprite** — Plant rack tier 3: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t3-icon** — Plant rack tier 3: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t4-sprite** — Plant rack tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t4-icon** — Plant rack tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t5-sprite** — Plant rack tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-t5-icon** — Plant rack tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-rack-shadow** — Plant rack: contact shadow · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-rack-occlusion** — Plant rack: occlusion mask · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-lamp-t1-sprite** — Lighting fixture tier 1: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t1-icon** — Lighting fixture tier 1: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t2-sprite** — Lighting fixture tier 2: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t2-icon** — Lighting fixture tier 2: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t3-sprite** — Lighting fixture tier 3: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t3-icon** — Lighting fixture tier 3: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t4-sprite** — Lighting fixture tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t4-icon** — Lighting fixture tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t5-sprite** — Lighting fixture tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-t5-icon** — Lighting fixture tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-lamp-shadow** — Lighting fixture: contact shadow · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-lamp-occlusion** — Lighting fixture: occlusion mask · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-climate-t1-sprite** — Climate cabinet tier 1: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t1-icon** — Climate cabinet tier 1: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t2-sprite** — Climate cabinet tier 2: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t2-icon** — Climate cabinet tier 2: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t3-sprite** — Climate cabinet tier 3: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t3-icon** — Climate cabinet tier 3: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t4-sprite** — Climate cabinet tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t4-icon** — Climate cabinet tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t5-sprite** — Climate cabinet tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-t5-icon** — Climate cabinet tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-climate-shadow** — Climate cabinet: contact shadow · P1 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-climate-occlusion** — Climate cabinet: occlusion mask · P1 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-bench-t1-sprite** — Workstation tier 1: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t1-icon** — Workstation tier 1: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t2-sprite** — Workstation tier 2: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t2-icon** — Workstation tier 2: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t3-sprite** — Workstation tier 3: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t3-icon** — Workstation tier 3: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t4-sprite** — Workstation tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t4-icon** — Workstation tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t5-sprite** — Workstation tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-t5-icon** — Workstation tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-bench-shadow** — Workstation: contact shadow · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-bench-occlusion** — Workstation: occlusion mask · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-packager-t1-sprite** — Packaging station tier 1: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t1-icon** — Packaging station tier 1: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t2-sprite** — Packaging station tier 2: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t2-icon** — Packaging station tier 2: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t3-sprite** — Packaging station tier 3: placed sprite · P1 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t3-icon** — Packaging station tier 3: catalog icon · P1 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t4-sprite** — Packaging station tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t4-icon** — Packaging station tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t5-sprite** — Packaging station tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-t5-icon** — Packaging station tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-packager-shadow** — Packaging station: contact shadow · P1 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-packager-occlusion** — Packaging station: occlusion mask · P1 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-studio-t1-sprite** — Product studio station tier 1: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t1-icon** — Product studio station tier 1: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t2-sprite** — Product studio station tier 2: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t2-icon** — Product studio station tier 2: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t3-sprite** — Product studio station tier 3: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t3-icon** — Product studio station tier 3: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t4-sprite** — Product studio station tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t4-icon** — Product studio station tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t5-sprite** — Product studio station tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-t5-icon** — Product studio station tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-studio-shadow** — Product studio station: contact shadow · P2 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-studio-occlusion** — Product studio station: occlusion mask · P2 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-storage-t1-sprite** — Storage shelves tier 1: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t1-icon** — Storage shelves tier 1: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t2-sprite** — Storage shelves tier 2: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t2-icon** — Storage shelves tier 2: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t3-sprite** — Storage shelves tier 3: placed sprite · P0 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t3-icon** — Storage shelves tier 3: catalog icon · P0 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t4-sprite** — Storage shelves tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t4-icon** — Storage shelves tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t5-sprite** — Storage shelves tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-t5-icon** — Storage shelves tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-storage-shadow** — Storage shelves: contact shadow · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-storage-occlusion** — Storage shelves: occlusion mask · P0 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-dispatch-t1-sprite** — Dispatch desk tier 1: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t1-icon** — Dispatch desk tier 1: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t2-sprite** — Dispatch desk tier 2: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t2-icon** — Dispatch desk tier 2: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t3-sprite** — Dispatch desk tier 3: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t3-icon** — Dispatch desk tier 3: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t4-sprite** — Dispatch desk tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t4-icon** — Dispatch desk tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t5-sprite** — Dispatch desk tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-t5-icon** — Dispatch desk tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-dispatch-shadow** — Dispatch desk: contact shadow · P2 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-dispatch-occlusion** — Dispatch desk: occlusion mask · P2 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-merch-t1-sprite** — Merch station tier 1: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t1-icon** — Merch station tier 1: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t2-sprite** — Merch station tier 2: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t2-icon** — Merch station tier 2: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t3-sprite** — Merch station tier 3: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t3-icon** — Merch station tier 3: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t4-sprite** — Merch station tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t4-icon** — Merch station tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t5-sprite** — Merch station tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-t5-icon** — Merch station tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-merch-shadow** — Merch station: contact shadow · P3 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-merch-occlusion** — Merch station: occlusion mask · P3 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-staff-t1-sprite** — Staff support station tier 1: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t1-icon** — Staff support station tier 1: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t2-sprite** — Staff support station tier 2: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t2-icon** — Staff support station tier 2: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t3-sprite** — Staff support station tier 3: placed sprite · P2 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t3-icon** — Staff support station tier 3: catalog icon · P2 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t4-sprite** — Staff support station tier 4: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t4-icon** — Staff support station tier 4: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t5-sprite** — Staff support station tier 5: placed sprite · P3 · `PROP` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-t5-icon** — Staff support station tier 5: catalog icon · P3 · `ICON` · Tiers share footprint; shadows separate or shared by declared recipe
- [ ] **EQ-staff-shadow** — Staff support station: contact shadow · P2 · `MASK` · Reuse only when silhouette / footprint permits
- [ ] **EQ-staff-occlusion** — Staff support station: occlusion mask · P2 · `MASK` · Reuse only when silhouette / footprint permits

## 07 — Products and packaging

- [ ] **PROD-harvest-icon** — Harvest stock: inventory icon · P0 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-harvest-display** — Harvest stock: station display prop · P0 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-standard-icon** — Standard flower jar: inventory icon · P0 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-standard-display** — Standard flower jar: station display prop · P0 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-premium-icon** — Premium flower jar: inventory icon · P1 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-premium-display** — Premium flower jar: station display prop · P1 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-reserve-icon** — Reserve flower jar: inventory icon · P1 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-jar-reserve-display** — Reserve flower jar: station display prop · P1 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-sampler-icon** — Small sampler: inventory icon · P1 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-sampler-display** — Small sampler: station display prop · P1 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-collection-icon** — Mixed collection: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-collection-display** — Mixed collection: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-gift-icon** — Gift box: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-gift-display** — Gift box: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-roll-standard-icon** — Standard rolled pack: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-roll-standard-display** — Standard rolled pack: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-roll-premium-icon** — Premium rolled pack: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-roll-premium-display** — Premium rolled pack: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-gummies-icon** — Gummy box: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-gummies-display** — Gummy box: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-chocolate-icon** — Chocolate box: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-chocolate-display** — Chocolate box: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-brownie-icon** — Brownie box: inventory icon · P3 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-brownie-display** — Brownie box: station display prop · P3 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-wax-icon** — Wax jar: inventory icon · P3 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-wax-display** — Wax jar: station display prop · P3 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-resin-icon** — Resin pack: inventory icon · P3 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-resin-display** — Resin pack: station display prop · P3 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-stickers-icon** — Sticker bundle: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-stickers-display** — Sticker bundle: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-tray-icon** — Branded tray: inventory icon · P2 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-tray-display** — Branded tray: station display prop · P2 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-apparel-icon** — Apparel box: inventory icon · P3 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-apparel-display** — Apparel box: station display prop · P3 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-packaging-icon** — Blank packaging supplies: inventory icon · P1 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-packaging-display** — Blank packaging supplies: station display prop · P1 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-crate-icon** — Shipping crate: inventory icon · P1 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-crate-display** — Shipping crate: station display prop · P1 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-parcel-icon** — Completed order parcel: inventory icon · P0 · `ICON` · No real manufacturing instructions; label overlaid from template
- [ ] **PROD-parcel-display** — Completed order parcel: station display prop · P0 · `SMALL-PROP` · No real manufacturing instructions; label overlaid from template
- [ ] **LABEL-plain** — Plain label template · P1 · `VECTOR` · Editable type; short and long business-name cases
- [ ] **LABEL-premium** — Premium label template · P1 · `VECTOR` · Editable type; short and long business-name cases
- [ ] **LABEL-reserve** — Reserve label template · P1 · `VECTOR` · Editable type; short and long business-name cases
- [ ] **LABEL-custom** — Player business label layout template · P1 · `VECTOR` · Editable type; short and long business-name cases

## 08 — Staff

- [ ] **CHAR-marcus-turnaround** — Marcus — grow assistant: identity reference sheet · P0 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-marcus-portrait-neutral** — Marcus — grow assistant: neutral portrait · P0 · `PORTRAIT`
- [ ] **CHAR-marcus-portrait-pleased** — Marcus — grow assistant: pleased portrait · P0 · `PORTRAIT`
- [ ] **CHAR-marcus-portrait-annoyed** — Marcus — grow assistant: annoyed portrait · P0 · `PORTRAIT`
- [ ] **CHAR-marcus-portrait-surprised** — Marcus — grow assistant: surprised portrait · P0 · `PORTRAIT`
- [ ] **CHAR-marcus-body** — Marcus — grow assistant: stationary room sprite · P0 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-marcus-idle-01** — Marcus — grow assistant: idle frame 01 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-idle-02** — Marcus — grow assistant: idle frame 02 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-idle-03** — Marcus — grow assistant: idle frame 03 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-idle-04** — Marcus — grow assistant: idle frame 04 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-01** — Marcus — grow assistant: work frame 01 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-02** — Marcus — grow assistant: work frame 02 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-03** — Marcus — grow assistant: work frame 03 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-04** — Marcus — grow assistant: work frame 04 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-05** — Marcus — grow assistant: work frame 05 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-marcus-work-06** — Marcus — grow assistant: work frame 06 · P0 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-denise-turnaround** — Denise — packaging lead: identity reference sheet · P1 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-denise-portrait-neutral** — Denise — packaging lead: neutral portrait · P1 · `PORTRAIT`
- [ ] **CHAR-denise-portrait-pleased** — Denise — packaging lead: pleased portrait · P1 · `PORTRAIT`
- [ ] **CHAR-denise-portrait-annoyed** — Denise — packaging lead: annoyed portrait · P1 · `PORTRAIT`
- [ ] **CHAR-denise-portrait-surprised** — Denise — packaging lead: surprised portrait · P1 · `PORTRAIT`
- [ ] **CHAR-denise-body** — Denise — packaging lead: stationary room sprite · P1 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-denise-idle-01** — Denise — packaging lead: idle frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-idle-02** — Denise — packaging lead: idle frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-idle-03** — Denise — packaging lead: idle frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-idle-04** — Denise — packaging lead: idle frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-01** — Denise — packaging lead: work frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-02** — Denise — packaging lead: work frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-03** — Denise — packaging lead: work frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-04** — Denise — packaging lead: work frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-05** — Denise — packaging lead: work frame 05 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-denise-work-06** — Denise — packaging lead: work frame 06 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-leon-turnaround** — Leon — maintenance: identity reference sheet · P1 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-leon-portrait-neutral** — Leon — maintenance: neutral portrait · P1 · `PORTRAIT`
- [ ] **CHAR-leon-portrait-pleased** — Leon — maintenance: pleased portrait · P1 · `PORTRAIT`
- [ ] **CHAR-leon-portrait-annoyed** — Leon — maintenance: annoyed portrait · P1 · `PORTRAIT`
- [ ] **CHAR-leon-portrait-surprised** — Leon — maintenance: surprised portrait · P1 · `PORTRAIT`
- [ ] **CHAR-leon-body** — Leon — maintenance: stationary room sprite · P1 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-leon-idle-01** — Leon — maintenance: idle frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-idle-02** — Leon — maintenance: idle frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-idle-03** — Leon — maintenance: idle frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-idle-04** — Leon — maintenance: idle frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-01** — Leon — maintenance: work frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-02** — Leon — maintenance: work frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-03** — Leon — maintenance: work frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-04** — Leon — maintenance: work frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-05** — Leon — maintenance: work frame 05 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-leon-work-06** — Leon — maintenance: work frame 06 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-bianca-turnaround** — Bianca — sales: identity reference sheet · P1 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-bianca-portrait-neutral** — Bianca — sales: neutral portrait · P1 · `PORTRAIT`
- [ ] **CHAR-bianca-portrait-pleased** — Bianca — sales: pleased portrait · P1 · `PORTRAIT`
- [ ] **CHAR-bianca-portrait-annoyed** — Bianca — sales: annoyed portrait · P1 · `PORTRAIT`
- [ ] **CHAR-bianca-portrait-surprised** — Bianca — sales: surprised portrait · P1 · `PORTRAIT`
- [ ] **CHAR-bianca-body** — Bianca — sales: stationary room sprite · P1 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-bianca-idle-01** — Bianca — sales: idle frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-idle-02** — Bianca — sales: idle frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-idle-03** — Bianca — sales: idle frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-idle-04** — Bianca — sales: idle frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-01** — Bianca — sales: work frame 01 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-02** — Bianca — sales: work frame 02 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-03** — Bianca — sales: work frame 03 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-04** — Bianca — sales: work frame 04 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-05** — Bianca — sales: work frame 05 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-bianca-work-06** — Bianca — sales: work frame 06 · P1 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-ray-turnaround** — Uncle Ray — dispatch: identity reference sheet · P2 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-ray-portrait-neutral** — Uncle Ray — dispatch: neutral portrait · P2 · `PORTRAIT`
- [ ] **CHAR-ray-portrait-pleased** — Uncle Ray — dispatch: pleased portrait · P2 · `PORTRAIT`
- [ ] **CHAR-ray-portrait-annoyed** — Uncle Ray — dispatch: annoyed portrait · P2 · `PORTRAIT`
- [ ] **CHAR-ray-portrait-surprised** — Uncle Ray — dispatch: surprised portrait · P2 · `PORTRAIT`
- [ ] **CHAR-ray-body** — Uncle Ray — dispatch: stationary room sprite · P2 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-ray-idle-01** — Uncle Ray — dispatch: idle frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-idle-02** — Uncle Ray — dispatch: idle frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-idle-03** — Uncle Ray — dispatch: idle frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-idle-04** — Uncle Ray — dispatch: idle frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-01** — Uncle Ray — dispatch: work frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-02** — Uncle Ray — dispatch: work frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-03** — Uncle Ray — dispatch: work frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-04** — Uncle Ray — dispatch: work frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-05** — Uncle Ray — dispatch: work frame 05 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-ray-work-06** — Uncle Ray — dispatch: work frame 06 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-jules-turnaround** — Jules — product specialist: identity reference sheet · P2 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-jules-portrait-neutral** — Jules — product specialist: neutral portrait · P2 · `PORTRAIT`
- [ ] **CHAR-jules-portrait-pleased** — Jules — product specialist: pleased portrait · P2 · `PORTRAIT`
- [ ] **CHAR-jules-portrait-annoyed** — Jules — product specialist: annoyed portrait · P2 · `PORTRAIT`
- [ ] **CHAR-jules-portrait-surprised** — Jules — product specialist: surprised portrait · P2 · `PORTRAIT`
- [ ] **CHAR-jules-body** — Jules — product specialist: stationary room sprite · P2 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-jules-idle-01** — Jules — product specialist: idle frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-idle-02** — Jules — product specialist: idle frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-idle-03** — Jules — product specialist: idle frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-idle-04** — Jules — product specialist: idle frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-01** — Jules — product specialist: work frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-02** — Jules — product specialist: work frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-03** — Jules — product specialist: work frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-04** — Jules — product specialist: work frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-05** — Jules — product specialist: work frame 05 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-jules-work-06** — Jules — product specialist: work frame 06 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-mo-turnaround** — Mo — warehouse manager: identity reference sheet · P2 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-mo-portrait-neutral** — Mo — warehouse manager: neutral portrait · P2 · `PORTRAIT`
- [ ] **CHAR-mo-portrait-pleased** — Mo — warehouse manager: pleased portrait · P2 · `PORTRAIT`
- [ ] **CHAR-mo-portrait-annoyed** — Mo — warehouse manager: annoyed portrait · P2 · `PORTRAIT`
- [ ] **CHAR-mo-portrait-surprised** — Mo — warehouse manager: surprised portrait · P2 · `PORTRAIT`
- [ ] **CHAR-mo-body** — Mo — warehouse manager: stationary room sprite · P2 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-mo-idle-01** — Mo — warehouse manager: idle frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-idle-02** — Mo — warehouse manager: idle frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-idle-03** — Mo — warehouse manager: idle frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-idle-04** — Mo — warehouse manager: idle frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-01** — Mo — warehouse manager: work frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-02** — Mo — warehouse manager: work frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-03** — Mo — warehouse manager: work frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-04** — Mo — warehouse manager: work frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-05** — Mo — warehouse manager: work frame 05 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-mo-work-06** — Mo — warehouse manager: work frame 06 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **CHAR-frankie-turnaround** — Frankie — bookkeeper: identity reference sheet · P2 · `REVIEW` · Face, proportions, clothing, side and back reference
- [ ] **CHAR-frankie-portrait-neutral** — Frankie — bookkeeper: neutral portrait · P2 · `PORTRAIT`
- [ ] **CHAR-frankie-portrait-pleased** — Frankie — bookkeeper: pleased portrait · P2 · `PORTRAIT`
- [ ] **CHAR-frankie-portrait-annoyed** — Frankie — bookkeeper: annoyed portrait · P2 · `PORTRAIT`
- [ ] **CHAR-frankie-portrait-surprised** — Frankie — bookkeeper: surprised portrait · P2 · `PORTRAIT`
- [ ] **CHAR-frankie-body** — Frankie — bookkeeper: stationary room sprite · P2 · `CHARACTER` · Keep heel anchor and scale consistent
- [ ] **ANIM-frankie-idle-01** — Frankie — bookkeeper: idle frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-idle-02** — Frankie — bookkeeper: idle frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-idle-03** — Frankie — bookkeeper: idle frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-idle-04** — Frankie — bookkeeper: idle frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-01** — Frankie — bookkeeper: work frame 01 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-02** — Frankie — bookkeeper: work frame 02 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-03** — Frankie — bookkeeper: work frame 03 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-04** — Frankie — bookkeeper: work frame 04 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-05** — Frankie — bookkeeper: work frame 05 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later
- [ ] **ANIM-frankie-work-06** — Frankie — bookkeeper: work frame 06 · P2 · `CHARACTER` · Each frame separate PNG; identical canvas/heel anchor; frame atlas derived later

## 09 — Later worker movement

- [ ] **WALK-marcus-ne-01** — Marcus — grow assistant: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-02** — Marcus — grow assistant: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-03** — Marcus — grow assistant: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-04** — Marcus — grow assistant: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-05** — Marcus — grow assistant: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-06** — Marcus — grow assistant: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-07** — Marcus — grow assistant: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-ne-08** — Marcus — grow assistant: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-01** — Marcus — grow assistant: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-02** — Marcus — grow assistant: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-03** — Marcus — grow assistant: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-04** — Marcus — grow assistant: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-05** — Marcus — grow assistant: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-06** — Marcus — grow assistant: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-07** — Marcus — grow assistant: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-se-08** — Marcus — grow assistant: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-01** — Marcus — grow assistant: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-02** — Marcus — grow assistant: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-03** — Marcus — grow assistant: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-04** — Marcus — grow assistant: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-05** — Marcus — grow assistant: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-06** — Marcus — grow assistant: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-07** — Marcus — grow assistant: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-sw-08** — Marcus — grow assistant: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-01** — Marcus — grow assistant: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-02** — Marcus — grow assistant: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-03** — Marcus — grow assistant: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-04** — Marcus — grow assistant: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-05** — Marcus — grow assistant: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-06** — Marcus — grow assistant: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-07** — Marcus — grow assistant: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-nw-08** — Marcus — grow assistant: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-marcus-routes** — Marcus — grow assistant: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-denise-ne-01** — Denise — packaging lead: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-02** — Denise — packaging lead: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-03** — Denise — packaging lead: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-04** — Denise — packaging lead: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-05** — Denise — packaging lead: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-06** — Denise — packaging lead: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-07** — Denise — packaging lead: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-ne-08** — Denise — packaging lead: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-01** — Denise — packaging lead: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-02** — Denise — packaging lead: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-03** — Denise — packaging lead: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-04** — Denise — packaging lead: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-05** — Denise — packaging lead: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-06** — Denise — packaging lead: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-07** — Denise — packaging lead: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-se-08** — Denise — packaging lead: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-01** — Denise — packaging lead: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-02** — Denise — packaging lead: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-03** — Denise — packaging lead: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-04** — Denise — packaging lead: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-05** — Denise — packaging lead: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-06** — Denise — packaging lead: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-07** — Denise — packaging lead: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-sw-08** — Denise — packaging lead: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-01** — Denise — packaging lead: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-02** — Denise — packaging lead: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-03** — Denise — packaging lead: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-04** — Denise — packaging lead: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-05** — Denise — packaging lead: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-06** — Denise — packaging lead: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-07** — Denise — packaging lead: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-nw-08** — Denise — packaging lead: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-denise-routes** — Denise — packaging lead: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-leon-ne-01** — Leon — maintenance: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-02** — Leon — maintenance: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-03** — Leon — maintenance: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-04** — Leon — maintenance: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-05** — Leon — maintenance: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-06** — Leon — maintenance: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-07** — Leon — maintenance: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-ne-08** — Leon — maintenance: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-01** — Leon — maintenance: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-02** — Leon — maintenance: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-03** — Leon — maintenance: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-04** — Leon — maintenance: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-05** — Leon — maintenance: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-06** — Leon — maintenance: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-07** — Leon — maintenance: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-se-08** — Leon — maintenance: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-01** — Leon — maintenance: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-02** — Leon — maintenance: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-03** — Leon — maintenance: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-04** — Leon — maintenance: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-05** — Leon — maintenance: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-06** — Leon — maintenance: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-07** — Leon — maintenance: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-sw-08** — Leon — maintenance: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-01** — Leon — maintenance: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-02** — Leon — maintenance: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-03** — Leon — maintenance: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-04** — Leon — maintenance: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-05** — Leon — maintenance: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-06** — Leon — maintenance: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-07** — Leon — maintenance: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-nw-08** — Leon — maintenance: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-leon-routes** — Leon — maintenance: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-bianca-ne-01** — Bianca — sales: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-02** — Bianca — sales: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-03** — Bianca — sales: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-04** — Bianca — sales: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-05** — Bianca — sales: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-06** — Bianca — sales: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-07** — Bianca — sales: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-ne-08** — Bianca — sales: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-01** — Bianca — sales: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-02** — Bianca — sales: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-03** — Bianca — sales: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-04** — Bianca — sales: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-05** — Bianca — sales: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-06** — Bianca — sales: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-07** — Bianca — sales: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-se-08** — Bianca — sales: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-01** — Bianca — sales: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-02** — Bianca — sales: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-03** — Bianca — sales: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-04** — Bianca — sales: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-05** — Bianca — sales: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-06** — Bianca — sales: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-07** — Bianca — sales: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-sw-08** — Bianca — sales: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-01** — Bianca — sales: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-02** — Bianca — sales: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-03** — Bianca — sales: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-04** — Bianca — sales: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-05** — Bianca — sales: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-06** — Bianca — sales: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-07** — Bianca — sales: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-nw-08** — Bianca — sales: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-bianca-routes** — Bianca — sales: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-ray-ne-01** — Uncle Ray — dispatch: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-02** — Uncle Ray — dispatch: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-03** — Uncle Ray — dispatch: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-04** — Uncle Ray — dispatch: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-05** — Uncle Ray — dispatch: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-06** — Uncle Ray — dispatch: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-07** — Uncle Ray — dispatch: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-ne-08** — Uncle Ray — dispatch: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-01** — Uncle Ray — dispatch: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-02** — Uncle Ray — dispatch: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-03** — Uncle Ray — dispatch: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-04** — Uncle Ray — dispatch: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-05** — Uncle Ray — dispatch: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-06** — Uncle Ray — dispatch: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-07** — Uncle Ray — dispatch: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-se-08** — Uncle Ray — dispatch: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-01** — Uncle Ray — dispatch: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-02** — Uncle Ray — dispatch: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-03** — Uncle Ray — dispatch: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-04** — Uncle Ray — dispatch: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-05** — Uncle Ray — dispatch: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-06** — Uncle Ray — dispatch: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-07** — Uncle Ray — dispatch: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-sw-08** — Uncle Ray — dispatch: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-01** — Uncle Ray — dispatch: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-02** — Uncle Ray — dispatch: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-03** — Uncle Ray — dispatch: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-04** — Uncle Ray — dispatch: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-05** — Uncle Ray — dispatch: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-06** — Uncle Ray — dispatch: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-07** — Uncle Ray — dispatch: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-nw-08** — Uncle Ray — dispatch: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-ray-routes** — Uncle Ray — dispatch: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-jules-ne-01** — Jules — product specialist: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-02** — Jules — product specialist: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-03** — Jules — product specialist: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-04** — Jules — product specialist: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-05** — Jules — product specialist: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-06** — Jules — product specialist: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-07** — Jules — product specialist: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-ne-08** — Jules — product specialist: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-01** — Jules — product specialist: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-02** — Jules — product specialist: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-03** — Jules — product specialist: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-04** — Jules — product specialist: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-05** — Jules — product specialist: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-06** — Jules — product specialist: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-07** — Jules — product specialist: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-se-08** — Jules — product specialist: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-01** — Jules — product specialist: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-02** — Jules — product specialist: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-03** — Jules — product specialist: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-04** — Jules — product specialist: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-05** — Jules — product specialist: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-06** — Jules — product specialist: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-07** — Jules — product specialist: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-sw-08** — Jules — product specialist: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-01** — Jules — product specialist: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-02** — Jules — product specialist: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-03** — Jules — product specialist: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-04** — Jules — product specialist: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-05** — Jules — product specialist: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-06** — Jules — product specialist: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-07** — Jules — product specialist: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-nw-08** — Jules — product specialist: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-jules-routes** — Jules — product specialist: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-mo-ne-01** — Mo — warehouse manager: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-02** — Mo — warehouse manager: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-03** — Mo — warehouse manager: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-04** — Mo — warehouse manager: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-05** — Mo — warehouse manager: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-06** — Mo — warehouse manager: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-07** — Mo — warehouse manager: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-ne-08** — Mo — warehouse manager: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-01** — Mo — warehouse manager: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-02** — Mo — warehouse manager: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-03** — Mo — warehouse manager: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-04** — Mo — warehouse manager: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-05** — Mo — warehouse manager: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-06** — Mo — warehouse manager: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-07** — Mo — warehouse manager: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-se-08** — Mo — warehouse manager: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-01** — Mo — warehouse manager: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-02** — Mo — warehouse manager: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-03** — Mo — warehouse manager: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-04** — Mo — warehouse manager: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-05** — Mo — warehouse manager: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-06** — Mo — warehouse manager: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-07** — Mo — warehouse manager: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-sw-08** — Mo — warehouse manager: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-01** — Mo — warehouse manager: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-02** — Mo — warehouse manager: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-03** — Mo — warehouse manager: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-04** — Mo — warehouse manager: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-05** — Mo — warehouse manager: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-06** — Mo — warehouse manager: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-07** — Mo — warehouse manager: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-nw-08** — Mo — warehouse manager: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-mo-routes** — Mo — warehouse manager: route and occlusion test sheet · P3 · `REVIEW`
- [ ] **WALK-frankie-ne-01** — Frankie — bookkeeper: walk ne frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-02** — Frankie — bookkeeper: walk ne frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-03** — Frankie — bookkeeper: walk ne frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-04** — Frankie — bookkeeper: walk ne frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-05** — Frankie — bookkeeper: walk ne frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-06** — Frankie — bookkeeper: walk ne frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-07** — Frankie — bookkeeper: walk ne frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-ne-08** — Frankie — bookkeeper: walk ne frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-01** — Frankie — bookkeeper: walk se frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-02** — Frankie — bookkeeper: walk se frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-03** — Frankie — bookkeeper: walk se frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-04** — Frankie — bookkeeper: walk se frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-05** — Frankie — bookkeeper: walk se frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-06** — Frankie — bookkeeper: walk se frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-07** — Frankie — bookkeeper: walk se frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-se-08** — Frankie — bookkeeper: walk se frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-01** — Frankie — bookkeeper: walk sw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-02** — Frankie — bookkeeper: walk sw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-03** — Frankie — bookkeeper: walk sw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-04** — Frankie — bookkeeper: walk sw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-05** — Frankie — bookkeeper: walk sw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-06** — Frankie — bookkeeper: walk sw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-07** — Frankie — bookkeeper: walk sw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-sw-08** — Frankie — bookkeeper: walk sw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-01** — Frankie — bookkeeper: walk nw frame 01 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-02** — Frankie — bookkeeper: walk nw frame 02 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-03** — Frankie — bookkeeper: walk nw frame 03 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-04** — Frankie — bookkeeper: walk nw frame 04 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-05** — Frankie — bookkeeper: walk nw frame 05 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-06** — Frankie — bookkeeper: walk nw frame 06 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-07** — Frankie — bookkeeper: walk nw frame 07 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-nw-08** — Frankie — bookkeeper: walk nw frame 08 · P3 · `CHARACTER` · Four directions × eight frames; do not mirror asymmetric outfits blindly
- [ ] **WALK-frankie-routes** — Frankie — bookkeeper: route and occlusion test sheet · P3 · `REVIEW`

## 10 — Buyers and player identity

- [ ] **BUYER-tony-neutral** — Tony — reliable dispensary: neutral · P0 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-tony-happy** — Tony — reliable dispensary: happy · P0 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-tony-disappointed** — Tony — reliable dispensary: disappointed · P0 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-bryce-neutral** — Bryce — boutique buyer: neutral · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-bryce-happy** — Bryce — boutique buyer: happy · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-bryce-disappointed** — Bryce — boutique buyer: disappointed · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-rick-neutral** — Rick — cousin’s shop: neutral · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-rick-happy** — Rick — cousin’s shop: happy · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-rick-disappointed** — Rick — cousin’s shop: disappointed · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-nia-neutral** — Nia — event organizer: neutral · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-nia-happy** — Nia — event organizer: happy · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-nia-disappointed** — Nia — event organizer: disappointed · P1 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-sal-neutral** — Sal — bargain retailer: neutral · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-sal-happy** — Sal — bargain retailer: happy · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-sal-disappointed** — Sal — bargain retailer: disappointed · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-vivian-neutral** — Vivian — luxury brand: neutral · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-vivian-happy** — Vivian — luxury brand: happy · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-vivian-disappointed** — Vivian — luxury brand: disappointed · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-otto-neutral** — Otto — wholesaler: neutral · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-otto-happy** — Otto — wholesaler: happy · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-otto-disappointed** — Otto — wholesaler: disappointed · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-elsie-neutral** — Elsie — enthusiast club: neutral · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-elsie-happy** — Elsie — enthusiast club: happy · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **BUYER-elsie-disappointed** — Elsie — enthusiast club: disappointed · P2 · `PORTRAIT` · New buyer names are proposed art labels
- [ ] **AVATAR-01** — Player avatar 01 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-02** — Player avatar 02 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-03** — Player avatar 03 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-04** — Player avatar 04 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-05** — Player avatar 05 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-06** — Player avatar 06 · P1 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-07** — Player avatar 07 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-08** — Player avatar 08 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-09** — Player avatar 09 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-10** — Player avatar 10 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-11** — Player avatar 11 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **AVATAR-12** — Player avatar 12 · P2 · `PORTRAIT` · Varied adult appearances; not full-body playable character
- [ ] **PROFILE-starter** — starter profile frame · P1 · `VECTOR`
- [ ] **PROFILE-collector** — collector profile frame · P1 · `VECTOR`
- [ ] **PROFILE-grower** — grower profile frame · P1 · `VECTOR`
- [ ] **PROFILE-crew-leader** — crew-leader profile frame · P1 · `VECTOR`

## 11 — Token shop cosmetics

- [ ] **SKIN-neon-lounge-room-surface-kit** — Neon grow lounge: room-surface-kit · P2 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-lamp-skin** — Neon grow lounge: lamp-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-rack-skin** — Neon grow lounge: rack-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-shelf-skin** — Neon grow lounge: shelf-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-jar-skin** — Neon grow lounge: jar-skin · P2 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-packaging-template** — Neon grow lounge: packaging-template · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-staff-outfit-body** — Neon grow lounge: staff-outfit-body · P2 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-staff-outfit-portrait** — Neon grow lounge: staff-outfit-portrait · P2 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-business-sign-frame** — Neon grow lounge: business-sign-frame · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-van-livery** — Neon grow lounge: van-livery · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-profile-frame** — Neon grow lounge: profile-frame · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-bundle-card** — Neon grow lounge: bundle-card · P2 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-room-surface-kit** — Black and gold: room-surface-kit · P2 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-lamp-skin** — Black and gold: lamp-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-rack-skin** — Black and gold: rack-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-shelf-skin** — Black and gold: shelf-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-jar-skin** — Black and gold: jar-skin · P2 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-packaging-template** — Black and gold: packaging-template · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-staff-outfit-body** — Black and gold: staff-outfit-body · P2 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-staff-outfit-portrait** — Black and gold: staff-outfit-portrait · P2 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-business-sign-frame** — Black and gold: business-sign-frame · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-van-livery** — Black and gold: van-livery · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-profile-frame** — Black and gold: profile-frame · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-black-gold-bundle-card** — Black and gold: bundle-card · P2 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-room-surface-kit** — Retro garage: room-surface-kit · P2 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-lamp-skin** — Retro garage: lamp-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-rack-skin** — Retro garage: rack-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-shelf-skin** — Retro garage: shelf-skin · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-jar-skin** — Retro garage: jar-skin · P2 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-packaging-template** — Retro garage: packaging-template · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-staff-outfit-body** — Retro garage: staff-outfit-body · P2 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-staff-outfit-portrait** — Retro garage: staff-outfit-portrait · P2 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-business-sign-frame** — Retro garage: business-sign-frame · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-van-livery** — Retro garage: van-livery · P2 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-profile-frame** — Retro garage: profile-frame · P2 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-retro-garage-bundle-card** — Retro garage: bundle-card · P2 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-room-surface-kit** — Botanical studio: room-surface-kit · P3 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-lamp-skin** — Botanical studio: lamp-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-rack-skin** — Botanical studio: rack-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-shelf-skin** — Botanical studio: shelf-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-jar-skin** — Botanical studio: jar-skin · P3 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-packaging-template** — Botanical studio: packaging-template · P3 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-staff-outfit-body** — Botanical studio: staff-outfit-body · P3 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-staff-outfit-portrait** — Botanical studio: staff-outfit-portrait · P3 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-business-sign-frame** — Botanical studio: business-sign-frame · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-van-livery** — Botanical studio: van-livery · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-profile-frame** — Botanical studio: profile-frame · P3 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-botanical-bundle-card** — Botanical studio: bundle-card · P3 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-room-surface-kit** — Industrial chrome: room-surface-kit · P3 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-lamp-skin** — Industrial chrome: lamp-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-rack-skin** — Industrial chrome: rack-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-shelf-skin** — Industrial chrome: shelf-skin · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-jar-skin** — Industrial chrome: jar-skin · P3 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-packaging-template** — Industrial chrome: packaging-template · P3 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-staff-outfit-body** — Industrial chrome: staff-outfit-body · P3 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-staff-outfit-portrait** — Industrial chrome: staff-outfit-portrait · P3 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-business-sign-frame** — Industrial chrome: business-sign-frame · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-van-livery** — Industrial chrome: van-livery · P3 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-profile-frame** — Industrial chrome: profile-frame · P3 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-industrial-bundle-card** — Industrial chrome: bundle-card · P3 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-room-surface-kit** — After-hours violet: room-surface-kit · P4 · `ENV-ALPHA` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-lamp-skin** — After-hours violet: lamp-skin · P4 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-rack-skin** — After-hours violet: rack-skin · P4 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-shelf-skin** — After-hours violet: shelf-skin · P4 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-jar-skin** — After-hours violet: jar-skin · P4 · `ICON` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-packaging-template** — After-hours violet: packaging-template · P4 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-staff-outfit-body** — After-hours violet: staff-outfit-body · P4 · `CHARACTER` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-staff-outfit-portrait** — After-hours violet: staff-outfit-portrait · P4 · `PORTRAIT` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-business-sign-frame** — After-hours violet: business-sign-frame · P4 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-van-livery** — After-hours violet: van-livery · P4 · `PROP` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-profile-frame** — After-hours violet: profile-frame · P4 · `VECTOR` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-after-hours-bundle-card** — After-hours violet: bundle-card · P4 · `CARD` · One garage-compatible set. Outfit targets Marcus only initially; other rooms/roles need separate fit tests
- [ ] **SKIN-neon-lounge-marcus-idle-01** — Neon grow lounge: Marcus idle outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-idle-02** — Neon grow lounge: Marcus idle outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-idle-03** — Neon grow lounge: Marcus idle outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-idle-04** — Neon grow lounge: Marcus idle outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-01** — Neon grow lounge: Marcus work outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-02** — Neon grow lounge: Marcus work outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-03** — Neon grow lounge: Marcus work outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-04** — Neon grow lounge: Marcus work outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-05** — Neon grow lounge: Marcus work outfit frame 05 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-neon-lounge-marcus-work-06** — Neon grow lounge: Marcus work outfit frame 06 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-idle-01** — Black and gold: Marcus idle outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-idle-02** — Black and gold: Marcus idle outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-idle-03** — Black and gold: Marcus idle outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-idle-04** — Black and gold: Marcus idle outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-01** — Black and gold: Marcus work outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-02** — Black and gold: Marcus work outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-03** — Black and gold: Marcus work outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-04** — Black and gold: Marcus work outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-05** — Black and gold: Marcus work outfit frame 05 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-black-gold-marcus-work-06** — Black and gold: Marcus work outfit frame 06 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-idle-01** — Retro garage: Marcus idle outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-idle-02** — Retro garage: Marcus idle outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-idle-03** — Retro garage: Marcus idle outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-idle-04** — Retro garage: Marcus idle outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-01** — Retro garage: Marcus work outfit frame 01 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-02** — Retro garage: Marcus work outfit frame 02 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-03** — Retro garage: Marcus work outfit frame 03 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-04** — Retro garage: Marcus work outfit frame 04 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-05** — Retro garage: Marcus work outfit frame 05 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-retro-garage-marcus-work-06** — Retro garage: Marcus work outfit frame 06 · P2 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-idle-01** — Botanical studio: Marcus idle outfit frame 01 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-idle-02** — Botanical studio: Marcus idle outfit frame 02 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-idle-03** — Botanical studio: Marcus idle outfit frame 03 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-idle-04** — Botanical studio: Marcus idle outfit frame 04 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-01** — Botanical studio: Marcus work outfit frame 01 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-02** — Botanical studio: Marcus work outfit frame 02 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-03** — Botanical studio: Marcus work outfit frame 03 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-04** — Botanical studio: Marcus work outfit frame 04 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-05** — Botanical studio: Marcus work outfit frame 05 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-botanical-marcus-work-06** — Botanical studio: Marcus work outfit frame 06 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-idle-01** — Industrial chrome: Marcus idle outfit frame 01 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-idle-02** — Industrial chrome: Marcus idle outfit frame 02 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-idle-03** — Industrial chrome: Marcus idle outfit frame 03 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-idle-04** — Industrial chrome: Marcus idle outfit frame 04 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-01** — Industrial chrome: Marcus work outfit frame 01 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-02** — Industrial chrome: Marcus work outfit frame 02 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-03** — Industrial chrome: Marcus work outfit frame 03 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-04** — Industrial chrome: Marcus work outfit frame 04 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-05** — Industrial chrome: Marcus work outfit frame 05 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-industrial-marcus-work-06** — Industrial chrome: Marcus work outfit frame 06 · P3 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-idle-01** — After-hours violet: Marcus idle outfit frame 01 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-idle-02** — After-hours violet: Marcus idle outfit frame 02 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-idle-03** — After-hours violet: Marcus idle outfit frame 03 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-idle-04** — After-hours violet: Marcus idle outfit frame 04 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-01** — After-hours violet: Marcus work outfit frame 01 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-02** — After-hours violet: Marcus work outfit frame 02 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-03** — After-hours violet: Marcus work outfit frame 03 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-04** — After-hours violet: Marcus work outfit frame 04 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-05** — After-hours violet: Marcus work outfit frame 05 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **SKIN-after-hours-marcus-work-06** — After-hours violet: Marcus work outfit frame 06 · P4 · `CHARACTER` · Same anchors as base Marcus; no walking compatibility assumed
- [ ] **CANOPY-violet-starter** — Violet canopy: starter visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-violet-young** — Violet canopy: young visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-violet-developed** — Violet canopy: developed visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-violet-ready** — Violet canopy: ready visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-silver-starter** — Silver canopy: starter visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-silver-young** — Silver canopy: young visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-silver-developed** — Silver canopy: developed visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-silver-ready** — Silver canopy: ready visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-autumn-starter** — Copper canopy: starter visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-autumn-young** — Copper canopy: young visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-autumn-developed** — Copper canopy: developed visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-autumn-ready** — Copper canopy: ready visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-emerald-starter** — Emerald canopy: starter visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-emerald-young** — Emerald canopy: young visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-emerald-developed** — Emerald canopy: developed visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor
- [ ] **CANOPY-emerald-ready** — Emerald canopy: ready visual variant · P2 · `PLANT` · Cosmetic foliage for Garage OG; preserve normal stats and root anchor

## 12 — Decor and collectibles

- [ ] **DECOR-01** — Founding grower plaque · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-02** — Glass leaf sculpture · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-03** — Golden jar trophy · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-04** — Tiny greenhouse model · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-05** — Vintage scale · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-06** — Neon leaf sign · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-07** — Holographic business plaque · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-08** — Wall skateboard · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-09** — Premium couch · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-10** — Arcade cabinet · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-11** — Record player · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-12** — Coffee station · P1 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-13** — Grower magazine stack · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-14** — Poster frame A · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-15** — Poster frame B · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-16** — Wall clock · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-17** — Metal business sign · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-18** — Display pedestal · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-19** — Delivery van · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-20** — Delivery scooter · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-21** — Desk plant · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-22** — Doormat · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-23** — Tool chest · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-24** — Trophy cabinet · P2 · `PROP` · Tier-neutral cosmetics; no gameplay stats baked into art
- [ ] **DECOR-01-icon** — Decor 01: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-02-icon** — Decor 02: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-03-icon** — Decor 03: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-04-icon** — Decor 04: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-05-icon** — Decor 05: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-06-icon** — Decor 06: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-07-icon** — Decor 07: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-08-icon** — Decor 08: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-09-icon** — Decor 09: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-10-icon** — Decor 10: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-11-icon** — Decor 11: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-12-icon** — Decor 12: inventory icon · P1 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-13-icon** — Decor 13: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-14-icon** — Decor 14: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-15-icon** — Decor 15: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-16-icon** — Decor 16: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-17-icon** — Decor 17: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-18-icon** — Decor 18: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-19-icon** — Decor 19: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-20-icon** — Decor 20: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-21-icon** — Decor 21: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-22-icon** — Decor 22: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-23-icon** — Decor 23: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review
- [ ] **DECOR-24-icon** — Decor 24: inventory icon · P2 · `ICON` · Derived crop permitted only after readability review

## 13 — Competition and crews

- [ ] **TROPHY-bronze** — bronze room trophy · P2 · `PROP`
- [ ] **TROPHY-silver** — silver room trophy · P2 · `PROP`
- [ ] **TROPHY-gold** — gold room trophy · P2 · `PROP`
- [ ] **TROPHY-champion** — champion room trophy · P2 · `PROP`
- [ ] **ACH-01** — First harvest achievement badge · P1 · `VECTOR`
- [ ] **ACH-02** — First sale achievement badge · P1 · `VECTOR`
- [ ] **ACH-03** — First employee achievement badge · P1 · `VECTOR`
- [ ] **ACH-04** — First expansion achievement badge · P1 · `VECTOR`
- [ ] **ACH-05** — Strain collector achievement badge · P2 · `VECTOR`
- [ ] **ACH-06** — Product maker achievement badge · P2 · `VECTOR`
- [ ] **ACH-07** — Master packager achievement badge · P2 · `VECTOR`
- [ ] **ACH-08** — Reliable supplier achievement badge · P2 · `VECTOR`
- [ ] **ACH-09** — Property owner achievement badge · P2 · `VECTOR`
- [ ] **ACH-10** — Crew contributor achievement badge · P2 · `VECTOR`
- [ ] **ACH-11** — Challenge winner achievement badge · P2 · `VECTOR`
- [ ] **ACH-12** — Season veteran achievement badge · P2 · `VECTOR`
- [ ] **SOCIAL-crew-emblem-base** — crew emblem base · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-crew-banner-template** — crew banner template · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-season-emblem** — season emblem · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-league-podium** — league podium · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-rank-medal-kit** — rank medal kit · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-reward-reveal-composition** — reward reveal composition · P2 · `DESIGN` · Typography and numbers rendered in code
- [ ] **SOCIAL-visit-reaction-kit** — visit reaction kit · P2 · `DESIGN` · Typography and numbers rendered in code

## 14 — UI visual system

- [ ] **UI-icon-room** — room icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-orders** — orders icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-build** — build icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-world** — world icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-profile** — profile icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-crop** — crop icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-seed** — seed icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-clone** — clone icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-plant-ready** — plant-ready icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-harvest** — harvest icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-inventory** — inventory icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-quality** — quality icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-time** — time icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-queue** — queue icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-cash** — cash icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-token** — token icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-xp** — xp icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-reputation** — reputation icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-staff** — staff icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-settings** — settings icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-sound-on** — sound-on icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-sound-off** — sound-off icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-notifications** — notifications icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-help** — help icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-close** — close icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-back** — back icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-next** — next icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-check** — check icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-warning** — warning icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-error** — error icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-lock** — lock icon · P0 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-unlock** — unlock icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-search** — search icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-filter** — filter icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-sort** — sort icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-favorite** — favorite icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-visit** — visit icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-friend** — friend icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-crew** — crew icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-league** — league icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-gift** — gift icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-shop** — shop icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-receipt** — receipt icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-deposit** — deposit icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-pending** — pending icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-complete** — complete icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-retry** — retry icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-copy** — copy icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-external** — external icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-info** — info icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-storage** — storage icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-production** — production icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-automation** — automation icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-pause** — pause icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-play** — play icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-placement** — placement icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-rotate** — rotate icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-expand** — expand icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-edit** — edit icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-icon-report** — report icon · P1 · `VECTOR` · Code/vector-native; consistent stroke and optical size
- [ ] **UI-component-primary-button** — primary-button component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-secondary-button** — secondary-button component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-danger-button** — danger-button component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-tab** — tab component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-bottom-sheet** — bottom-sheet component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-dialog** — dialog component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-tooltip** — tooltip component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-item-card** — item-card component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-contract-card** — contract-card component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-shop-card** — shop-card component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-progress-bar** — progress-bar component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-quality-stars** — quality-stars component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-currency-badge** — currency-badge component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-toast** — toast component state sheet · P0 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-skeleton** — skeleton component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-empty-state** — empty-state component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-error-state** — error-state component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-offline-state** — offline-state component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-confirmation** — confirmation component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-receipt** — receipt component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-form-field** — form-field component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-toggle** — toggle component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-quantity-stepper** — quantity-stepper component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-loading-indicator** — loading-indicator component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-rarity-frame** — rarity-frame component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG
- [ ] **UI-component-purchase-state-badges** — purchase-state-badges component state sheet · P1 · `DESIGN` · Specify normal, pressed, focused, disabled; hover desktop where relevant. Render in code, not flattened UI PNG

## 15 — Screen compositions

- [ ] **SCREEN-signin-mobile** — signin — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-signin-desktop** — signin — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-onboarding-mobile** — onboarding — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-onboarding-desktop** — onboarding — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-room-mobile** — room — mobile · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-room-desktop** — room — desktop · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-crop-sheet-mobile** — crop-sheet — mobile · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-crop-sheet-desktop** — crop-sheet — desktop · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-strain-collection-mobile** — strain-collection — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-strain-collection-desktop** — strain-collection — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-inventory-mobile** — inventory — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-inventory-desktop** — inventory — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-orders-mobile** — orders — mobile · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-orders-desktop** — orders — desktop · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-production-mobile** — production — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-production-desktop** — production — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-build-mobile** — build — mobile · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-build-desktop** — build — desktop · P0 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-staff-mobile** — staff — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-staff-desktop** — staff — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-property-map-mobile** — property-map — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-property-map-desktop** — property-map — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-shop-mobile** — shop — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-shop-desktop** — shop — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-item-preview-mobile** — item-preview — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-item-preview-desktop** — item-preview — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-balance-mobile** — balance — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-balance-desktop** — balance — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-deposit-status-mobile** — deposit-status — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-deposit-status-desktop** — deposit-status — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-purchase-receipt-mobile** — purchase-receipt — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-purchase-receipt-desktop** — purchase-receipt — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-profile-mobile** — profile — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-profile-desktop** — profile — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-room-visit-mobile** — room-visit — mobile · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-room-visit-desktop** — room-visit — desktop · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-crew-mobile** — crew — mobile · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-crew-desktop** — crew — desktop · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-league-mobile** — league — mobile · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-league-desktop** — league — desktop · P2 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-reward-claim-mobile** — reward-claim — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-reward-claim-desktop** — reward-claim — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-settings-mobile** — settings — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-settings-desktop** — settings — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-support-mobile** — support — mobile · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface
- [ ] **SCREEN-support-desktop** — support — desktop · P1 · `SCREEN` · Composition reference, not an asset pasted into the running interface

## 16 — Effects and ambient parts

- [ ] **FX-harvest-snip-01** — harvest-snip frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-harvest-snip-02** — harvest-snip frame / element 02 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-harvest-snip-03** — harvest-snip frame / element 03 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-harvest-snip-04** — harvest-snip frame / element 04 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-harvest-snip-05** — harvest-snip frame / element 05 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-harvest-snip-06** — harvest-snip frame / element 06 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-01** — jar-collect frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-02** — jar-collect frame / element 02 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-03** — jar-collect frame / element 03 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-04** — jar-collect frame / element 04 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-05** — jar-collect frame / element 05 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-jar-collect-06** — jar-collect frame / element 06 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-cash-feedback-01** — cash-feedback frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-01** — token-purchase frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-02** — token-purchase frame / element 02 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-03** — token-purchase frame / element 03 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-04** — token-purchase frame / element 04 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-05** — token-purchase frame / element 05 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-token-purchase-06** — token-purchase frame / element 06 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-01** — upgrade-place frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-02** — upgrade-place frame / element 02 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-03** — upgrade-place frame / element 03 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-04** — upgrade-place frame / element 04 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-05** — upgrade-place frame / element 05 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-upgrade-place-06** — upgrade-place frame / element 06 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-01** — level-up frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-02** — level-up frame / element 02 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-03** — level-up frame / element 03 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-04** — level-up frame / element 04 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-05** — level-up frame / element 05 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-06** — level-up frame / element 06 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-07** — level-up frame / element 07 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-level-up-08** — level-up frame / element 08 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-01** — order-complete frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-02** — order-complete frame / element 02 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-03** — order-complete frame / element 03 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-04** — order-complete frame / element 04 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-05** — order-complete frame / element 05 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-order-complete-06** — order-complete frame / element 06 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-01** — reward-reveal frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-02** — reward-reveal frame / element 02 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-03** — reward-reveal frame / element 03 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-04** — reward-reveal frame / element 04 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-05** — reward-reveal frame / element 05 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-06** — reward-reveal frame / element 06 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-07** — reward-reveal frame / element 07 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-reward-reveal-08** — reward-reveal frame / element 08 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-fan-blades-01** — fan-blades frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-light-glow-01** — light-glow frame / element 01 · P0 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-dust-particle-01** — dust-particle frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **FX-leaf-particle-01** — leaf-particle frame / element 01 · P1 · `FX` · Static source may drive code motion; no new sprite frames needed for transforms
- [ ] **AMBIENT-fan-housing** — fan-housing · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-light-cord** — light-cord · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-switch-indicator** — switch-indicator · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-window-reflection** — window-reflection · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-radio-indicator** — radio-indicator · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-packing-lid-open** — packing-lid-open · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base
- [ ] **AMBIENT-packing-lid-closed** — packing-lid-closed · P1 · `SMALL-PROP` · Separate only if animated; static detail can remain in room base

## 17 — Event packs

- [ ] **EVENT-local-festival-key-art** — local-festival: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-local-festival-icon** — local-festival: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-local-festival-room-prop** — local-festival: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-packaging-week-key-art** — packaging-week: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-packaging-week-icon** — packaging-week: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-packaging-week-room-prop** — packaging-week: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-celebrity-order-key-art** — celebrity-order: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-celebrity-order-icon** — celebrity-order: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-celebrity-order-room-prop** — celebrity-order: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-supplier-sale-key-art** — supplier-sale: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-supplier-sale-icon** — supplier-sale: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-supplier-sale-room-prop** — supplier-sale: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-inspection-comedy-key-art** — inspection-comedy: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-inspection-comedy-icon** — inspection-comedy: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-inspection-comedy-room-prop** — inspection-comedy: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-worker-mishap-key-art** — worker-mishap: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-worker-mishap-icon** — worker-mishap: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-worker-mishap-room-prop** — worker-mishap: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-room-design-contest-key-art** — room-design-contest: key-art · P4 · `CARD` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-room-design-contest-icon** — room-design-contest: icon · P4 · `ICON` · Reusable event UI; no baked countdowns or price copy
- [ ] **EVENT-room-design-contest-room-prop** — room-design-contest: room-prop · P4 · `PROP` · Reusable event UI; no baked countdowns or price copy

## 18 — Branding and launch

- [ ] **BRAND-wordmark-horizontal** — wordmark-horizontal · P0 · `VECTOR` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-wordmark-stacked** — wordmark-stacked · P1 · `VECTOR` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-app-icon** — app-icon · P0 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-favicon** — favicon · P1 · `VECTOR` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-loading-art** — loading-art · P0 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-social-landscape** — social-landscape · P1 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-social-square** — social-square · P1 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-social-portrait** — social-portrait · P1 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-screenshot-frame-template** — screenshot-frame-template · P1 · `MARKETING` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-founder-badge** — founder-badge · P1 · `VECTOR` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation
- [ ] **BRAND-token-emblem** — token-emblem · P1 · `VECTOR` · High Stakes working name; ticker/mint not supplied; no official Solana/Pump.fun logo imitation

## 19 — Companion audio scope

- [ ] **AUDIO-ui-tap** — ui-tap · P0 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-ui-back** — ui-back · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-plant-start** — plant-start · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-harvest** — harvest · P0 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-jar-collect** — jar-collect · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-order-complete** — order-complete · P0 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-cash-reward** — cash-reward · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-purchase-complete** — purchase-complete · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-upgrade-install** — upgrade-install · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-level-up** — level-up · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-room-ambience** — room-ambience · P0 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-machine-loop** — machine-loop · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-notification** — notification · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten
- [ ] **AUDIO-error** — error · P1 · `AUDIO` · Separate audio workstream; included so audiovisual scope is not forgotten

## 20 — Integration and acceptance

- [ ] **QA-asset-manifest** — asset-manifest · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-atlas-packing** — atlas-packing · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-pivot-metadata** — pivot-metadata · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-layer-order** — layer-order · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-hit-shapes** — hit-shapes · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-plant-stage-contact-sheet** — plant-stage-contact-sheet · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-character-loop-contact-sheet** — character-loop-contact-sheet · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-mobile-crop-validation** — mobile-crop-validation · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-alpha-edge-validation** — alpha-edge-validation · P0 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-purchase-preview-parity** — purchase-preview-parity · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-reduced-motion-validation** — reduced-motion-validation · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-color-contrast-validation** — color-contrast-validation · P1 · `REVIEW` · Review deliverable, not a decorative image
- [ ] **QA-source-license-register** — source-license-register · P1 · `REVIEW` · Review deliverable, not a decorative image

## First production batch — do this before generating hundreds of assets

1. Approve AD-style, AD-camera, AD-scale, AD-anchor, and AD-plant together.
2. Produce and integrate ENV-garage-base plus its foreground, mask, lighting and layout pack.
3. Create POT-fabric-soil-filled and the four PLANT-garage-og stages. Verify the pot stays fixed and the plant touches the soil.
4. Create the first rack, lamp, bench and storage sprites at tier 1; validate camera/lighting at their real screen positions.
5. Add the Marcus base body plus idle/work loops at one station, with no walking requirement yet.
6. Integrate harvest/collection feedback and the core Room/Crop/Order/Build UI components.
7. Run the actual room on narrow portrait and desktop layouts before approving further strain and equipment batches.
8. Only then expand to the first six strains, workshop, packaging and shop preview pipeline.

This is a dependency order, not the entire P0 scope. Never mark an entire pack approved from a collage or mockup.

## Per-asset acceptance checklist

- [ ] Exact approved canvas, alpha mode, framing and filename.
- [ ] Perspective, material realism and light direction match the room reference.
- [ ] Root/heel/ground contact anchor remains fixed across related frames.
- [ ] Clean silhouette; no leftover background, halo, green fringe, floating prop or cropped extremity.
- [ ] Shadow can be layered correctly; no doubled shadow when equipped.
- [ ] Plant is distinct and readable at actual phone size.
- [ ] Animation loop stays registered and has no face, hand, clothing or object drift.
- [ ] Transparent borders and atlas padding avoid edge bleed.
- [ ] UI words, currency, timer and business labels remain editable/localizable.
- [ ] Product and shop preview agree with the delivered/equipped item.
- [ ] Hit shapes do not rely on transparent image rectangle bounds.
- [ ] Reduced motion and audio-off modes preserve all gameplay information.
- [ ] Runtime image sizes, download cost and memory use have been checked in context.
- [ ] Source provenance and usage rights are recorded.
- [ ] Asset ID, revision, owner, dependencies and approval recorded.

## Out of scope unless deliberately added

Full 3D models/rigs; freely rotating camera; unique player-body avatars; eight-direction walks; cinematic cutscenes; voiced dialogue; every possible outfit/action combination; unique redecoration of every ancillary room per property; NFT mint art; random paid loot-box reveals; real-token prize promotion; player trading-market art. These are not hidden inside the counts above.

The badge/league art supports cosmetic rewards. It does not assume cash or token prizes. No wallet-connect modal artwork is needed for the chosen account-based experience. Funding and receipt UI still need the listed states. Token name/emblem stays a placeholder until approved.

## Ready-for-production definition

A release pack is complete when every required dependency is present, assets are integrated into a playable build, mobile framing and animation are reviewed, and the pack has reproducible exports with source masters. A completed generation request alone is not a completed game asset.

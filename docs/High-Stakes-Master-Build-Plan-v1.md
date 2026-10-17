# HIGH STAKES — Master Game & Build Plan

Version 1.0 · October 17, 2026 · Working name; token name and ticker unconfirmed

## 1. Product definition and decision status

A persistent, adult-themed cannabis business tycoon for phones and desktop browsers. Players start with a small garage, grow fictional crops, manufacture products, complete character-driven orders, decorate properties, hire staff, and build a recognizable business. The atmosphere is grounded and realistic; the humor comes from people, dialogue, bad business decisions, and absurd brand names.

The core promise: **build an operation worth showing off, with a satisfying reason to return every day.**

Confirmed direction from the owner:

- Realistic-looking 2.5D layered artwork, fixed angled camera, no dependency on a large 3D modeling pipeline.
- Simple, addictive, funny gameplay with a long-term empire to build.
- A real crypto token is part of purchasing; players spend token balances.
- No external wallet connection flow.
- A substantial game plan covering players, strains, products, rooms, progression, and implementation.

Proposed defaults in this plan, not final approvals:

- Email/social login; an internal account balance; a verified external funding adapter selected later.
- Earned game cash plus a separate purchased token balance.
- Harvests pay game cash, not withdrawable tokens.
- Personal businesses, room visits, cooperative crews, and seasonal competition.
- No player-to-player token transfers, cash-out, staking, or token prize pools at initial launch.
- A controlled set of placement sockets rather than unrestricted furniture placement.

Unresolved token identity, payment support, custody model, and withdrawal policy are launch dependencies. This document is a design and engineering proposal, not a commitment that an unspecified provider supports the eventual coin.

## 2. What makes the game work

Five pillars:

1. **Easy actions:** tap plant, collect harvest, fill order, buy upgrade.
2. **Visible success:** equipment, packaging, rooms, and staff improve in front of you.
3. **Meaningful choices:** fast stock versus premium orders; more capacity versus automation.
4. **Funny recurring people:** buyers and workers become recognizable characters.
5. **Fair return visits:** offline progress, no missed-day crop deaths, no constant babysitting.

Avoid turning the experience into a cultivation manual or complicated industrial spreadsheet. Growth and production use fictional game timers and abstract stats. No realistic growing recipes or extraction instructions are needed.

## 3. Core loop and session design

**Choose crop → grow → harvest → allocate stock → sell or manufacture → earn → improve → unlock.**

Every screen should make the next useful action obvious. The room is home; most management happens in a bottom sheet over it.

| Session length | Player accomplishment |
|---|---|
| 30 seconds | Collect ready output and claim a completed order |
| 3–5 minutes | Replant, choose contracts, start production, buy one improvement |
| 10–15 minutes | Rearrange sockets, plan stock, complete a story beat, visit a friend |
| Longer optional session | Work on collections, room style, crew goals, or a production challenge |

Do not require long active sessions for normal progression. Use optional planning and collecting to occupy engaged players; avoid mandatory repetitive tapping.

### First 15 minutes

1. Enter a furnished garage with two nearly ready crops and one vacant socket.
2. A short character exchange explains your goal: fulfill your first buyer order.
3. Harvest once, with immediate inventory feedback.
4. Accept and fulfill one guaranteed starter order.
5. Plant one starter, previewing its duration and output before purchase.
6. Buy an affordable improvement and watch it appear.
7. Introduce a second buyer with a different demand.
8. End with one clear return target and saved progress.

Starter orders and upgrades must be tuned together so players cannot run out of cash during onboarding. Give one nontransferable recovery starter if necessary; no paid purchase should be needed to escape a soft lock.

## 4. Currency and token design

Use three distinct values with different jobs:

| Value | Earned or funded | Spent on | Convertible? |
|---|---|---|---|
| Game cash | NPC orders, milestones, gameplay events | Starters, equipment, production, staff, property access | No conversion to crypto |
| Token balance | Verified funding flow for the actual project token | Listed shop items, room themes, optional convenience and selected equipment | Withdrawal policy unresolved; do not assume availability |
| Reputation / XP | Progression and completed challenges | Unlock gates and ranking eligibility | Not spendable or transferable |

The HUD shows game cash by default and a separate token badge. The shop always identifies which balance it charges. Never label game cash as the token or imply that jars have a redeemable token value.

### Token utility that belongs in the game

- Permanent room skins, furniture sets, packaging themes, character clothing, signage.
- Direct equipment purchases after the same reputation unlock used for game-cash purchases.
- Optional production queue slots and convenience features with defined limits.
- Extra cosmetic property themes and seasonal cosmetic tracks.
- A collectible brand identity: labels, profile borders, room plaques, delivery van skins.

Token purchases can buy useful things, as requested. They should not replace every earned goal. A token-bought equipment instance uses the same stats as its game-cash equivalent; do not silently sell superior versions.

For the first real-money/token release, activate a narrow catalog of deterministic cosmetic purchases first. Add convenience and progression purchases only after telemetry and economy testing. Avoid paid randomized rewards in the proposed launch scope.

### Pricing rule

Keep game-cash prices independent of token-market volatility. For token checkout, show the exact token quantity, any applicable fee, item contents, and quote expiry before confirmation. Choose either fixed token-denominated catalog prices or a verified reference-price quote system before production; do not mix them accidentally. A reference-price route requires a dependable market source and a no-quote fallback for thin or unavailable liquidity. No token prices are fixed in this plan because the coin is not identified.

No automatic token minting for harvests, no promised returns, no automatic buybacks, and no assumed burn mechanic. A treasury purchase is not an on-chain burn unless an actual burn is executed and verified.

## 5. Accounts and balances without wallet connections

### Normal player experience

1. Sign in with email code or a selected social provider.
2. Receive an account and free starter operation.
3. Open Balance to view available tokens, pending funding, and purchase history.
4. Fund through the supported route; a transfer can be initiated outside the game without connecting that wallet to the game.
5. Wait for verification; pending funds are clearly marked and cannot be spent.
6. Purchase an item using an atomic server transaction.
7. Receive the item and a receipt; token balance updates immediately.

The game cannot discover and spend an arbitrary external wallet's balance just from an email address or typed address. A funding transfer, approved provider authorization, or another explicitly designed ownership/authorization mechanism is needed. No external-wallet connection is required by the proposed UI, but actual token movement still needs authorization somewhere.

### Funding options to evaluate

| Option | Advantage | Dependency / drawback |
|---|---|---|
| Provider handles supported token deposits and custody | Less direct key handling in the game | Must actually support the exact chain, asset, audience, and business |
| Project-operated deposit infrastructure | More control over custom token support | Key custody, monitoring, treasury operations, reconciliation, recovery responsibilities |
| Provider sells nonwithdrawable game credits | Familiar payments UX | Credits are not automatically the real project token; requires an explicit product decision |

Preferred direction is a supported custody/payment partner if one meets the requirements. No provider has been selected. A generic USDC checkout is not proof that it accepts this custom coin.

### Required balance states

Pending, available, reserved, spent, reversed, and held for review. A displayed number must be backed by ledger entries rather than an editable profile field.

If balances are redeemable token claims, reconcile liabilities by asset against controlled/provider-reported assets. If deposits instead purchase nonredeemable credits, label that explicitly and maintain a different ledger model. Decide this before real funding; do not describe the two models interchangeably.

### Withdrawals

The proposed first release does not expose withdrawals. That is a proposed scope choice, not a settled user requirement. If token custody is selected, determine redemption, closures, recovery, and refund handling before taking deposits. If withdrawals are required, add address verification, stronger authentication, limits, review, signing controls, and settlement reconciliation as a separate build track.

## 6. Progression and rooms

Numbers below are initial balancing hypotheses, not production promises. Slot caps prevent art and mobile performance from growing without limits. Larger businesses can span several scenes.

| Tier | Property | Suggested level | Plant slots | New play |
|---|---|---:|---:|---|
| 1 | Garage | 1–5 | 4 → 8 | Crops, first orders, simple improvements |
| 2 | Converted workshop | 6–12 | 8 → 12 | Packaging, first employee, branding |
| 3 | Rural barn | 13–20 | 12 → 18 | Multiple batches, staff assignments, wholesale buyers |
| 4 | Commercial warehouse | 21–30 | 18 → 24 per scene | Dedicated production rooms and larger contracts |
| 5 | Flagship facility | 31–40 | Multiple capped scenes | Specialist staff, crew contracts, advanced collections |
| 6 | Prestige estate | 41+ | Premium presentation, bounded capacity | Endgame cosmetics, legacy milestones, seasonal goals |

Opening a property requires a reputation milestone, game cash, and a short introductory contract. Token purchases can fund eligible items but should not bypass tutorial or content dependencies. Older properties remain useful; optional staff management reduces repeat visits. No forced prestige reset that deletes purchases.

### Room types inside later properties

Grow room, nursery/collection room, packaging room, fictional product studio, storage/dispatch, office, staff lounge, showroom. Each has a purpose; do not launch eight rooms that are merely reskinned menus.

Use fixed equipment sockets, decoration sockets, and a few furniture footprints. Show a placement preview with valid positions. Occlusion masks keep plants correctly behind foreground furniture.

## 7. Strain roster

Strains differ through fictional growth duration, output, abstract quality potential, buyer demand, and appearance. Real plant category names are flavor, not medical effects. Each needs a unique silhouette/color identity; avoid 24 recolors masquerading as unique content.

Initial roster of 24, delivered in waves:

| Wave | Strain | Gameplay identity | Visual identity |
|---|---|---|---|
| Alpha | Garage OG | Balanced tutorial crop | Broad green silhouette |
| Alpha | Paper Hands | Quick small batches | Compact lime foliage |
| Alpha | Diamond Bud | Slow premium crop | Dense cool highlights |
| Alpha | Couchlock Classic | Dependable bulk stock | Broad dark leaves |
| Alpha | Exit Liquidity | Popular contract crop | Purple-tipped crown |
| Alpha | Gas Station Gelato | Flexible product ingredient | Pale violet accents |
| Beta | Margin Call | Short timed-order specialist | Narrow jagged silhouette |
| Beta | Whale Breath | Large batches, more storage needed | Wide heavy crown |
| Beta | Candle Wick | Compact room efficiency | Tall slender crown |
| Beta | Green Candle | Steady buyer demand | Bright upright foliage |
| Beta | Goblin Mode | Event-order favorite | Crooked asymmetric form |
| Beta | Rent Money | Reliable low-tier income | Simple muted green |
| Expansion | Midnight Mint | Boutique brand specialist | Blue-green tones |
| Expansion | Velvet Static | Premium packaging orders | Dark purple foliage |
| Expansion | Moonroof | Long offline batch | Tall open canopy |
| Expansion | Trailer Royal | Affordable high-volume crop | Stocky broad plant |
| Expansion | Lemon Ledger | Multiple product recipes | Yellow-green accents |
| Expansion | Purple Receipt | Repeat-customer specialist | Purple compact crown |
| Season | After Hours | Seasonal contracts | Deep violet outline |
| Season | Last Call | Short event challenges | Copper accent leaves |
| Season | Tax Write-Off | Humor collection milestone | Ragged-looking but healthy |
| Season | Boardroom Reserve | Prestige buyer orders | Carefully balanced crown |
| Season | Founder’s Cut | Collection achievement | Distinct silver-green palette |
| Season | Lunar Dividend | Endgame trophy strain | Cool frosted appearance |

No actual profit, yield, or medical claim is implied by these names. Each catalog record specifies game-only values. New paid strains must not become mandatory to fulfill the ordinary order pool.

### Growth art and stats

Four distinct plant-stage assets: starter, young, developed, ready. The pot stays the same size and position; foliage changes. The current prototype scales a mature plant image and does not yet satisfy this production requirement.

Player-visible stats: duration, jars per harvest, quality tier, favored buyers. Avoid hidden frustration mechanics. Healthy crops wait for collection; they do not rot because a player missed a notification.

Suggested post-tutorial duration bands: 15–30 minutes for quick batches, 1–3 hours for standard, 6–8 hours for long batches. Validate against player sessions; the prototype's 90 seconds is a demo value.

## 8. Products and manufacturing

All recipes below are abstract inventory conversions, never real preparation instructions. Every conversion previews inputs, time, output, and order demand.

| Family | Products | Station | Role |
|---|---|---|---|
| Raw inventory | Harvest units | Grow slot | Internal ingredient; no token redemption |
| Packaged flower | Standard jar, premium jar, reserve jar | Packaging bench | Core order loop |
| Branded packs | Small sampler, mixed collection, gift box | Branding station | Collections and mixed inventory use |
| Rolled products | Standard pack, premium pack | Fictional packing station | Midgame order variety |
| Edible products | Gummy box, chocolate box, brownie box | Fictional product studio | Longer production queues |
| Concentrate category | Wax jar, resin pack | Fictional processing station | Advanced game recipes only |
| Accessories | Sticker bundle, branded tray, apparel box | Merch station | Side-business and cosmetic identity |

Launch with three flower tiers and one sampler, not every product family. Product quality inherits a simple recipe rule visible to the player. Use batch inventory records so quality and strain identity persist through production. Avoid creating a separate inventory slot for every label color.

A prototype recipe may be `4 harvest units + 1 game packaging unit → 4 standard jars`. Final economics must be simulated. Display an exact recipe version on queued jobs so a balance update cannot change an already committed batch.

## 9. Equipment and automation

Equipment families: plant racks, abstract lighting tiers, climate module, workbench, packaging station, production station, storage shelving, dispatch desk, decor, staff support.

Every tier must have a visible asset difference and one clear benefit: extra slots, better game quality, more output, more queue capacity, or less routine tapping. Prefer additive, capped improvements over multiplying bonuses without limits.

Three equipment tiers at first; five eventually. No equipment damage that destroys purchased goods. Maintenance is an optional small event or game-cash expense, never a surprise token debit.

Automation unlock sequence: collect output → replant saved crop plan → refill production queues → auto-fulfill approved NPC orders. Automation only spends game cash within a player-set budget. It never spends purchased tokens or accepts new token purchases without explicit confirmation.

Offline simulation computes bounded outcomes from timestamps and capacity. Full storage pauses collection without deleting stock. Staff can run configured cycles up to a clear offline allowance; do not simulate unlimited output indefinitely.

## 10. Characters and staffing

| Character | Function | Comic trait |
|---|---|---|
| Marcus | First grow assistant | Competent, permanently on a coffee break |
| Denise | Packaging lead | Treats labels like a luxury fashion launch |
| Leon | Maintenance | Every fix starts with “who installed this?” |
| Bianca | Sales manager | Converts every setback into a brand opportunity |
| Uncle Ray | Logistics | Knows a shortcut; always takes longer |
| Jules | Product specialist | Elaborate opinions about jar lids |
| Mo | Warehouse manager | Clipboard tyrant with a soft spot for bad staff |
| Frankie | Bookkeeper | Your business is profitable until he explains the bills |

Staff have one main role, one perk, a small level track, and a cosmetic portrait. Workers are roster items, not tradable financial assets. Salaries use game cash, with clear pause rules if the budget runs out. Never let wages produce negative token balances.

For layered art, launch with workstation idle/work frame swaps. Walking workers need route-specific sprite directions and occlusion testing; they are a later visual milestone, not a free effect obtained from a single PNG.

## 11. Buyers, orders, and humor

Eight recurring NPC buyer archetypes: reliable dispensary owner, boutique buyer, event organizer, bargain retailer, luxury brand, wholesaler, enthusiast club, and your unreliable cousin's shop.

Order formats: quick sale, scheduled delivery, premium-quality request, mixed sampler, production contract, community event supply, and character story chain.

Offer at most three recommended orders at once. Each displays requirements, stock allocation, reward, deadline, and consequence before acceptance. Reserve inventory for accepted contracts to prevent accidental double selling. The order generator must respect unlocked content and guarantee feasible starter offers.

Failed timed contracts lose a modest opportunity or temporary buyer goodwill; they do not seize token-funded assets. Never use a misleading countdown that resets to pressure spending.

Write dialogue in short bursts with personality. Adult language is selectable; avoid making every character say the same crypto joke. Start with roughly 120 reusable lines across buyers, staff, tutorial, milestones, and events; track localization keys from the outset.

## 12. Player identity, social play, and competition

Each player has a business name, avatar, public showroom, profile plaque, collection summary, and progression level. Display names are distinct from immutable account IDs. Account IDs never change when a business is renamed.

### Social sequence

1. Read-only room visits and preset reactions.
2. Friends and optional private crews.
3. Cooperative NPC contracts with individual contribution records.
4. Moderated text features only when support capacity exists.
5. A marketplace only after a separate economic and fraud design.

Visitors cannot move objects, collect crops, or steal items. An offline player's room is a server-built snapshot, not a copy of their private save or payment information.

### Competition

Separate lifetime business value from skill-oriented weekly challenges. Token-purchased capacity can affect business value; label it as an open progression board. For an earned competition, provide a separate challenge room with equal starting resources and no purchased boosts. Merely calling a score “earned” does not remove the advantage of purchased production capacity.

Initial rewards: badges, plaques, decorations, titles. No token-funded entry pools or cash-equivalent competitive payouts in this proposal. League scoring is server-computed with deterministic tie rules and a published reset time. Seasons never delete permanent purchases.

## 13. Events and retention

Rotate bounded events: local festival, premium packaging week, celebrity order, supplier sale, inspection comedy scene, worker mishap, and room-design contest.

Each event uses one short decision or a clear optional goal. No crop theft by a random NPC that forces a paid recovery. Events may temporarily improve demand; they should not invalidate normal products.

Retention comes from collections, visible expansion, returning characters, crew contribution, and attainable goals. Optional reminders are opt-in and rate-limited. Daily rewards use forgiving progress rather than punitive streak resets.

## 14. Screen map

| Screen | Primary action | Required supporting information |
|---|---|---|
| Sign-in | Start / resume | Recovery, guest migration, adult audience notice |
| Home room | Collect or select slot | Ready count, next goal, game cash, token badge |
| Crop sheet | Plant / harvest | Game duration, output, quality, inventory |
| Collection | Choose strain | Unlock source, visual variants, demand |
| Orders | Accept / fulfill | Reservations, expiry, buyer reward |
| Production | Queue batch | Ingredients, queue capacity, completion time |
| Build | Place / upgrade | Socket preview, cost currency, exact benefit |
| Staff | Assign | Role, budget, automation settings |
| Property map | Travel / unlock | Requirements, room status |
| Shop | Inspect offer | Token quantity, ownership, item contents |
| Balance | Fund / inspect history | Available versus pending funds, receipts, support |
| Profile / visits | Customize / visit | Public-only data and reporting |
| Crew | Contribute | Shared target and individual credit |
| League | Enter challenge | Rules, equalized loadout, season time |
| Settings | Control preferences | Audio, motion, notifications, recovery, privacy |
| Support | Request help | Receipt reference and issue category |

Keep the bottom navigation to Room, Orders, Build, World, Profile. Crops and production open contextually. Balance opens from its header badge. A shop should not displace the main game action.

## 15. Art and animation production

### Production method

Create an art specification for each room: fixed camera, canvas size, floor anchors, light direction, scale reference, socket coordinates, safe crop area, foreground masks. Produce empty rooms and objects separately. Never try to animate an entire mockup screenshot as if the objects were separated.

Store source masters at high resolution; deliver optimized WebP/AVIF backgrounds and alpha-capable sprite textures. Use atlas packing where appropriate; actual memory and decode behavior must be tested on target devices. Keep interface text out of artwork.

### Asset inventory by release

| Pack | Alpha target | Beta / expansion |
|---|---:|---:|
| Room backgrounds | Garage + workshop | Add barn, warehouse, flagship, estate |
| Strain stage images | 6 × 4 = 24 | 24 × 4 = 96 total |
| Equipment sprites | 6 families × 3 tiers = 18 | Additional station families and decor |
| Staff portraits | 4 | 8+ |
| Staff action frames | One 6-frame station loop | Multiple roles and movement directions |
| Buyer portraits | 4 | 8+ |
| Product icons | 8 | 20+ |
| Decor | 12 | Themed sets per season |
| Core audio | About 12 UI/room cues | Location ambience and character stings |

These are planning counts; stage variants, masks, shadows, and responsive crops add work. Estimate from the asset manifest, not only from the number of backgrounds.

### Animation priorities

P0: button feedback, harvest feedback, inventory/cash changes, crop-stage transitions, lighting, subtle foliage sway. P1: station work loops, order delivery, upgrade placement. P2: walking workers, room transitions, visitors, richer ambient activity.

Use render transforms and meshes selectively; avoid visibly stretching plant pots and faces. Include reduced-motion mode, readable contrast, large touch targets, and audio-off play.

## 16. Technical architecture

Recommended structure: TypeScript client, React interface, PixiJS room renderer, versioned content definitions, server API, relational transactional database, background workers, object storage/CDN, telemetry, and an operations console. These are proposed components, not a requirement to migrate the prototype before validating the art pipeline.

Separate systems:

- **Client:** render room, animate, send intents, show optimistic feedback only where safe.
- **Game service:** validate actions, compute growth, manage inventory, progression, and orders.
- **Economy service:** atomic shop purchases and immutable token-balance ledger.
- **Funding adapter:** verify provider or chain events; never trust a browser-reported deposit.
- **Workers:** settle verified deposits, process notifications, reconcile ledger and season results.
- **Content service/config:** versioned catalog, room layouts, shop definitions, dialogue, and event schedules.
- **Admin:** investigate issues, publish content, issue audited adjustments, pause purchasing independently of gameplay.

Use the database as authority. A realtime channel improves UI freshness but is not the source of truth. A reconnect always refreshes a current snapshot. Client local storage becomes a cache and preferences store, never the source for real balances or competitive scores.

Timers are server timestamps. A grow job references the rules version active at creation. Claiming uses a transaction and a unique claim constraint. Background jobs need not tick each plant every second; compute eligible output on interaction or bounded reconciliation.

## 17. Data model

| Entity | Responsibility / important constraints |
|---|---|
| Player / AuthIdentity | Stable ID, login links, recovery and moderation state |
| Business / Profile | Name, level, public identity, private settings separated |
| Property / RoomInstance | Ownership, layout version, unlocked sockets |
| PlacedObject / EquipmentInstance | Socket, catalog definition, tier, purchase provenance |
| StrainDefinition / PlayerStrain | Versioned rules and earned unlocks |
| GrowJob | Start/ready times, strain, equipment snapshot, claim state |
| InventoryBatch / Reservation | Product, quality, quantity, reserved quantity |
| Recipe / ProductionJob | Versioned input/output snapshot and claimed state |
| Buyer / Contract | Requirements, deadline, reservations, settlement state |
| StaffInstance / Assignment | Role, level, station, budget, automation policy |
| ProgressEvent / Achievement | Earned progress with deduplicated triggers |
| LedgerAccount / Journal / Entry | Per-asset accounts and balanced immutable postings |
| FundingIntent / DepositEvent | External reference, chain/mint, amount, confirmation state |
| ShopQuote / Purchase / Entitlement | Exact charge, expiry, unique purchase and item delivery |
| Season / ScoreEvent | Rules version, eligible actions, deduplication |
| Crew / Membership / Contribution | Permissions and contribution ownership |
| VisitSnapshot / Reaction / Report | Public room state and moderation |
| AuditLog / OutboxEvent | Traceability and reliable downstream effects |

All quantities use integers in defined base units. Token amounts use the chain asset's decimals; never floating-point balance arithmetic. Every external event has a uniqueness key including its chain/provider identity. Store a transaction's individual transfer index when needed; a single transaction hash alone may contain several transfers.

## 18. Critical transaction flows

### Token purchase

1. Server issues a short-lived quote with catalog version and exact cost.
2. Client confirms with an idempotency key.
3. Transaction checks account status, quote validity, ownership limits, available balance, and unlocks.
4. Transaction posts ledger entries and creates the item entitlement together.
5. Commit publishes an outbox event for UI/analytics, then returns a receipt.
6. Retries return the same purchase result; they do not charge twice.

For delivery requiring an asynchronous external step, reserve funds and use an explicit settlement/compensation state machine. Do not debit first and hope a separate inventory write succeeds.

### Deposit

Create funding intent → await external transfer → independently verify exact asset/network/destination/amount → wait selected finality policy → deduplicate event → post ledger credit → notify player → reconcile. Wrong-chain, wrong-token, late, partial, overpaid, duplicated, and reorganized transactions require defined handling. Verify signed callbacks where supported and fetch authoritative state rather than trusting callback contents alone.

### Harvest and contract

Harvest locks/claims a ready job once and creates one output batch. Contract completion checks and consumes reserved stock and awards game cash once in the same transaction. Changing device time, replaying requests, or opening two tabs must not duplicate value.

## 19. Operations, security, and support

Real token funding is a separate release gate. Select the custody/payment model, available regions, account recovery process, terms, and provider eligibility with qualified review before activation. This plan does not make a legal determination about a future coin or payment model.

Required engineering controls: strong sessions, privileged-role separation, rate limits, audit logs, signed-event verification, least-privilege secrets, deposit reconciliation, tested backups, restore exercises, and a purchase kill switch. Funding failures must not take ordinary gameplay offline.

If keys are held by the project, define isolated signing, limited hot balances, controlled treasury access, and recovery responsibilities. Never store private keys in the browser or general game configuration.

Admin console: search accounts, inspect inventory and receipt history, view pending deposits, see reconciliation exceptions, correct stuck jobs, moderate profiles, version catalogs, and pause features. Corrections append compensating ledger entries with a reason; staff never overwrite a balance.

Support must be able to trace a purchase from account to quote, journal, entitlement, and external funding reference. Preserve relevant records under a documented retention policy. Avoid collecting real-world identity data unless the selected provider/model requires it.

## 20. Economy and validation

Design the simulation before locking numeric prices. Model free players, convenience purchasers, collectors, highly active players, and returning players. Test idle time, storage caps, different crop mixes, production bottlenecks, and inflation across at least 30 simulated game days.

Targets are hypotheses, not benchmarks: first rewarding action under two minutes, first upgrade in the first session, a useful return action after several hours, and at least one clear weekly milestone. Measure the experience, then adjust.

Analytics: tutorial steps, harvest cadence, order feasibility, stock stranded, cash sources/sinks, time to upgrades, return-session actions, purchase quotes versus completion, deposit settlement time, charge-to-delivery errors, and support cases. Do not log authentication secrets or sensitive payment payloads.

### Minimum test matrix

- First session without purchase reaches first upgrade.
- Zero-cash player can recover without token spending.
- Offline growth is capped as designed and never calculated from client time.
- Duplicate harvest/order/purchase requests settle once.
- Two simultaneous purchases cannot overspend.
- Token debit and item delivery cannot split after a crash.
- Replayed, delayed, out-of-order funding events do not duplicate credit.
- Wrong mint/network and insufficient finality never create available balance.
- Account recovery does not merge or duplicate balances.
- Layouts and touch controls work on representative Android/iPhone devices.
- Large inventories, slow networks, refreshes, and reconnects preserve state.
- Season scores exclude ineligible purchased advantages in equalized challenges.
- Backup restoration and ledger reconciliation produce explainable results.

Browser goals: responsive 30 fps minimum on selected midrange devices, avoid large loading stalls, lazy-load other rooms, and show a useful initial room quickly. Set concrete memory/download budgets after profiling the first real room; do not promise performance from image dimensions alone.

## 21. Delivery roadmap and release gates

This is multiple production workstreams, not a weekend extension. Plan by acceptance gates first; commit calendar dates only after measuring a complete room/asset pack and backend slice.

| Phase | Scope | Exit gate |
|---|---|---|
| 0 — Lock decisions | Economy model, token requirements, content IDs, art anchors, user flows | Written decisions and executable backlog; funding unresolved items isolated |
| 1 — Visual slice | Production garage, 4 distinct growth stages, 1 work loop, responsive controls | Layer alignment and playability verified on target phones |
| 2 — Persistent alpha | Accounts, authoritative growth, inventory, NPC orders, upgrades | Full loop survives refresh, reconnect, duplicate requests, and concurrent sessions |
| 3 — Content alpha | 6 strains, 2 properties, packaging, 4 buyers, 4 staff roles | Several days of progression with no impossible orders or cash soft locks |
| 4 — Token sandbox | Ledger, quotes, entitlements, funding adapter, reconciliation, admin | Failure/replay/overspend tests pass with simulated or supported test transactions |
| 5 — Closed paid beta | Small deterministic token catalog, supported real funding, support | Gate review complete; balances reconcile; paid receipts and recovery work |
| 6 — Social beta | Visits, profiles, crews, equalized weekly challenge | Permissions, moderation, scoring, load testing verified |
| 7 — Public version 1 | 12 strains, 3 properties, 4 product families, tuned economy | Stable onboarding, mobile checks, operations coverage, rollback exercised |
| 8 — Live expansion | Remaining roster, warehouse/flagship/estate, seasons, richer animation | Release one tested pack at a time; monitor economy and performance |

The 24-strain/6-property plan is the long-term target, not the initial launch requirement. Defer player marketplace, theft/PvP, unrestricted chat, NFT trading, cash-out, and financial reward pools until separately designed and justified.

### Immediate implementation backlog

1. Replace scaled mature crop with four aligned stage assets and stable pots.
2. Lock garage anchors and equipment sockets; add a visible, real shelving upgrade sprite.
3. Add one matching workstation animation and satisfying harvest sequence.
4. Extract content and economy rules from UI code into versioned definitions.
5. Design and implement account/save API and authoritative grow/inventory transactions.
6. Add order reservation and deterministic job claiming.
7. Implement the ledger and token shop behind a disabled production-funding flag.
8. Build operations views and transaction tests before enabling any real balance.
9. Produce the workshop, first product line, and multi-day progression test.

## 22. Ownership and decisions to make next

The owner controls tone, branding, token identity, commercial scope, and final spending policy. Engineering owns implementation and reliability; art owns consistency; game design owns balance; operations owns reconciliation/support. One person can fill several roles, but none of these responsibilities disappears.

Five decisions unlock detailed implementation:

1. **Coin:** name, ticker, blockchain, mint/contract address, decimals, transfer restrictions.
2. **Funding:** how players acquire/deposit it and which party controls settlement/custody.
3. **Balance meaning:** actual redeemable token claim or nonwithdrawable purchase credits; withdrawal/refund policy.
4. **Competition:** accept separate open-business and equalized challenge modes, or choose another fairness model.
5. **Commercial catalog:** approve token-purchasable categories and limits before setting prices.

We can continue art production, gameplay design, authoritative saves, and a mock-funded ledger before these are settled. Do not silently select a chain or payment provider, and do not activate real deposits until the token-specific architecture is confirmed.

## 23. Current prototype versus the production target

Current playable link: https://high-stakes-garage.swiftcomet.chatgpt.site

Implemented: layered garage background, one mature crop sprite, short growth timers, harvesting, NPC orders, upgrades, local browser save, simple audio cue.

Not yet implemented: production stage art, robust scene placement, walking staff, server accounts, authoritative economy, actual token balances, payment integration, multiplayer, production stations, additional rooms, real competition, or operational admin. The current prototype is a visual/gameplay experiment, not a secure foundation for real token accounting.

Retain its useful artwork and interaction ideas; move production logic into tested server systems. Never migrate arbitrary local cash into a real token balance.

## 24. Technical reference checks

Checked October 17, 2026. These establish technical primitives, not compatibility approval for the user's unspecified token.

- Solana token documentation explains mint identity, token accounts, and transfer authority: https://solana.com/docs/tokens and https://solana.com/docs/tokens/basics/transfer-tokens . Relevant only if Solana is selected.
- Coinbase Payment Acceptance documents a USDC payment platform: https://docs.cdp.coinbase.com/api-reference/payment-acceptance/overview . It is an example of payment architecture, not a selected custom-token processor.
- Coinbase payment API conventions document idempotency: https://docs.cdp.coinbase.com/api-reference/payment-apis/conventions . Our ledger and game operations require their own deduplication regardless of provider.

All game numbers, rosters, milestones, and architecture choices in this plan are original proposed design. Provider support and final integration details must be checked again when the coin and funding model are known.

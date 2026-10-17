# High Stakes: launch readiness (devnet pass, Oct 17 2026)

Honest status before any real token. "Solid" means every item below is either verified or listed as open. Nothing here is a guarantee.

## Verified (and how)

| Area | Evidence |
|---|---|
| Game rules, league scoring, server rules, cosmetics, orders | `node --test tests/*.test.mjs`: 64 tests |
| Hostile input | `tests/fuzz.test.mjs`: 4,000 random malformed requests, never throws, never 5xx, no prototype pollution, save stays sane |
| Chain payment checker | `node devnet/offline-test.mjs`: 26 forged/underpaid/wrong-mint/no-reference/failed-tx cases |
| Live backend (real Supabase) | `node scripts/live-test.mjs`: 20 checks incl. forged token, billion-cash import, impossible stock, made-up actions, server clock |
| Live purchases (real Supabase + real devnet) | `node devnet/live-pay.mjs`: 12 checks. Server-set price (client amount ignored), unpaid stays pending, **underpayment rejected**, correct SOL settles only after finalization, re-check idempotent, cannot rebuy, token payment settles, **SOL paid for a token order rejected**, **one transaction listing two orders' references settles only one**, other players cannot touch your order |
| Payouts (devnet) | `devnet/payout.mjs`: bad address, over-cap, missing id, duplicate id all refused; real SOL + token payout sent; **re-running the same file pays nothing twice** (ledger) |
| Weekly tournament, full cycle (devnet) | `node devnet/live-tournament.mjs` + SQL `hs_week_winners` + `payout.mjs`: players score by server-timed orders; wallets link BY SENDING 0.001 SOL; **a player with imported progress is excluded**, **a player with no wallet is excluded**, **a second account cannot claim an already-linked wallet**; winners export returned exactly the 2 eligible players with correct prizes; export **refuses an unfinished week**; payout refused when the prize pool was underfunded, then paid 500 + 250 HSTEST after funding; **re-run paid nothing twice**; balances verified on chain |
| In-game flow on a phone-size viewport | Cloud save on, Profile shows the shop, order created, paid from a simulated wallet, the page flipped to "Owned" by itself |

## Found and fixed in this pass

1. `devnet/payout.mjs` would pay everyone again if re-run. Now every entry needs a unique `id` and paid ids are written to `.payouts.json`.
2. Earlier: expansion upgrade corrupted pot arrays for every upgrade (fixed, tested).
3. A hand-built "empty" cloud save could smuggle in free pots/jars/cash; the server now replaces any no-progress import with a clean start.
4. Purchases were only a demo page. They are now real server ops (`orders`, `orderCreate`, `orderCheck`) with tables, one-transaction settlement and per-order throttling (migration `0002_orders.sql`).

## Known glitch (minor, not fixed)

- On the Profile tab the shop card re-renders when the cloud status changes, so the buy buttons can vanish for 1-2 seconds. It reloads by itself. An open order is restored from the server.

## NOT built yet (blockers for a token launch)

- **Prizes are devnet-only and semi-manual.** Built: eligibility (server-started save + wallet linked by sending, one wallet per account), weekly winners export (`hs_week_winners`, top 3 per division, 500/250/100 HSTEST x1/x2/x4), payout script with caps and a no-double-pay ledger. Not built: automatic weekly run, entry fees, a funded prize-pool policy (the script refuses if the treasury is short), tie/dispute handling, anti-sybil beyond one-wallet-per-account (a person can still run several accounts with several wallets: needs CAPTCHA/phone/identity decisions and legal review).
- **Existing local players are not prize-eligible** if they enable cloud after playing (their save counts as imported). They can still use the league; prize players must start on the cloud. The UI says so.
- **Wallet cannot be changed** once linked (support process needed).
- **What the token does in the game.** Today HSTEST only buys 4 cosmetic items. The economy plan (sinks, prize split, supply) is not approved.
- **Treasury custody.** One key on a dev machine. Mainnet needs a multisig (for example Squads), a small separate payout wallet, and a decision on the mint authority.
- **Mistaken payments** (sent without the reference, wrong amount, expired order). No reconciliation or refund tool yet.

## Open production risks

- CAPTCHA on anonymous sign-ins (Supabase Auth > Attack Protection). Also an RPC-cost amplifier: each order check calls the chain.
- Custom SMTP for email links. Vendor `supabase-js` instead of loading it from esm.sh.
- Public devnet RPC rate limits; mainnet needs a paid RPC provider and a second provider to cross-check.
- No monitoring, alerts, backups or restore drill. Supabase free projects pause after a week idle.
- Tested in one browser engine only; no automated UI tests; no load test; real wallet apps not tried (only a script that pays like one).
- Pump.fun mechanics cannot be tested on devnet.
- Needs an independent security review and legal review (prizes, gambling rules, token) before mainnet.

## How to re-run everything

```
node --test tests/*.test.mjs
node devnet/offline-test.mjs
node scripts/live-test.mjs
cd devnet && node live-pay.mjs      # needs devnet SOL + HSTEST in the e2e-player wallet
```

Cleanup of test accounts (Supabase SQL editor): `delete from auth.users where is_anonymous;` (only while no real players are anonymous; cascades to saves, orders and items).

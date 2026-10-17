# High Stakes: Solana devnet test (pay by sending)

Everything here runs on **Solana devnet**: free test SOL and a free test token. Nothing has real value.

## The model in one paragraph

There is **no wallet connection**. Players pay by **sending** SOL or the game token from their own wallet app to the treasury, using a Solana Pay link (or by typing the address and the one-time order code). The game only **reads** the blockchain to see that the payment arrived. It never asks for a signature, never touches a player's wallet, and holds no keys that can spend player funds.

- **SOL** payments go to the treasury wallet (revenue; funds prizes).
- **Game token** (Token-2022, name/symbol stored on chain) payments go to the treasury's token account (spent on premium items, league entry, perks).
- Gameplay (game cash, crops, upgrades, saves, league points) stays off chain.

## How one purchase works

1. The server creates an **order**: item, coin, exact amount (set by the server, never trusted from the browser), a **one-time reference** (random address), and an expiry.
2. The player gets a Solana Pay link/QR plus the treasury address, amount and reference.
3. The player sends from their own wallet. The wallet adds the reference to the transfer.
4. The server looks the reference up on chain. It accepts only if **all** of this is true: the transaction **finalized** (cannot be rolled back) and succeeded, the reference is in it as a non-signer, the **treasury's balance rose by at least the price** in the right coin (exact mint for the token), and a signer actually paid that amount.
5. The order is marked paid **once** (the server stores the signature so it cannot be redeemed twice) and the item unlocks.
6. The paying address is recorded. That is how a wallet is **linked by sending**: a tiny payment proves the player controls that address, with no connection or signature.

## What exists now

| Piece | File |
|---|---|
| Chain reader and payment checker (pure logic, retries, devnet-only guard) | `chain.mjs` |
| Send-to-pay demo page (no wallet connect, no third-party scripts, strict CSP) | `devnet.html`, `devnet-page.mjs` |
| Token + treasury setup (Token-2022 with metadata) | `devnet/setup.mjs` |
| Faucet (mints test tokens, tops up fee SOL) | `devnet/mint-to.mjs` |
| Prize payouts in SOL or token (dry run, caps, address checks) | `devnet/payout.mjs` |
| Wallet simulator (pays an order like a wallet app) | `devnet/pay.mjs` |
| 26 offline attack tests, real-devnet end-to-end test | `devnet/offline-test.mjs`, `devnet/e2e.mjs` |

Devnet token: `HSTEST`, Token-2022, 6 decimals. Prices: see `devnet-config.json` (public addresses and prices only).

## Run it

```
cd devnet
npm install --ignore-scripts
npm run setup                     # once: creates the token + treasury, writes ../devnet-config.json
npm run offline                   # 26 checks, no network, includes forged/underpaid/wrong-coin transactions
npm run e2e                       # real devnet: SOL and token payments found; attacks rejected
npm run faucet -- <wallet> 1000   # give a wallet test tokens (+0.01 SOL for fees)
npm run payout -- winners.json    # dry run; add --send to pay (SOL or token)
node pay.mjs <reference> sol 0.05 # simulate a wallet paying an order created on /devnet.html
```

Open `/devnet.html`, create an order, then pay it from a real wallet set to **Devnet** (or with `pay.mjs`). The page shows "Paid and finalized" once it lands.

## Security model

**What this design removes:** fake "connect wallet" pages, malicious signing requests and wallet drainers (there is nothing to connect or sign), and a whole class of front-end supply-chain risk (no CDN scripts; the demo page has a CSP that allows only its own files and the devnet RPC).

**Controls in place**
- Payments are judged by **balance changes**, so a wallet's exact transaction shape does not matter and forged-looking instructions do not help an attacker.
- Wrong mint (counterfeit token), underpayment by even one unit, payment to anyone but the treasury, missing or forged reference, failed transactions, and a SOL payment used for a token order are all rejected (tested offline and on real devnet).
- References are random per order, so one finished payment cannot satisfy another order.
- Only **finalized** transactions count.
- Treasury and prices come from server config; the client is never trusted for amounts.
- Payouts: dry run first, per-payout and count caps, address validation, treasury balance check.
- The checker refuses any RPC URL that is not devnet.
- Dependencies are pinned and installed with `--ignore-scripts`.
- Keys: the devnet authority key lives in `devnet/.keys/` (gitignored). A backup copy is at `C:\Users\bigch\hs-devnet-keys-backup\` (outside the repo). **Never commit or share these.**

**What nobody can promise, and what is still open ("100% secure" is not a real guarantee)**
- **Server compromise:** whoever controls the game server could grant items for free. Mitigate with least-privilege access, audit logs, and a read-only chain checker with no spending keys.
- **RPC trust:** a bad RPC could lie. Use a paid provider and cross-check two providers on mainnet.
- **Phishing:** a fake site could show a different treasury address. Use one canonical domain, show the treasury address everywhere, and pin it in signed config.
- **Player mistakes:** sending without the reference or the wrong amount. Needs a manual reconciliation tool and clear UI.
- **Key custody:** a single treasury key is fine for devnet only. On mainnet use a multisig (for example Squads), a hardware wallet, and a small separate hot wallet for payouts.
- **Token powers:** the mint authority can create more tokens. Decide before launch whether to revoke it or put it under the multisig. Avoid risky Token-2022 extensions (transfer hooks, permanent delegate, freeze) unless truly needed; the devnet token uses only a metadata pointer.
- **No custom on-chain program** means no smart-contract bugs, at the cost of off-chain trust in the server.
- **Before mainnet:** independent security review or penetration test, abuse and rate-limit monitoring, an incident plan, and legal review.

## Wiring into the game (next)

1. Server (with the accounts/league backend): create orders, store `signature` as unique, run `findPayment` on a timer, and mark orders paid once.
2. UI: a "Pay with SOL / token" option in the Style shop showing the link, address, amount, reference and a live status.
3. League prizes: backend produces `winners.json`; the host runs `payout` (dry run, then `--send`).
4. Keep the token off the gameplay core: it never buys growth speed, quality or yield.

## Not testable on devnet

Pump.fun and its creator rewards are mainnet-only. Devnet proves the game logic with a plain Token-2022 mint; the real launch is a separate decision.

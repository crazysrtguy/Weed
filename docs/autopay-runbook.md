# Automatic payouts: how it works and how to operate it (DEVNET)

## Flow (no human in the loop)

1. **Hourly** the database runs `hs_settle_week()`. For a finished league week it writes one row per prize winner into `hs_payouts` (top 3 per division, prize-eligible players only). The row id (`wk2962-garage-1`) is unique, so the same prize can never be created twice.
2. **Every 5 minutes** the database pings the `hs-payout` edge function. The function takes **no input**. It pays only rows the database created.
3. The function builds one token transfer per row from the **hot payout wallet**, saves the transaction signature to the database **before** broadcasting, broadcasts, and marks the row paid once the transaction is **finalized**.

## Why a crash or an attacker cannot make it pay twice or pay the wrong person

| Risk | Control |
|---|---|
| Crash between "sent" and "recorded" | The signature is saved first. Next run looks it up: finalized means mark paid; unknown to the network but blockhash still valid means **wait**; unknown and blockhash expired means safe to build a new one. Tested on real devnet (`devnet/live-autopay.mjs`). |
| Two runs at once | A database lock (`hs_payout_lock`) plus atomic claiming (`for update skip locked`). |
| Someone calls the function repeatedly | It takes no input and is idempotent; the lock makes repeat calls a no-op. |
| Someone edits the database | Writes need the service key, which no client has (live probe `scripts/live-rls-test.mjs`: every direct write, cross-player read and privileged function is refused). Even then the function enforces its own caps. |
| Runaway or bad rows | Per payout max 5,000 tokens (also a database check), daily cap 20,000, 10 per run, 5 attempts, valid on-curve wallet only, token asset only. |
| Hot key stolen | The hot wallet holds **only the prize pool you put in it** (plus fee SOL). It is not the treasury and not the mint authority. Top it up weekly from the treasury. The key exists only as the function secret `HS_PAYOUT_KEY`; the code also refuses to run if the key does not match the configured payout wallet or if the RPC is not devnet. |
| Fake "paid" shown to a player | Players only read their own rows (`hs_payouts`, read-only policy). |

## Operating it

- Hot payout wallet (devnet): `6vGH7fMhGN1HafPvEgnkXwWwjCnUL9fREp1b5rU1h8ab`. Key file `devnet/.keys/hot-payout.json` (gitignored, backed up in `C:\Users\bigch\hs-devnet-keys-backup\`). Never commit or share it.
- Fund it: `cd devnet && node mint-to.mjs <hot wallet> <amount>` (devnet faucet), plus a little SOL for fees.
- Watch it (SQL editor): `select id,status,attempts,signature,error from hs_payouts order by created_at desc limit 20;`
- A payout stuck in `failed` needs a human look (wrong wallet, empty pool). The pool being empty shows as repeated attempts then `failed`.
- Manual override still exists: `devnet/payout.mjs` (dry run, caps, ledger). Do not run both for the same prize id.

## Health checks and alerts

Every run, `hs-payout` also checks the hot wallet and the ledger and stores a snapshot in `hs_health`. It raises an alert (at most once an hour per kind) when: a payout has **failed**, the oldest unpaid prize has waited over **30 minutes**, the **prize pool** holds less than what is owed plus 1,000 tokens, or the hot wallet has under 0.02 **SOL** for fees. Alerts go to the function logs and, if you add the optional secret `HS_ALERT_WEBHOOK` (a Discord or Slack incoming-webhook URL), to that channel. View the snapshot: `select data from hs_health where name='payout';`

## Weekly top-up (devnet)

`cd devnet && node fund-hot.mjs --tokens 6000 --sol 0.3` (dry run) then add `--send`. It only tops the hot wallet up to the target, so running it twice is harmless. On mainnet the treasury is a multisig, so this becomes a proposal the signers approve.

## One-time setup (done by the project owner in the Supabase dashboard)

1. Deploy `supabase/dist/hs-api.bundle.ts` to the `hs-api` function (adds a 100 KB body limit and the payout wallet config).
2. Create function `hs-payout`, paste `supabase/dist/hs-payout.bundle.ts`, deploy, and turn **off** "Verify JWT with legacy secret".
3. Edge Functions > Secrets: add `HS_PAYOUT_KEY` = the contents of `devnet/.keys/hot-payout.json` (a list of 64 numbers).
4. Migrations `0004_payouts.sql`, `0005_cron.sql` and `0006_health.sql`.
5. Optional: secret `HS_ALERT_WEBHOOK` for alerts.

## Not covered yet (mainnet blockers)

Multisig treasury and weekly funding process, a paid RPC with a second provider, alerting when a payout fails or the pool runs low, CAPTCHA/anti-abuse, and a legal review of prizes. Several accounts per person is explicitly accepted for now.

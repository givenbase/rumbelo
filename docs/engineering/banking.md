# Bank data — CSV import and Enable Banking

How Rumbelo gets bank transactions into the Inbox. **CSV is always-on. Live PSD2 sync is Enable Banking**, behind a feature flag, not implemented end-to-end yet.

---

## Why we need bank data

The money loop needs ledger rows. Users either:

1. **Upload a bank export** (file import), or
2. **Connect a bank** (open banking / PSD2 account information — AIS)

Rows land as transactions in **Inbox** (`status: INBOX`). The household sorts them into jars — import does not auto-categorise to “perfect money.”

---

## How competitors typically do it

| Pattern | Who | Approach |
|---|---|---|
| Bank-first | Dutch apps like **Dyme** | PSD2 bank koppelen (own DNB licence or partner). Auto-categorise. Re-consent ~every 90 days. Product barely works without connect. |
| Sync + files | **YNAB** and similar | Direct Import where an aggregator covers the bank; **CSV / OFX** with column mapping as the reliable fallback. NL coverage is often incomplete — community converters and third-party syncers fill gaps. |
| File-first | Converters / DIY | Bank CSV → map columns → import with dedupe. No aggregator bill; more friction. |

Shared practices: paid plans for bank connect, dedupe on re-import, human review after ingest.

---

## Why not Stripe

Stripe in Rumbelo is **subscriptions / Checkout / Customer Portal** only. It does **not** pull household bank statement history for a budget app. Stripe Financial Connections (where available) is for payout/verification flows — not a Dutch PSD2 statement feed.

---

## Rumbelo strategy

1. **CSV statement import** — always available (Plus capability `moneyImport`). No third-party AIS cost.
2. **Enable Banking restricted production** — owner + friends whitelist their own accounts; free under Enable Banking’s ToS for eval / personal use. Fits early product.
3. **Enable Banking full production** — when any paying customer can connect a bank: commercial contract + quote. Gate behind Plus/Max bank-connect capability.

Chosen aggregator: **Enable Banking** (already stubbed). Port allows swap to Tink / Yapily / TrueLayer later without rewriting transaction persistence.

---

## File formats today

| Format | Status |
|---|---|
| **CSV** | Supported on the backend (`importCsv`). NL/EN header aliases. |
| MT940 / CAMT.053 / OFX / QIF / PDF | **Not** parsed. Banks often offer these on download screens; we do not ingest them yet. |

### CSV mapping

Server-side header aliases only (date/datum, amount/bedrag, description/omschrijving, counterparty/tegenrekening, …) in [`csv-parser.ts`](../../apps/backend/src/modules/public/product/money/ledger/transaction/csv/csv-parser.ts). No upload UI or manual column-map wizard in the app yet; `dryRun` preview exists on the contract but is not wired in the UI (`sample` is empty).

Imported rows: `source: CSV`, amounts in eurocents, SHA-256 dedupe key so re-importing the same statement skips duplicates.

---

## Enable Banking (live sync)

- **Licence / path:** PSD2 AIS via Enable Banking; we do not talk to ING/Rabobank APIs ourselves.
- **NL coverage (major):** ABN AMRO, ING, Rabobank have production AISP. Other Dutch ASPSPs (Volksbank brands, Triodos, etc.) — check [Enable Banking NL docs](https://enablebanking.com/docs/markets/nl/) and their ASPSP list.
- **Consent:** typically expires ~**90 days**; UI must warn before expiry when sync ships.
- **Code:** [`BankingPort`](../../apps/backend/src/banking/banking.port.ts); null adapter by default; [`EnableBankingAdapter`](../../apps/backend/src/banking/adapters/enable-banking.adapter.ts) throws until implemented (never silent `[]`).

Env (see `apps/backend/.env.example`):

```bash
FEATURE_BANK_SYNC=false
ENABLE_BANKING_APP_ID=
ENABLE_BANKING_PRIVATE_KEY=
```

When `FEATURE_BANK_SYNC` is on, `ENABLE_BANKING_APP_ID` is required (validated in env config).

---

## Pricing

Enable Banking does **not** publish a public price list for unrestricted production. You get a quote for AIS volume, countries, and whether you use their TPP licence.

| Tier | Cost |
|---|---|
| Sandbox | Free |
| Restricted production (whitelisted own accounts) | Free under their ToS for evaluation / personal use |
| **Full production** (any end-user bank link) | **Sales quote only** — [enablebanking.com](https://enablebanking.com) “Get a Quote” |
| Stripe | N/A for bank statements |

**Peer ballparks** (indie writeups for TrueLayer / Yapily-style starters — **not** Enable Banking official): often discussed around **~£150–500/mo** at small volume; Tink tends more enterprise. Order-of-magnitude only.

When you have a real quote (“NL, AIS only, ~N households, no PIS”), replace the ballparks in this doc with that number.

**CSV import:** €0 aggregator cost.

---

## Code map

| Piece | Location |
|---|---|
| Banking port + adapters | `apps/backend/src/banking/` |
| CSV parse | `…/ledger/transaction/csv/csv-parser.ts` |
| Import API | `TransactionService.importCsv` → `money.transactions.importCsv` |
| Contracts | `packages/contracts` — `ImportCsv` / `ImportPreview` |
| Settings copy | Bank accounts settings mention CSV; connect UI still “coming soon” |
| Plan capability | `moneyImport` — Upload bankafschriften (CSV); bank connect capability separate |

Flow:

```
CSV file ──► parseStatementCsv ──► dedupe ──► Transaction (CSV, INBOX)
Bank AIS ──► BankingPort.fetchTransactions ──► Transaction (BANK, INBOX)   [when implemented]
                    └──► household sorts in Inbox
```

---

## Product follow-ups (not done)

- CSV **import wizard** UI: pick account → upload → confirm mapping/preview → commit
- Implement **Enable Banking** adapter (institutions, link, fetch) + consent expiry UX
- Optional later: MT940 / CAMT.053 parsers if customers need them beyond CSV

---

## Related

- [Traps](./traps.md) — free open banking trap
- [Money module README](../../apps/backend/src/modules/public/product/money/README.md)
- [HANDOFF](../../HANDOFF.md) §11

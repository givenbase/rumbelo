# Product: Geld

The money loop. Children map one-to-one onto the Geld navigation.

| Child | Owns |
|---|---|
| `jar/` | the six jars and their categories; the split must total 100% |
| `income/` | income sources and the split that runs when money arrives |
| `fixed-cost/` | recurring obligations, drawn from a jar |
| `account/` | bank accounts, manual or linked |
| `transaction/` | the ledger, the Inbox, and CSV import (`csv/`) |
| `rule/` | auto-sort engine; first match wins, in priority order |
| `goal/` | targets with a monthly rate and a straight-line projection |
| `debt/` | balances plus avalanche/snowball ordering |
| `turn/` | the monthly Monopoly turn — score, level, event log |
| `ritual/` | the ten-minute weekly ritual and its surplus allocations |
| `dashboard/` | composition root; one aggregated read for the main screen |

Client-side soft coaching when editing the split (tips only, never blocks save):
`apps/application/app/_lib/split-coach/README.md`.

`dashboard` depends on the others through their services. It exists so the most
visited route in the product is one round trip instead of a waterfall.

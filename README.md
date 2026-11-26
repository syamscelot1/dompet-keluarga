# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/syamscelot1/dompet-keluarga/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/syamscelot1/dompet-keluarga/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

DompetKeluarga is a working household budget site for an Indonesian family,
built from scratch for make.fun's "Make the best household budget site"
bounty. Everything is original: the DompetKeluarga identity, the design,
the hand-made SVG charts and every line of copy. No network, no build step,
no framework, no tracker, no cookie — the site runs entirely offline from
its own files, on desktop and on a phone.

Every figure is consistent: all totals, charts and balances are computed
from the same 30 recorded transactions of the Hartono family for November
2026 (income Rp 14,000,000, expenses Rp 6,862,900, balance Rp 7,137,100).
Nothing is a placeholder.

## What is inside

- **Dasbor** — balance, income and expenses for the current month, budget
  remaining, a donut chart of spending by category, recent transactions,
  savings progress, and a month switcher (June–November 2026).
- **Transaksi** — the full transaction list with add / edit / delete (saved
  in localStorage), filters by kind and category, and text search.
- **Anggaran** — a monthly budget per category (groceries, electricity &
  water, transport, education, health, entertainment, other) with progress
  bars, remaining / over-budget amounts, and editable budget figures.
- **Tujuan** — four savings goals (emergency fund, family holiday, house
  down payment, Dimas's education) with progress and an add-funds form,
  plus a form to create new goals.
- **Laporan** — a six-month bar chart of income vs expenses, a per-month
  table with savings rates, a category breakdown, and computed insights.
- **Panduan** — a working 50/30/20 calculator and six original guides on
  household money in Indonesian: the 50/30/20 rule, emergency funds,
  paying yourself first, tracking every rupiah, weekly shopping, and the
  monthly review.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`.

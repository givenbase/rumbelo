# Rumbelo

**Stop wondering where it went.** Six jars, one calm overview.

Rumbelo is not a bookkeeping app. It is a single quiet view of where your money,
energy and time go — so intention leads, and life doesn’t decide first.

> Rijkdom is geen getal. Het zijn de teugels in jouw handen.

**Understand the project:** start in [`docs/`](./docs/README.md) (product, audience, brand, research, engineering). Living handoff: [`HANDOFF.md`](./HANDOFF.md).

## The loop

Income arrives and splits into six jars the same second. Fixed costs draw from
those jars, so you see them coming. Transactions land in an Inbox and get sorted —
by rule or by hand. Once a week, a ten-minute ritual redirects the surplus and
sets an intention. Once a month, the turn closes with a score and a log.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Monorepo | Turborepo + pnpm | matches the existing platforms |
| Frontend | Next.js 16, React 19, **Tailwind v4 only** | no CSS modules, no SCSS |
| API | NestJS 11 + Fastify + **oRPC** | contract-first, end-to-end types |
| ORM | MikroORM 6 + PostgreSQL | unit-of-work matters for money |
| Auth | better-auth (organization + 2FA) | Household comes from the org plugin |
| Hosting | Railway (EU, Amsterdam) | one region, one bill, EU-resident data |

### Two decisions worth knowing

**The backend is ESM.** Every `@orpc/*` package ships ESM only — no CommonJS
build — so a CJS NestJS app cannot `require()` them. `packages/contracts` is built
to dual CJS+ESM by tsup so both the ESM backend and the Next apps consume one
contract definition. This is the fix for the problem `ORPC_MIGRATION_PLAN.md`
worked around with an internal HTTP hop; that hop is not needed.

**Household isolation is row-level, not schema-per-tenant.** Rumbelo's "tenant"
is a *household*, and a B2C product would end up with tens of thousands of
schemas, O(households) migrations and catalog bloat. Every financial row carries
`household_id` and the filter is injected in exactly one place —
`common/household/household-scoped.repository.ts` — from AsyncLocalStorage, so a
service cannot pass the wrong id or forget one.

## Layout

```
apps/
  backend/       NestJS + oRPC + MikroORM   :3002
  application/   the authenticated product  :3000
  website/       marketing site             :3001
packages/
  contracts/     oRPC contracts + Zod schemas + typed client (dual CJS/ESM)
  ui/            shared React primitives
  typescript-config/
docs/            product, brand, research, engineering
```

## One hierarchy, four layers

The same product tree governs the modules, the API surface, the routes and the
database. Learn it once and it holds everywhere.

| Product | Backend module | Contract namespace | Route | DB schema |
|---|---|---|---|---|
| — | `modules/public/platform/household` | `contract.household` | `/settings` | `public` |
| — | `modules/public/platform/coach` | `contract.coach` | — | `public` |
| **Geld** | `modules/public/product/money/*` | `contract.money.*` | `/money/*` | `public` |
| **Groei** | `modules/public/product/growth/*` | `contract.growth.*` | `/growth` | `public` |
| **Energie** | `modules/public/product/energy/*` | `contract.energy.*` | `/energy` | `public` |
| **Ziel** | `modules/public/product/soul/*` | `contract.soul.*` | `/soul` | `public` |

Money's children are the same list in all four places: `jars` `income`
`fixed-costs` `accounts` `transactions` `rules` `goals` `debts` `turn` `ritual`
`dashboard`. So `contract.money.jars.list` is served by
`modules/public/product/money/plan/jar/jar.controller.ts`, reads `public.jar`, and backs `/money/jars`.

Postgres planes: `auth` (identity), `public` (app/household), `backoffice` (catalogs we publish).
**Code is English; copy is Dutch.** Every folder, route, identifier and table is
English. Only user-facing text is Dutch, and dates go through `Intl` with a
locale rather than hardcoded month tables, because the product ships NL and EN.

## Getting started

```bash
cp .env.example .env          # monorepo secrets — see comments in the file
# optional Next overrides:
#   cp apps/application/.env.example apps/application/.env.local
#   cp apps/website/.env.example apps/website/.env.local
pnpm install
pnpm infra:up
pnpm db:migrate
pnpm auth:migrate
pnpm dev
```

### Lint & format (Oxc)

ESLint and Prettier are replaced by [Oxlint](https://oxc.rs/) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter):

```bash
pnpm lint         # style (oxlint/oxfmt/entities) + TypeScript (`check-types`)
pnpm lint:style   # style only (fast autofix; no tsc)
pnpm lint:check   # CI-friendly check only (no writes) + types
pnpm check-types  # TypeScript alone
pnpm format       # oxfmt only
```

Config: root `.oxlintrc.json` (shared baseline) plus nested configs:
`apps/backend`, `apps/application`, `apps/website`, `packages/ui`, `packages/hooks`.
Format: `.oxfmtrc.json`. Backend also runs `lint:entities` (MikroORM entity conventions).

**Pre-commit:** Husky runs `pnpm lint` on every commit (style + types). Autofixes/format are re-staged into the commit; remaining errors abort it (`--no-verify` skips — don't).

### Demo accounts + E2E

After migrate + auth migrate + seed:

| Plan | Email | Password |
|------|-------|----------|
| Basic | `basic@rumbelo.com` | `RumbeloDemo1!` |
| Plus | `plus@rumbelo.com` | `RumbeloDemo1!` |
| Max | `max@rumbelo.com` | `RumbeloDemo1!` |

```bash
pnpm infra:up && pnpm db:migrate && pnpm auth:migrate && pnpm db:seed
pnpm dev
# Sign in with a demo chip (dev) or the table above

pnpm test:e2e:smoke   # Playwright — apps must be running + DB seeded
pnpm test:e2e:plan
```

Basic may stay €0 or become a small paid tier later without renaming.

Env templates follow the same documented style as Galighticus/Meltizo (sectioned
banners + comments). Root `.env.example` is the source of truth for local API
secrets; per-app examples under `apps/*/`.env.example` cover client-safe
`NEXT_PUBLIC_*` keys.

## Renaming

The name is one command, by design:

```bash
node scripts/rename-project.mjs <new-name>
```

## Status

Implemented against the database: jars and balances, transactions and the inbox,
CSV import with idempotent dedupe, debt payoff ordering, goal projections, energy
summaries, household settings with **Basic / Plus / Max** plan keys. Demo personas
are seeded for live login. Application screens use live oRPC queries (no `_mock/`
fixtures). Playwright lives in `apps/e2e`.

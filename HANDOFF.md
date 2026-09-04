# Rumbelo — direction & handoff

**Geld met intentie.** Six jars, one calm overview.

> Rijkdom is geen getal. Het zijn de teugels in jouw handen.

Rumbelo is not a bookkeeping app. It is a single quiet view of where your money,
energy and time go — so intention leads, and life doesn’t decide first.

**Organized docs (product, brand, research, engineering):** [`docs/`](./docs/README.md)

---

## 1. Read this first

This document carries the **direction**, the **decisions and why**, and the
**traps already hit**, so nobody re-derives them. Product, audience, brand, and
research briefs live under [`docs/`](./docs/README.md); this file remains the
living engineering handoff.

**State in one line:** the platform is built and green (`pnpm build` and
`pnpm check-types` both pass); the ~32 screens are a *reconstruction* and must be
rebuilt against the real design — see §8, the most important section here.

---

## 2. The product

Income arrives and splits into six jars the same second. Fixed costs draw from
those jars, so you see them coming. Transactions land in an **Inbox** and get
sorted, by rule or by hand. Once a week a **ten-minute ritual** redirects the
surplus and sets an intention. Once a month the **turn** closes with a score and
a log — the Monopoly framing.

Four products, which are also the navigation:

| Product | What it answers |
|---|---|
| **Geld** | Where does this month go? |
| **Groei** | How do I earn more? |
| **Energie** | What am I running on? Sleep, training, food, rest — the floor under financial decisions, not lifestyle extras. |
| **Ziel** | Why am I doing this? |

**Audience:** successful people, people who want change, and people who want to
be successful but don’t yet know the exact next move — see
[`docs/product/audience.md`](./docs/product/audience.md). Start with the owner
and friends; a subscription product if it works.
**Language:** Dutch first, English second.

### Principles the product must not violate

1. **Eerst verdelen, dan uitgeven.** Money gets a job before it gets spent.
2. **Tien minuten per week.** The weekly ritual beats daily worry.
3. **Energie draagt geld.** A tired head spends; a rested head steers.
4. **Informatie, nooit schaamte.** An over-the-line jar is a signal, not a
   verdict. Every warning carries the one move that fixes it.

Principle 4 has teeth. It is why the Coach always ships a CTA, why overspending
renders as information rather than alarm, and why `spendCorrelation` stays `null`
until there is enough data — a correlation from six points is noise dressed as
insight.

---

## 3. Stack, and why

| Layer | Choice | Reason |
|---|---|---|
| Monorepo | Turborepo + pnpm | matches Meltizo / Galighticus |
| Frontend | Next.js 16, React 19, **Tailwind v4 only** | see §6 |
| API | NestJS 11 + Fastify + **oRPC** | contract-first, end-to-end types |
| ORM | MikroORM 6 + PostgreSQL | unit-of-work matters for money |
| Auth | better-auth (`organization` + `twoFactor`) | Household *is* the org plugin |
| Hosting | Railway (EU, Amsterdam) | one region, one bill, EU-resident data |

Pinned to **node >=22 / pnpm 10.33.0 / TypeScript 5.9.3**. `create-turbo` ships
node >=24, pnpm 11 and TypeScript 7 — none of which run on this machine, and TS 7
is the Go rewrite, risky under NestJS `emitDecoratorMetadata`. Do not bump these
casually.

### Three decisions worth understanding

**The backend is ESM.** Every `@orpc/*` package ships ESM only — `"type":
"module"`, `.mjs`, no CommonJS build — so a CJS NestJS app physically cannot
`require()` them. `packages/contracts` is therefore built **dual CJS+ESM** by
tsup, and both the ESM backend and the Next apps consume one contract definition.
This is the real fix for what `galighticus-platform/ORPC_MIGRATION_PLAN.md`
worked around with an internal HTTP hop. **That hop is not needed. Do not
reintroduce it.**

**Household isolation is row-level, not schema-per-tenant.** Rumbelo's "tenant"
is a *household*. A B2C product would reach tens of thousands of schemas,
O(households) migrations and catalog bloat. Every financial row carries
`household_id`, and the filter is injected in exactly one place —
`common/household/household-scoped.repository.ts` — from `AsyncLocalStorage`, so
a service cannot pass the wrong id or forget one. Schema-per-tenant remains
correct for Meltizo; different problem.

**Postgres schemas group by product, not by household.** `platform`, `money`,
`growth`, `energy`, `soul`. Orthogonal to household scoping — it exists so the
database mirrors the module tree. better-auth keeps its own tables in `public`.

---

## 4. Layout

```
apps/
  backend/       NestJS + oRPC + MikroORM    :3002
  application/   the authenticated product   :3000
  website/       marketing site              :3001
packages/
  contracts/     oRPC contracts + Zod schemas + typed client (dual CJS/ESM)
  ui/            shared React primitives
  eslint-config/ typescript-config/
docs/            product, brand, research, engineering direction
devops/          docker-compose (local), Railway notes
design/          the Claude Design export — see §8
```

---

## 5. One hierarchy, four layers

The same product tree governs modules, API, routes and database. Learn it once.

| Product | Backend module | Contract | Route | DB schema |
|---|---|---|---|---|
| — | `modules/household` | `contract.household` | `/settings` | `platform` |
| — | `modules/coach` | `contract.coach` | — | `platform` |
| **Geld** | `modules/money/*` | `contract.money.*` | `/money/*` | `money` |
| **Groei** | `modules/growth/*` | `contract.growth.*` | `/growth/*` | `growth` |
| **Energie** | `modules/energy/*` | `contract.energy.*` | `/energy/*` | `energy` |
| **Ziel** | `modules/soul/*` | `contract.soul.*` | `/soul/*` | `soul` |

Money's children are the same list in all four places: `jar` `income`
`fixed-cost` `account` `transaction` `rule` `goal` `debt` `turn` `ritual`
`dashboard`.

So `contract.money.jars.list` is served by `modules/money/jar/jar.controller.ts`,
reads `money.jar`, and backs `/money/jars`. **Add anything in all four places or
not at all.**

---

## 6. Conventions — non-negotiable

**Structure.** One folder per domain aggregate: `entities/`, service, controller,
module. A product is a parent module importing its children. Cross-cutting code
in `common/`. A README at every product root. Never several controllers in one
file; never a flattened top-level `entities/`.

**Styling is Tailwind. Always.** No CSS files, no SCSS, no CSS modules, no inline
`style` attributes. When porting the design, **transform** its inline styles into
Tailwind utilities — do not copy them across. Design tokens live in
`packages/config/tailwind/theme.css` (`@theme`) — the **single source of truth**
for all hex/rgb values. Apps import only `@rumbelo/config/tailwind/globals.css`
in `app/globals.css` (no duplicate palette). shadcn semantic aliases
(`--color-background`, `--color-primary`, …) are `var()` references in the same
`@theme` block. Primitives come from `@rumbelo/ui` (shadcn CLI + Radix); Rumbelo
product widgets from `@rumbelo/ui` widget barrel; domain composition in
`app/_components/{layout,features}/` and route `./_components/`.

**Code English, copy Dutch.** Every folder, route, identifier, table and column is
English. Only user-facing text is Dutch. Dates and currency go through `Intl`
with a locale — never hardcoded month tables, because the product ships NL *and*
EN.

**Money is integer minor units.** Never a float. Never arithmetic on a decimal
string. Splitting goes through `common/utils/money.util.ts`, which gives the
rounding remainder to the largest share so no cent is invented or lost.

**Controllers are transport only.** A controller containing an `if` about money is
in the wrong place.

**Never query another aggregate's tables.** Import its service. See
`money/dashboard`, which composes five services rather than joining their tables.

**Migrations only.** `schema:update` never runs against a database holding money.

**Normalise.** Prefer a table over a `jsonb` column. `ritual_allocation` exists
for exactly this reason: it needs a real FK to `Jar` and gets summed in
aggregates.

---

## 7. What is real and what is not

**Backed by the database and working:** jar balances (one grouped query, not
N+1); transactions and inbox; CSV import with SHA-256 dedupe so re-importing a
statement cannot duplicate rows; Dutch decimal parsing (`EUR 1.234,56` breaks a
naive parser); debt avalanche/snowball ordering; goal projections; energy rolling
averages; household settings.

**Typed stubs, marked `TODO` — routes resolve and types check, nothing
persists:** onboarding; income persistence; rule replay; turn close; ritual stage
transitions; gratitude write.

**Screens** read `app/_mock/` (design fixtures), whose shapes match the contract exactly, so
switching one to live data is a one-line change to
`useQuery(api.<product>.<child>.<procedure>.queryOptions({ input }))`.

**Not built:** i18n (copy is hardcoded Dutch); form mutations; the portal hub
screen; quick-add sheet; period selector; transaction detail sheet; paywall
state; the initial migration; seeders.

---

## 8. The design import — START HERE

**The ~32 screens in `apps/application` are a reconstruction, not the design.**

What happened: `DesignSync.get_file` caps at 256 KiB and returned
`truncated: true` for `Kluis Finance App.dc.html`. The screens were rebuilt from
`grep` output — `sc-if` conditions, `sc-for` collection names, extracted strings.
That produced the **domain** correctly (six jars, inbox, ritual, turn, four
portals) but the layouts, components and visual language are invented.

`design/` currently cannot be read: it carries a **`com.apple.macl`** extended
attribute inherited from `Downloads`, so macOS returns `EPERM` for every syscall —
Bash *and* the Read tool, sandboxed or not. Note `drwx------@`; the `@` is the
tell.

**Unblock it, in your own terminal:**

```bash
xattr -cr "/Users/givenloyiso/Desktop/DEV/rumbelo/design" && ls rumbelo/design
```

If it still errors, re-copy without the attributes:

```bash
ditto --norsrc --noextattr --noacl \
  "/Users/givenloyiso/Downloads/Finance app with Monopoly concept" \
  "/Users/givenloyiso/Desktop/DEV/rumbelo/design"
```

**Then, in order:**

1. Read the complete `.dc.html` — all 22 sections, including the truncated tail.
2. Serve `design/` locally and **screenshot every artboard.** Build against what
   is on screen, not what tag names imply. Not optional — skipping it is exactly
   how the current screens went wrong.
3. Transform each screen's inline styles into Tailwind: spacing onto the 4px
   scale, `--radius-*` to `rounded-*`, `--ease-out` / `--dur-base` to `ease-*` /
   `duration-*`, colours onto the `@theme` tokens already in `globals.css`.
4. Port `Button` from `_ds_bundle.js` as a Tailwind component. It is the **only**
   component the design imports from the design system — everything else is
   custom inline-styled markup, so the port is mostly mechanical.
5. Rebuild the screens against the real layouts.

The design overrides the base design system: the DS is gold-on-obsidian, the app
re-declares it as **indigo-on-white with a dark mode**. Those overrides are
already extracted into `apps/application/app/globals.css` and are correct — the
token layer does not need redoing, only the layouts.

**Everything outside `apps/application/app` and `components/` is
design-independent and stays:** monorepo, contracts, backend hierarchy,
household scoping, DB schema, build pipeline.

---

## 9. Next steps, in priority order

1. **Rebuild the screens from the real design** (§8).
2. **First migration + seeder.** Docker is configured; provision the five schemas
   and seed the six jars. Nothing runs end-to-end until this exists.
3. **Wire auth.** better-auth is configured but sign-in/sign-up are
   presentational.
4. **Implement onboarding.** It creates the household, seeds jars from the chosen
   split, writes settings. Gateway to everything else.
5. **i18n with `next-intl`,** before there is more hardcoded copy.
6. **Replace mocks with live queries,** screen by screen.
7. **Turn close and rule replay** — the two pieces of real domain logic still
   open.

---

## 10. Getting started

```bash
cp .env.example .env          # BETTER_AUTH_SECRET: openssl rand -base64 32
# optional: apps/application/.env.example → .env.local (NEXT_PUBLIC_*)
pnpm install
pnpm infra:up                 # Postgres + Redis in Docker
pnpm db:migrate               # once a migration exists
pnpm auth:migrate             # better-auth tables
pnpm dev                      # all three apps
```

Env files use the Galighticus-style sectioned templates (root + `apps/*/`.env.example`).

| App | Port |
|---|---|
| application | 3000 |
| website | 3001 |
| backend | 3002 |

Renaming is one command — the name was hard-won and should not be a one-way door:

```bash
node scripts/rename-project.mjs <new-name>
```

---

## 11. Traps already hit — do not re-learn these

- **`@orpc/*` is ESM-only.** A CommonJS backend cannot use it. §3.
- **Bundlers strip `"use client"`.** `packages/contracts` re-attaches it in
  `scripts/add-use-client.mjs`; tsup's `banner` option did not work on this build
  path. Without it, Next treats the hooks as server code and the build fails.
- **Duplicate `fastify` versions** break `@fastify/*` plugin typings. Pinned via a
  pnpm override to the version `@nestjs/platform-fastify` depends on.
- **`AsyncLocalStorage.run()` in a Nest guard does not work** — the store is gone
  before handlers execute. And Fastify/Nest middleware runs before route
  resolution (`req.url` is `/`). Household scoping is therefore an
  **interceptor** (`HouseholdScopeInterceptor`) that wraps `next.handle()`
  inside `householdStorage.run()`.
- **Next.js apps are `"type": "module"`,** so `next.config.js` needs
  `export default`, not `module.exports`.
- **String-enum members are nominal in TypeScript.** They do not satisfy the
  contract's literal unions; DTOs are derived from the contract instead.
- **An overspent jar must render a full red meter, not an empty one.** Empty reads
  as "no data", the opposite of what it means.
- **Free open banking is gone.** GoCardless Bank Account Data (ex-Nordigen) closed
  to new signups. **Enable Banking** has a free *restricted production* tier
  limited to accounts you link yourself, which fits the owner-plus-friends phase
  exactly. Bank sync sits behind a port with a **null adapter** by default; the
  Enable Banking adapter throws rather than returning `[]`, because a banking
  adapter that silently returns nothing looks like "your bank has no
  transactions". CSV import is the always-on path.
- **`Downloads` is TCC-protected on macOS** and the attribute follows a copy. §8.

---

## 12. Naming

`Rumbelo` — Spanish *rumbo*, "course / heading". Chosen because it is the one
candidate that means **direction**, which is what the product does. `.com` and
`.nl` were both verified free at the time of choosing.

Verify with **whois**, never DNS alone: a registered-but-unconfigured domain has
no NS records and reads as available. SIDN (`.nl`) rate-limits aggressively and
returns an error that looks like "taken" — pace queries and retry.

Before committing further, run a **BOIP** (Benelux) and **EUIPO** trademark
search, classes 36 and 42.

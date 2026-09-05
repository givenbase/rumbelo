# @rumbelo/contracts

Shared oRPC contract, Zod schemas, and TypeScript enums for app + backend.

Inspired by `@galighticus/api`: **ask “where does it belong?” first**, then place the
file under the same plane tree as `apps/backend/src/modules/`.

## Where does it belong?

```
Who writes the rows?
├─ Household / user  →  public/
│   ├─ Shared app runtime (household, coach, account prefs)  →  public/platform/
│   └─ A product line (Geld / Groei / Energie / Ziel)      →  public/product/{money|growth|energy|soul}/
└─ We (staff / system catalogs)  →  backoffice/
    ├─ Commercial tiers (Basic/Plus/Max)  →  backoffice/plan/
    └─ Product catalogs (templates/presets/taxonomies) live next to the
       public product that *exposes* them (e.g. money/schemas/catalogs.ts)
       — backend entities stay under backoffice/product/…

Cross-cutting primitives (Id, Money, Locale, CatalogItemBase)  →  common/
```

Same spine as the backend README. Wire paths stay short for nav parity
(`contract.money.jars.list` → `/money/jars/list`) — folder depth is for ownership,
not URL length.

## Layout

```
src/
  public/
    platform/              → @rumbelo/contracts/platform
      enums.ts · schemas/ · router.ts · index.ts
    product/
      money/               → @rumbelo/contracts/money
      growth/              → @rumbelo/contracts/growth
      energy/              → @rumbelo/contracts/energy
      soul/                → @rumbelo/contracts/soul
  backoffice/
    plan/                  → @rumbelo/contracts/backoffice
  common/                  → @rumbelo/contracts/common
  client/                  HTTP + React helpers
  routers/                 composes domain routers into `contract`
  enums/ · schemas/        thin cross-domain barrels
  index.ts                 full package root
```

Each product folder owns its `enums.ts`, `schemas/`, and `router.ts` (Galighticus
colocates `*.schema.ts` + `*.contract.ts` per leaf — same idea, domain-scoped).

## Domain subpaths (preferred for new code)

```ts
import { DebtKind, JarKey, Cadence } from '@rumbelo/contracts/money';
import { HouseholdKind, Currency } from '@rumbelo/contracts/platform';
import { PlanKey, PLAN_CAPABILITIES } from '@rumbelo/contracts/backoffice';
import { GrowthLeverPreset, WEALTH_STAGE_KEYS } from '@rumbelo/contracts/growth';
import { EnergyMetric } from '@rumbelo/contracts/energy';
import { Locale, Theme, Money } from '@rumbelo/contracts/common';
```

| Subpath | Folder |
|---------|--------|
| `/money` | `public/product/money` |
| `/growth` | `public/product/growth` |
| `/energy` | `public/product/energy` |
| `/soul` | `public/product/soul` |
| `/platform` | `public/platform` |
| `/backoffice` | `backoffice` (plan) |
| `/common` | `common` |
| `/` | full barrel |
| `/react` | TanStack Query helpers |

Root `@rumbelo/contracts` stays fully supported; migrate call sites to subpaths when you touch them.

## Enums

```ts
import { DebtKind } from '@rumbelo/contracts/money';
import { z } from 'zod';

z.enum(DebtKind); // ✅ Zod 4 — not z.nativeEnum
```

Backend MikroORM: `NativeEnum({ DebtKind, domain: 'money' })` → Postgres `money_debt_kind`
(see `apps/backend/docs/ENTITY_STYLE.md`).

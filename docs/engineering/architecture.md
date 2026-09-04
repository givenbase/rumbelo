# Architecture

Snapshot of how the system is built. For status, next steps, and full narrative, see root [`HANDOFF.md`](../../HANDOFF.md).

---

## Stack (and why)

| Layer | Choice | Reason |
|---|---|---|
| Monorepo | Turborepo + pnpm | matches Meltizo / Galighticus |
| Frontend | Next.js 16, React 19, **Tailwind v4 only** | one styling system |
| API | NestJS 11 + Fastify + **oRPC** | contract-first, end-to-end types |
| ORM | MikroORM 6 + PostgreSQL | unit-of-work matters for money |
| Auth | better-auth (`organization` + `twoFactor`) | Household *is* the org plugin |
| Hosting | Railway (EU, Amsterdam) | one region, one bill, EU-resident data |

Pinned: **node >=22 / pnpm 10.x / TypeScript 5.9.x**. Do not bump casually.

---

## Layout

```
apps/
  backend/       NestJS + oRPC + MikroORM    :3002
  application/   the authenticated product   :3000
  website/       marketing site              :3001
packages/
  contracts/     oRPC + Zod + typed client (dual CJS+ESM)
  ui/            shared React primitives
  config/        Tailwind tokens (single source of truth)
docs/            product, brand, research, engineering direction
design/          design exports — see docs/design/
devops/          docker-compose, Railway notes
```

---

## One hierarchy, four layers

The same product tree governs modules, API, routes, and database.

| Product | Backend | Contract | Route | DB schema |
|---|---|---|---|---|
| — | `modules/household` | `contract.household` | `/settings` | `platform` |
| — | `modules/coach` | `contract.coach` | — | `platform` |
| **Money** | `modules/money/*` | `contract.money.*` | `/money/*` | `money` |
| **Growth** | `modules/growth/*` | `contract.growth.*` | `/growth/*` | `growth` |
| **Energy** | `modules/energy/*` | `contract.energy.*` | `/energy/*` | `energy` |
| **Soul** | `modules/soul/*` | `contract.soul.*` | `/soul/*` | `soul` |

**Add anything in all four places or not at all.**

Money children (same list everywhere): `jar` `income` `fixed-cost` `account` `transaction` `rule` `goal` `debt` `turn` `ritual` `dashboard`.

---

## Decisions worth understanding

1. **Backend is ESM** — `@orpc/*` is ESM-only; `packages/contracts` is dual CJS+ESM. Do not reintroduce an internal HTTP hop.
2. **Household isolation is row-level** (`household_id` via `AsyncLocalStorage`) — not schema-per-tenant.
3. **Postgres schemas group by product** (`platform`, `money`, `growth`, `energy`, `soul`) — orthogonal to household scoping.
4. **Money is integer minor units** — never floats; split remainder via `money.util.ts`.
5. **Styling is Tailwind only** — tokens in `packages/config/tailwind/theme.css`.
6. **Code English, copy Dutch** — identifiers English; user-facing text Dutch (+ EN via i18n later).

---

## Conventions (short)

- One folder per aggregate: `entities/`, service, controller, module.
- Controllers are transport only — no money `if`s in controllers.
- Never query another aggregate’s tables — import its service.
- Migrations only against databases that hold money.
- Prefer normalised tables over `jsonb` when FKs/aggregates matter.

Full list: [`HANDOFF.md`](../../HANDOFF.md) §6.

---

## Related

- [Traps](./traps.md)
- [Design rebuild](../design/README.md)
- [Product overview](../product/overview.md)

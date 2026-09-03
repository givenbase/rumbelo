# Modules

Organised by **audience first, product second** — the same cut as Galighticus
(`portal` = customers, `backoffice` = employees, `auth` = identity).
A group is a parent module that imports its children; a child is one aggregate
with its `*.entity.ts`, service, controller and module as flat siblings.

| Audience | Where | What |
|---|---|---|
| Shared (identity) | `src/auth/` | better-auth config, organization plugin, access control — not a feature module |
| Shared (plumbing) | `src/common/` | env config, database primitives, household scoping, utils |
| Shared (product plane) | `platform/` | the household itself + cross-product advisory |
| Households | `money/` `growth/` `energy/` `soul/` | the four products, mirroring the app's portals |
| Rumbelo employees | `backoffice/` | reserved — created with its first real feature (support, admin, billing ops), never as an empty folder |

| Module | Children |
|---|---|
| `platform/` | `household` (settings, members, invites, onboarding) · `coach` |
| `money/` · Geld | `plan/` (`jar` `income` `fixed-cost`) · `ledger/` (`account` `transaction` `rule`) · `targets/` (`goal` `debt`) · `rhythm/` (`turn` `ritual`) · `dashboard` |
| `growth/` · Groei | `lever` `milestone` |
| `energy/` · Energie | `log` |
| `soul/` · Ziel | `gratitude` |

A product grows a sub-domain folder (like `money/plan/`) once it has several
aggregates that belong together — never pre-emptively. `growth`, `energy` and
`soul` stay flat until they earn grouping.

## Rules

- **Controllers are transport only.** Business rules live in the service. A
  controller that contains an `if` about money is in the wrong place.
- **Never query another aggregate's tables directly.** Import its service — see
  `money/dashboard`, which composes five services rather than joining their tables.
- **Household-owned entities extend `HouseholdEntity`** and are read through
  `HouseholdScopedRepository`, never `em.find` directly.
- **Money is integer minor units.** Never a float, never a decimal string in
  arithmetic. Splitting goes through `common/utils/money.util.ts`.
- Adding a product? Create the parent module and register it in
  `modules/index.ts`. Entities are discovered by convention — any `*.entity.ts`
  under `src/` (see `mikro-orm.config.ts`); there is no registry to edit.

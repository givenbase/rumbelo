# Modules

Organised by **product**, mirroring the navigation in `@rumbelo/application`.
A product is a parent module that imports its children; a child is one aggregate
with its own `entities/`, service, controller and module.

| Module | Kind | Children |
|---|---|---|
| `household/` | platform | the tenant itself — settings, members |
| `coach/` | platform | advisory that reads across all products |
| `money/` | product · Geld | `jar` `income` `fixed-cost` `account` `transaction` `rule` `goal` `debt` `turn` `ritual` `dashboard` |
| `growth/` | product · Groei | `lever` `milestone` |
| `energy/` | product · Energie | `log` |
| `soul/` | product · Ziel | `gratitude` |

## Rules

- **Controllers are transport only.** Business rules live in the service. A
  controller that contains an `if` about money is in the wrong place.
- **Never query another aggregate's tables directly.** Import its service — see
  `money/dashboard`, which composes five services rather than joining their tables.
- **Household-owned entities extend `HouseholdEntity`** and are read through
  `ScopedRepository`, never `em.find` directly.
- **Money is integer minor units.** Never a float, never a decimal string in
  arithmetic. Splitting goes through `common/utils/money.util.ts`.
- Adding a product? Create the parent module, register it in `modules/index.ts`,
  and add its entity barrel to `src/entities.registry.ts`.

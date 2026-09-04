# Modules

Organised by **audience first, product second** — the same cut as Galighticus
(`portal` = customers, `backoffice` = employees, `auth` = identity).
A group is a parent module that imports its children; a child is one aggregate
with its `*.entity.ts`, service, controller and module as flat siblings.

| Audience | Where | What | Who writes |
|---|---|---|---|
| Shared (identity) | `auth/` | `better-auth/` (library) + `account/` (person prefs) | library / user |
| Shared (plumbing) | `src/common/` | env, DB primitives, household scoping | — |
| Shared (product plane) | `platform/` | household board + coach runtime | **household / user** |
| Households | `product/` | money, growth, energy, soul | **household / user** |
| Rumbelo (company) | `backoffice/` | plan catalog, countries, question bank, CMS-like content | **we (staff/system)** |

### Who owns the row (control split — non-negotiable)

| Control | Module | Examples |
|---|---|---|
| **Household / user writes** | `product/*`, `platform/household`, `auth/account` | jars, txs, board settings, theme, language, which plan the household is *on* |
| **We write** | `backoffice/*` | Grip/Engine/Compound **plan** catalog, countries, question bank, FAQ, coach tip **templates** (+ billing later if Stripe needs it) |
| **Library writes** | `auth/better-auth/` | sessions, members, provider credentials |

`platform/` is the app’s shared runtime plane (household + coach) — **not** a place for company-published catalogs. If Rumbelo authors it, it lives under `backoffice/` (app may read a public projection). Do not create empty `backoffice/` until the first real aggregate lands.

| Module | Children |
|---|---|
| `auth/` | `better-auth/` · `account/` (`account-settings`, …) |
| `platform/` | `household` · `coach` |
| `product/` | `money/` (Geld) · `growth/` (Groei) · `energy/` (Energie) · `soul/` (Ziel) |
| `product/money/` | `plan/` (`jar` `income` `fixed-cost`) · `ledger/` (`account` `transaction` `rule`) · `targets/` (`goal` `debt`) · `rhythm/` (`turn` `ritual`) · `dashboard` |
| `product/growth/` | `lever` `milestone` |
| `product/energy/` | `log` |
| `product/soul/` | `gratitude` |
| `backoffice/` | `reference/jar-template` · `plan/` (Grip/Engine/Compound) · later `content/` |

A product grows a sub-domain folder (like `money/plan/`) once it has several
aggregates that belong together — never pre-emptively. `growth`, `energy` and
`soul` stay flat under `product/` until they earn grouping.

### Auth vs account vs catalogs

- `auth/better-auth/` — better-auth owns writes; we map read entities + config
- `auth/account/` — person prefs (theme, locale) — **user** writes
- Board prefs → `platform/household` — **household** writes
- Jar **instances** → `product/money/plan/jar` — **household** writes
- Jar **templates** (name, icon, default %) → `backoffice/reference/jar-template` — **we** write; onboard copies into household jars
- Product **tiers** (Grip / Engine / Compound) → `backoffice/plan` — **we** write; not the same as `product/money/plan` (jars/income)
- Seed data for catalogs lives next to the aggregate (`jar-template/seed/`); runners live in `src/database/seeders/` (`JarTemplateSeeder`, `DemoHouseholdSeeder`, orchestrated by `DatabaseSeeder`)

`FeatureModules` registers `AuthModule`, `PlatformModule`, `ProductModule`, `BackofficeModule`.

---

## Aggregate shape (every feature)

```
<aggregate>/
  <aggregate>.entity.ts      # PROPERTIES then RELATIONSHIPS
  <aggregate>.service.ts     # CREATE → READ → UPDATE → DELETE
  <aggregate>.controller.ts  # same order, transport only
  <aggregate>.module.ts      # MikroOrmModule.forFeature + exports
  index.ts                   # barrel
```

Gold standard in-repo: `auth/account/account-settings/`.

### CRUD order — non-negotiable

**Create → Read → Update → Delete.** The acronym is the order. Never
`list` before `create`. Never put `onboard` / `invite` / `importCsv` /
`createCategory` after updates or deletes.

Every service and controller uses these banners, in this sequence only:

```ts
// ====================================================================
// ? CREATE Operations
// ====================================================================

// ====================================================================
// ? READ Operations
// ====================================================================

// ====================================================================
// ? UPDATE Operations
// ====================================================================

// ====================================================================
// ? DELETE Operations
// ====================================================================
```

Include a banner only when that letter has methods — but never out of order.
Private helpers sit in a final `// Private` block after all public CRUD.

| Letter | Examples |
|--------|----------|
| **C** | `create`, `add`, `onboard`, `invite`, `importCsv`, `createCategory` |
| **R** | `list`, `get`, `findOne`, `settings`, `current`, `members`, `summary`, `balances`, `inbox`, `plan`, `projections`, `history`, `feed` |
| **U** | `update`, `updateSettings`, `updateSplit`, `sort`, `dismiss`, `close`, `applySplit`, `replay`, `advance` |
| **D** | `delete`, `remove`, `deleteCategory` |

### Entity comments

```ts
/**
 * <Name> Entity
 *
 * <one paragraph>
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(...)
export class Foo extends HouseholdEntity {
    // ? PROPERTIES
    /** ... */
    @Property(...)
    bar!: string;

    // ? RELATIONSHIPS
    /** ... */
    @ManyToOne(() => Other)
    other!: Other;
}
```

### Controllers

Transport only. No business `if`. Pattern:

```ts
@Implement(contract.money.accounts.create)
create() {
    return implement(contract.money.accounts.create).handler(({ input }) =>
        this.accounts.create(input)
    );
}
```

### Cross-aggregate rules

- **Never query another aggregate's tables directly.** Import its service —
  see `product/money/dashboard`, which composes services rather than joining tables.
- **Household-owned entities extend `HouseholdEntity`** and are read through
  `HouseholdScopedRepository`, never `em.find` directly on those entities.
- **Money is integer minor units.** Never a float, never arithmetic on a
  decimal string. Splitting goes through `common/utils/money.util.ts`.

### Auth vs account

- `auth/better-auth/` — better-auth owns writes; we map read entities + config
- `auth/account/` — Rumbelo-owned person rows (`account`, `account-settings`)
- Board prefs (currency, period, ritual, kind) → `platform/household`
- Person prefs (theme, locale) → `account-settings`
- better-auth credential store table is `provider`, not `account`

### Adding a product portal

Add a child under `product/`, register it in `product/product.module.ts`.
Entities are discovered by convention — any `*.entity.ts` under `src/`
(see `mikro-orm.config.ts`); there is no registry to edit.

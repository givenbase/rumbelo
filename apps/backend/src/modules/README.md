# Modules

Organised by **Postgres plane / who writes**, then product.
A group is a parent module that imports its children; a child is one aggregate
with its `*.entity.ts`, service, controller and module as flat siblings.

| Plane | Where | Postgres schema | Who writes |
|---|---|---|---|
| Identity | `auth/` | `auth` | library / user |
| Plumbing | `src/common/` | — | — |
| App / household | `public/` (`platform/` + `product/`) | `public` | **household / user** |
| Company catalogs | `backoffice/` | `backoffice` | **we (staff/system)** |

### Who owns the row (control split — non-negotiable)

| Control | Module | Examples |
|---|---|---|
| **Household / user writes** | `public/product/*`, `public/platform/household`, `auth/account` | jars, txs, board settings, theme, language, which plan the household is *on* |
| **We write** | `backoffice/*` | Grip/Engine/Compound **plan** catalog, countries, question bank, FAQ, coach tip **templates** (+ billing later if Stripe needs it) |
| **Library writes** | `auth/better-auth/` | sessions, members, provider credentials |

`public/platform/` is shared app runtime (household + coach) — **not** company catalogs. If Rumbelo authors it, it lives under `backoffice/`.

| Module | Children |
|---|---|
| `auth/` | `better-auth/` · `account/` (`account-settings`, …) |
| `public/platform/` | `household` · `coach` |
| `public/product/` | `money/` (Geld) · `growth/` (Groei) · `energy/` (Energie) · `soul/` (Ziel) |
| `public/product/money/` | `plan/` (`jar` `income` `fixed-cost`) · `ledger/` (`account` `transaction` `rule`) · `targets/` (`goal` `debt`) · `rhythm/` (`turn` `ritual`) · `dashboard` |
| `public/product/growth/` | `lever` `milestone` |
| `public/product/energy/` | `log` |
| `public/product/soul/` | `gratitude` |
| `backoffice/` | `reference/jar-template` · `plan/` · `communication/email` · later `content/` |

A product grows a sub-domain folder (like `money/plan/`) once it has several
aggregates that belong together — never pre-emptively. `growth`, `energy` and
`soul` stay flat under `product/` until they earn grouping.

### Auth vs account vs catalogs

- `auth/better-auth/` — better-auth owns writes; we map read entities + config
- `auth/account/` — person prefs (theme, locale) — **user** writes
- Board prefs → `public/platform/household` — **household** writes
- Jar **instances** → `public/product/money/plan/jar` — **household** writes (table in `public`)
- Jar **templates** → `backoffice/reference/jar-template` — **we** write; onboard copies into household jars
- Product **tiers** → `backoffice/plan` — **we** write; not the same as `product/money/plan` (jars/income)
- Outbound **email** → `backoffice/communication/email` — **we** send (invites; digests later)
- Seed data for catalogs lives next to the aggregate (`…/seed/`); runners in `src/database/seeders/`

`FeatureModules` registers `AuthModule`, `PublicModule`, `BackofficeModule`.

### Table naming (`entityConfig`)

Every Rumbelo-owned entity uses `entityConfig({ schema, domain?, tableName })` from
`common/database/entity-config.util.ts`:

- `auth` / `backoffice` / `public` schemas
- Domain prefixes in `public` (`money_jar`, `platform_household_settings`, …)
- Backoffice catalogs: `reference_jar_template`, etc.

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
  see `public/product/money/dashboard`, which composes services rather than joining tables.
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

Add a child under `public/product/`, register it in `public/product/product.module.ts`.
Entities are discovered by convention — any `*.entity.ts` under `src/`
(see `mikro-orm.config.ts`); there is no registry to edit.

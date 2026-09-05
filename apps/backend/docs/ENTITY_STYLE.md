# Entity File Style Guide

Authoritative conventions for MikroORM entity files under `apps/backend/src/`.

Reference implementations:

- `modules/auth/account/account.entity.ts`
- `modules/auth/account/account-settings/account-settings.entity.ts`
- `modules/public/platform/household/household-settings.entity.ts`

## File layout

```text
1. Imports        → common/database → mikro-orm → @rumbelo/contracts → local entities
2. Class JSDoc    → name, purpose, @see MikroORM link
3. Decorators     → @Entity(entityConfig(...)), @Unique, @Index
4. export class   → grouped sections (below)
```

`@Index` and `@Unique` are **class-level only** — never decorate individual fields. Prefer `@Index({ properties: ['field'] })` / `@Unique({ properties: ['field'] })` above `export class`.

`entityConfig()` must set `schema`, `domain`, and optionally `tableName`. See `common/database/entity-config.util.ts`.

Enums come from `@rumbelo/contracts` + `NativeEnum({ … })` — never `export enum` inside an entity file.

**Postgres type prefix (mandatory):** every `@Enum` uses `NativeEnum({ EnumName, domain: '…' })`.
`domain` is the product/plane of the **column** (where the row lives), not the TS file name:

| Domain | Example PG type |
|--------|-----------------|
| `money` | `money_debt_kind`, `money_cadence` |
| `platform` | `platform_household_kind`, `platform_currency` |
| `auth` | `auth_locale`, `auth_money_character` |
| `backoffice` | `backoffice_plan_key` |
| `energy` / `growth` / `soul` | `energy_metric`, … |

Shared TS enums (`Cadence` in `enums/common.ts`) still take the domain of the table that stores them (`domain: 'money'` on income/fixed-cost). Do not invent a second PG type by using another domain for the same concept.

## Inheritance (mandatory)

Every domain entity must extend one of:

| Base | Use when |
|------|----------|
| `BaseEntity` | Catalog / account rows with a uuid `id` |
| `HouseholdEntity` | Household-scoped product rows (`householdId` + uuid `id`) |

Both live in `common/database/base.entity.ts`. Do **not** redeclare `id`, `createdAt`, `updatedAt` (or `householdId` on `HouseholdEntity` subclasses).

Exception: `platform.household_settings` is keyed by better-auth `householdId` (not uuid) — it is allowlisted in `scripts/lint/check-entity-style.ts` until a dedicated settings base exists.

## Section order (mandatory)

Inside every entity class, fields are grouped in this order:

| Order | Marker | Contents |
|------:|--------|----------|
| 1 | `// ? PROPERTIES` | All `@Property` scalar / JSON fields |
| 2 | `// ? UI METADATA` | Optional display flags (`color`, `icon`, `sortOrder`, `isFeatured`) |
| 3 | `// ? ENUMS` | All `@Enum` fields — omit section when none |
| 4 | `// ? RELATIONSHIPS` | `@ManyToOne`, `@OneToMany`, `@ManyToMany`, `@OneToOne` |
| 5 | `// ? VIRTUAL PROPERTIES (GETTERS)` | Rare — getters only, always last |

**Industry standard:** scalars and enums before associations. Relationships are navigation concerns and belong last.

Junction / pivot entities contain only `// ? RELATIONSHIPS` when they have no scalar fields.

## Field naming by kind (mandatory)

Names should make the **shape** obvious without reading the decorator or the column type.

| Kind | Pattern | Examples | Avoid |
|------|---------|----------|-------|
| **Boolean** | `is*` / `has*` / `can*` (affirmative) | `isActive`, `isSpendable`, `hasMfa` | `active`, `disabled`, `isNotActive` |
| **Enum** | noun for kind/status (never a yes/no) | `kind`, `status`, `payoffStrategy` | booleans pretending to be enums |
| **Instant** | `*At` → `timestamptz` | `createdAt`, `closedAt`, `publishedAt` | `closed`, `timestamp`, `closedDate` for an instant |
| **Calendar date** | `*On` → Postgres `date` | `startedOn`, `endsOn`, `publishedOn` | `*At` for date-only; `*Day` for a full date |
| **Day ordinal** | `*Day` → `int` / `smallint` (1–31 or weekday 1–7) | `dueDay`, `expectedDay`, `periodStartDay`, `ritualReminderDay` | `dueDate` / `expectedDate` when the value is **not** a full date |
| **FK / id** | `*Id` matching the target | `householdId`, `accountId`, `jarId` | bare `household` as a string id |
| **Money / count** | plain noun | `amount`, `balance`, `percentage`, `rate` | encoding the type in the name (`amountCents`) unless dual units exist |
| **JSON array** | plural noun | `aliases`, `unlocks`, `audienceTags` | `aliasList`, `unlockJson` when plural is enough |
| **JSON object** | bag noun or `*Json` / `*Metadata` / `*Payload` | `metadata`, `settings`, `checkoutSnapshot`, `payloadJson` | vague `data`, `info`, `json` |
| **M2M / collection** | plural **relation** (table), not a json id list | `tags`, `members`, `events` | `tagIds: string[]` stored as jsonb |
| **1:1 / N:1** | singular relation | `account`, `user`, `jar` | embedding only the FK with no relation |

### Temporal — do not confuse Day / On / At / Date

This is the #1 naming footgun in money apps:

| Name | Stores | Type | Example meaning |
|------|--------|------|-----------------|
| `dueDay` | **Day of month** | `int` 1–28/31 | “Rent is due on the **25th** every month” |
| `expectedDay` | **Day of month** | `int` | “Salary lands on the **1st**” |
| `ritualReminderDay` | **Weekday** | `int` 1–7 | “Ritual on **Sunday**” |
| `startedOn` / `endsOn` | **Calendar date** | `date` | “Contract ends on **2026-12-31**” |
| `closedAt` | **Instant** | `timestamptz` | “Turn closed at **14:03:22Z**” |

**Do not** rename `dueDay` → `dueDate` or `expectedDay` → `expectedDate`. Those values are not dates; they are ordinals that repeat every period. Calling them `*Date` lies about the type and breaks sorting/validation assumptions.

Rumbelo calendar-date suffix is **`*On`** (Rails-style). Prefer `startedOn` / `endsOn` over `startDate` / `endDate` so `*Day` and `*Date` never collide in reviews. Use `*At` only for true instants.

### JSON — when and how to name it

1. **Prefer a normalised child table** when you filter, join, sum, or cascade on elements (see `ritual-allocation` — allocations are rows, not jsonb on the ritual).
2. **Use jsonb** for opaque bags, small string lists, or snapshots that are always read/written as a whole.
3. **Name the bag by contents**, not by storage:
   - Arrays → plural (`aliases`, `unlocks`)
   - Objects → `metadata` / `settings` / `*Snapshot` / `*Payload` / `*Json` when the noun alone is ambiguous
4. Never store a relation as `uuid[]` / id-list jsonb if you will query membership — that is an M2M table.

### Booleans & enums

Booleans are yes/no questions. Prefer `isActive` over `active`. Prefer positive forms — negate in code (`!isActive`), do not store `isInactive`.

When a “flag” needs more than two values later, use an **enum** (`status`) instead of stacking booleans.

## Normalization notes (keep the model clear)

| Situation | Prefer |
|-----------|--------|
| Household-owned money rows | `HouseholdEntity` + `householdId` (row-level isolation) |
| Catalog we publish | `backoffice.*` templates/presets — households **copy**, do not FK live money to mutable catalog rows except stable template keys |
| Repeating child lines you query | Child entity + FK (`RitualAllocation`) |
| Opaque config / match needles | jsonb with a clear plural / bag name |
| Soft delete / disable | `isActive` / `isArchived` — do not invent parallel “status enums” for on/off |

## Property order within `// ? PROPERTIES`

`id`, `createdAt`, and `updatedAt` live on `BaseEntity` — do not redefine them. `householdId` lives on `HouseholdEntity`.

Order domain fields as follows:

| Priority | Field types | Examples |
|---------:|-------------|----------|
| 0 | Primary key (when declared on entity) | `id` (`@PrimaryKey`) |
| 1 | **Identifier cluster** | `key`, `householdId`, `accountId`, `code` |
| 2 | Names & titles | `name`, `title`, `label` |
| 3 | URL slugs / dates | `slug`, `date` |
| 4 | Summaries & descriptions | `summary`, `description`, `why`, `notes` |
| 5 | Rich content | `body`, `content` |
| 6 | Classification & contact | `role`, `type`, `email`, `iban` |
| 7 | Numeric / monetary values | `amount`, `balance`, `percentage`, `rate` |
| 8 | Config JSON | `metadata`, `aliases`, `unlocks`, `audienceTags` |
| 9 | Link / media URLs | `url`, `imageUrl` |
| 10 | Boolean flags | `isActive`, `isArchived`, `isCoachEnabled` |
| 11 | Day ordinals | `dueDay`, `expectedDay`, `periodStartDay` |
| 12 | Domain dates & instants | `startedOn`, `endsOn`, `expiresAt`, `closedAt` |

**Identifier cluster rule:** IDs belong together immediately after the primary key — never separated by descriptive fields.

Within `// ? UI METADATA`, order: `color` → `icon` → `isFeatured` → `sortOrder`.

## Enum order within `// ? ENUMS`

1. Primary type / category enum  
2. Status / lifecycle enum  
3. Secondary classification enums  

All `@Enum` decorators must be in this section — never mixed into `PROPERTIES`.

## Relationship order within `// ? RELATIONSHIPS`

1. Required owner-side `@ManyToOne` / `@OneToOne` (parent / aggregate root)  
2. Optional `@ManyToOne` / `@OneToOne`  
3. Inverse `@OneToMany` / `@ManyToMany` collections  

Document each relationship with JSDoc covering: role, cardinality, owner side, ORM cascade, database `deleteRule`.

## JSDoc

- **Class:** 2–4 sentences + `@see https://mikro-orm.io/docs/defining-entities`
- **Every field:** short description; add cascade/delete notes on relationships

## Excluded files

Abstract bases are not domain entities:

- `common/database/base.entity.ts`

## Automated check

Run before commit (also runs as part of `pnpm --filter @rumbelo/backend lint`):

```bash
pnpm --filter @rumbelo/backend lint:entities
```

The script `scripts/lint/check-entity-style.ts` enforces:

- `extends BaseEntity` or `extends HouseholdEntity` (+ import from `common/database/base.entity`)
- no redeclared inherited fields (`id` / `createdAt` / `updatedAt` / `householdId`)
- boolean `@Property` names use `is*` / `has*` / `can*` (e.g. `isActive`, not `active`)
- temporal suffix matches column kind (`*Day` = int ordinal, `*On` = date, `*At` = timestamptz)
- jsonb `@Property` names are plural arrays or clear bag nouns (`metadata`, `*Json`, `*Payload`, …)
- section markers, section order, field order (via `scripts/lint/entity-field-priority.ts`)
- `@Enum` / relationship decorators in the correct sections

Domain-specific field sequences are declared in `SAME_PRIORITY_ORDER` inside `scripts/lint/entity-field-priority.ts`.

## Checklist for new / updated entities

- [ ] `extends BaseEntity` or `extends HouseholdEntity` (imported from `common/database/base.entity`)
- [ ] Booleans named `is*` / `has*` / `can*` (affirmative)
- [ ] Temporal suffixes match types (`*Day` int, `*On` date, `*At` timestamptz) — never `dueDate` for day-of-month
- [ ] jsonb fields are plural arrays or clear bags (`metadata` / `*Json` / `*Payload`)
- [ ] Class JSDoc with `@see` link
- [ ] `entityConfig({ schema, domain, tableName })` correct
- [ ] Sections in order: PROPERTIES → [UI METADATA] → ENUMS → RELATIONSHIPS
- [ ] Properties ordered: key → name/title → slug → content → flags → dates
- [ ] Every `@Property` and relationship has JSDoc
- [ ] No `@Enum` outside `// ? ENUMS`
- [ ] No relationships outside `// ? RELATIONSHIPS`
- [ ] Enums imported from `@rumbelo/contracts` + `NativeEnum({ EnumName, domain: '…' })` (explicit domain → PG prefix)
- [ ] No redeclared `id` / `createdAt` / `updatedAt` / `householdId`

# @rumbelo/backend

NestJS 11 + Fastify + oRPC + MikroORM 6 + better-auth. **ESM** — every `@orpc/*`
package ships ESM only, so CommonJS is not an option here.

```bash
pnpm --filter @rumbelo/backend dev   # :3002
```

- `src/common/` — config, database primitives, household scoping, shared utils
- `src/modules/` — audience → product → aggregate; see `src/modules/README.md`
  for CRUD shape (Create → Read → Update → Delete) and folder rules
- `src/modules/auth/` — better-auth + Rumbelo `account` (identity plane)
- `src/modules/platform/` — household + coach
- `src/modules/product/` — money, growth, energy, soul (household portals)
- `src/banking/` — bank aggregation behind a port; null adapter by default
- `src/database/` — migrations and seeders
  - `DatabaseSeeder` orchestrates `JarTemplateSeeder` + `PlanSeeder` (catalogs) then `DemoHouseholdSeeder`
  - Catalog seed **data** lives next to the aggregate (`modules/backoffice/.../seed/`)

Migrations only; `schema:update` is never run against a database holding money.

## Households: the isolation model

A **household** is one shared money unit — one board of jars, one ritual, one
pot of money to steer. It is a better-auth `organization`. A solo user is a
household of one; a couple, family or friends-investing-together group are
households of several. One person can belong to up to five households
(`organizationLimit: 5`) and switches via `activeOrganizationId`.

### Platform vs household-scoped data

| Concern | Location | Storage |
|---|---|---|
| Auth identity, sessions, org membership, invitations | better-auth (owns + migrates its tables via search_path) | `auth` |
| Household settings, coach inbox | `modules/household`, `modules/coach` | `platform.*` |
| Money / growth / energy / soul | feature modules | `money.*` etc., every row carries `household_id` |
| Enforcement | `HouseholdContextModule` interceptor + `HouseholdScopedRepository` | AsyncLocalStorage |

Postgres schemas (`auth`, `platform`, `money`, `growth`, `energy`, `soul`)
are **domain namespaces**, never per-customer schemas. `public` holds only
MikroORM's migrations table.

### How scoping is enforced

1. `HouseholdScopeInterceptor` (`common/household`) resolves the better-auth
   session per request, picks the household (`x-household-id` header → oRPC body
   → session `activeOrganizationId`), verifies membership, and stores
   `{ userId, householdId, role }` in AsyncLocalStorage.
2. `HouseholdScopedRepository` is the **single choke point** for reading and
   writing household-owned entities. It injects `householdId` from that context
   on every `find`/`create`, and `remove` refuses cross-household deletes.
   Services never call `em.find` directly on entities extending
   `HouseholdEntity`.

There is no scoping middleware: Fastify/Nest middleware runs before the route
is resolved (`req.url` is `/`), so the interceptor is the intentional and only
enforcement layer.

### Kind vs role (two different axes)

- **Role** (per member, from better-auth `member.role`): what can this person
  change? `owner`/`admin` → OWNER, `member` → MEMBER, `viewer` → VIEWER
  (read-only guest tier, defined in `src/auth/access-control.config.ts`).
  Role names are capability-neutral on purpose — "Partner", "Kid" or
  "Housemate" are UI copy driven by the household's kind, never enum values.
  Role *is* the trust level — there is no separate trust-score system.
- **Kind** (per household, `platform.household_settings.kind`): what is the
  nature of the group — `family`, `partners`, `friends`, `solo`? Kind only
  drives copy and defaults (e.g. a friends portfolio may hide energy/soul
  modules later); it never gates queries.

Households connect to people via membership; households are never linked to
other households.

### Why shared schema, not schema-per-tenant

Meltizo gives each subscriber its own `tenant_*` Postgres schema because its
tenants are companies: large, compliance-heavy, with per-subscriber
customization. Rumbelo's "tenant" is a household of 1–10 people sharing one
budget. Schema-per-household would mean creating/dropping a schema per signup,
N× migrations, an EntityManager fork on every request and painful
cross-household analytics — with zero product benefit at this tenant size.

Row-level isolation (`household_id` column + the scoped repository + the
interceptor) gives the same guarantee with one migration path and one
database. This is a deliberate decision; do not introduce `tenant_*` schemas
or `em.fork({ schema })`.

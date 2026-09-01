# @rumbelo/backend

NestJS 11 + Fastify + oRPC + MikroORM 6 + better-auth. **ESM** — every `@orpc/*`
package ships ESM only, so CommonJS is not an option here.

```bash
pnpm --filter @rumbelo/backend dev   # :3002
```

- `src/common/` — config, database primitives, tenancy, shared utils
- `src/modules/` — four products and two platform modules; see its README
- `src/auth/` — better-auth configuration (organization plugin = Household, 2FA)
- `src/banking/` — bank aggregation behind a port; null adapter by default
- `src/database/` — migrations and seeders

Migrations only; `schema:update` is never run against a database holding money.

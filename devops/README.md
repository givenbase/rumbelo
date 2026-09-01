# Deployment

## Local

```bash
pnpm infra:up      # Postgres + Redis in Docker
pnpm db:migrate    # apply migrations
pnpm dev           # all three apps
```

| App | Port | Purpose |
|-----|------|---------|
| `@rumbelo/application` | 3000 | the authenticated product |
| `@rumbelo/website` | 3001 | marketing site |
| `@rumbelo/backend` | 3002 | NestJS + oRPC API |

## Railway (EU)

Four services in one project, all in the **europe-west4 (Amsterdam)** region so
Dutch bank transaction data stays EU-resident under GDPR:

1. **postgres** — Railway Postgres plugin. Enable daily backups before real data lands.
2. **redis** — Railway Redis plugin.
3. **backend** — root directory `/`, start command `pnpm --filter @rumbelo/backend run start`.
4. **application** — root directory `/`, start command `pnpm --filter @rumbelo/application run start`.

Services reach each other over Railway's private network, so only `application`
and `website` need public domains. Set every variable from the root
`.env.example` (or `apps/backend/.env.example`) on the backend service;
bake `NEXT_PUBLIC_*` from `apps/application/.env.example` /
`apps/website/.env.example` into the Next builds. Use `DATABASE_SSL=true` in
production.

Estimated cost at the owner-plus-friends stage: roughly $5–10/month.

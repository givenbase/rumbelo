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

### Private vs public

```
Browser ──HTTPS──► Application (public)
                      │  /api/backend + /api/auth (server-only)
                      │  DOMAIN_BACK = http://backend.railway.internal:PORT
                      ▼
                   Backend
                      ├── Postgres (private)
                      └── Redis (private)
```

| Variable | Service | Value |
|----------|---------|-------|
| `DATABASE_URL` | Backend | `${{Postgres.DATABASE_URL}}` — must include `/dbname` path (do not assemble from host-only vars) |
| `DATABASE_SSL` | Backend | `true` |
| `DATABASE_SYNC` | Backend | `false` |
| `DATABASE_REDIS_URL` | Backend | `${{Redis.REDIS_URL}}` or plugin URL (`redis://` / `rediss://`) |
| `DOMAIN_BACK` | Backend + Application + Website (server) | `http://${{Backend.RAILWAY_PRIVATE_DOMAIN}}:${{Backend.PORT}}` |
| `DOMAIN_BACK_PUBLIC` | Backend | `https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}` |
| `NEXT_PUBLIC_DOMAIN_APP` | Application + Website (build) | Application public HTTPS |
| `NEXT_PUBLIC_DOMAIN_WEB` | Application + Website (build) | Website public HTTPS |
| `NEXT_PUBLIC_DOMAIN_BACK` | Application + Website (build) | Backend **public** HTTPS (optional links; not used by proxies) |

Private mesh uses **http + PORT** (no TLS). Public uses **https**. Browsers never call
`.railway.internal` — Application and Website Next servers reach Nest via `DOMAIN_BACK`
for `/api/auth` (and Application also for `/api/backend`). Browsers never see the private URL.

See `apps/backend/.env.example`, `apps/application/.env.example`, and
`apps/website/.env.example`. Use `DATABASE_SSL=true` and `DATABASE_SYNC=false`
in production.

Estimated cost at the owner-plus-friends stage: roughly $5–10/month.

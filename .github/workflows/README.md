# Rumbelo CI/CD (GitHub Actions)

**Repo:** [github.com/givenbase/rumbelo](https://github.com/givenbase/rumbelo)

Ported from Galighticus directions — **only what Rumbelo needs today**. No Docker image
build / single-app deploy / GHCR cleanup yet (no app Dockerfiles). Add those when images exist.

## GitHub Environments

Use **exactly two** under **Settings → Environments**:

| GitHub environment | Branch default | Backend `NODE_ENV` | Config source |
|--------------------|----------------|--------------------|---------------|
| `staging` | `dev` (when present) | `production` | staging secrets/vars |
| `production` | `main` | `production` | production secrets/vars |

Local `NODE_ENV=development` is **not** a GitHub environment. Do not create `dev` / `development` envs.

Resolution: [`.github/actions/resolve-deploy-environment`](../actions/resolve-deploy-environment/action.yml).

## Required keys (per environment)

Match `apps/backend/.env.example` and app `get-env.ts`:

| Key | Type | Used by |
|-----|------|---------|
| `DATABASE_URL` | secret | migrate |
| `BETTER_AUTH_SECRET` | secret | migrate / auth |
| `DOMAIN_APP` | var | migrate, e2e (public HTTPS) |
| `DOMAIN_WEB` | var | migrate (public HTTPS) |
| `DOMAIN_BACK` | var | migrate env validation |
| `DOMAIN_BACK_PUBLIC` | var | api-smoke, e2e (public Nest HTTPS; preferred over `DOMAIN_BACK` for probes) |
| `DATABASE_SSL` | var | optional (`true` on managed Postgres) |
| `E2E_*_EMAIL` / `E2E_*_PASSWORD` | secret | optional e2e (defaults = seed demos) |

### Sync from your machine (Galighticus pattern)

```bash
pnpm sync:github-secrets:init        # creates .env.github.*.{staging,production}
# fill real values in those four files (gitignored)
pnpm sync:github-secrets             # push both envs via gh CLI
pnpm sync:github-secrets:staging     # staging only
pnpm sync:github-secrets:production  # production only
```

Templates: `.env.github.secrets.example`, `.env.github.vars.example`. Script: `scripts/sync-github-secrets.js`.

CI runners are outside Railway’s private mesh — never point smoke/e2e at `*.railway.internal`.
On Railway, Application’s server-only `DOMAIN_BACK` is the private Nest URL for proxies.

## Workflows

| Workflow | Purpose |
|----------|---------|
| `db-migrate.yml` | MikroORM `db:push` + `auth:migrate` on remote DB; then API smoke |
| `api-smoke.yml` | `/health*` must not 5xx (strict ready after migrate) |
| `e2e-smoke.yml` | Playwright `@smoke` against staging application |

`db:push` / `db:seed` run via `tsx` scripts (not `@mikro-orm/cli`) so CI is not hit by the Node 22.22.3+ `yargonaut` / `require.cache` crash under `--import tsx/esm`. Workflows pin Node **22.22.2**.

Manual runs: **Actions** → pick workflow → choose `staging` or `production`.

Local smoke: `BACKEND_URL=https://… pnpm api:smoke`

## Intentionally omitted (for now)

- `docker-build.yml` / `deploy-single-app.yml` / `cleanup-packages.yml` — need Dockerfiles + GHCR org packages

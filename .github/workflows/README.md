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
| `DOMAIN_APP` | var | migrate, e2e |
| `DOMAIN_WEB` | var | migrate |
| `DOMAIN_BACK` | var | migrate, api-smoke, e2e |
| `DATABASE_SSL` | var | optional (`true` on managed Postgres) |
| `E2E_*_EMAIL` / `E2E_*_PASSWORD` | secret | optional e2e (defaults = seed demos) |

## Workflows

| Workflow | Purpose |
|----------|---------|
| `db-migrate.yml` | MikroORM `db:push` + `auth:migrate` on remote DB; then API smoke |
| `api-smoke.yml` | `/health*` must not 5xx (strict ready after migrate) |
| `e2e-smoke.yml` | Playwright `@smoke` against staging application |

Manual runs: **Actions** → pick workflow → choose `staging` or `production`.

Local smoke: `BACKEND_URL=https://… pnpm api:smoke`

## Intentionally omitted (for now)

- `docker-build.yml` / `deploy-single-app.yml` / `cleanup-packages.yml` — need Dockerfiles + GHCR org packages

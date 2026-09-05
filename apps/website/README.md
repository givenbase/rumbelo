# @rumbelo/website

Marketing site. Next.js 16, Tailwind v4.

Public acquisition lives here: sign-up, email verify, forgot / reset password.
Product CTAs after auth go to `NEXT_PUBLIC_DOMAIN_APP` (sign-in).

Shares the same token block as the application so the brand reads identically
across both.

```bash
pnpm --filter @rumbelo/website dev   # :3001
```

Railway: bake the three `NEXT_PUBLIC_DOMAIN_*` vars at build time. Also set
server-only `DOMAIN_BACK` (private Nest URL) so `/api/auth` can proxy Better Auth
— same pattern as Application.

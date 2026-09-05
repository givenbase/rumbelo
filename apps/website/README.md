# @rumbelo/website

Marketing site. Next.js 16, Tailwind v4, statically rendered.

Shares the same token block as the application so the brand reads identically
across both. Product CTAs use `NEXT_PUBLIC_DOMAIN_APP` (see `.env.example`).

```bash
pnpm --filter @rumbelo/website dev   # :3001
```

Railway: bake the three `NEXT_PUBLIC_DOMAIN_*` vars at build time. No private
`DOMAIN_BACK` — this app never talks to Nest.

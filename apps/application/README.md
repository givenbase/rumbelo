# @rumbelo/application

The authenticated product. Next.js 16 (App Router, Turbopack), React 19,
**Tailwind v4 only** — no CSS modules, no SCSS.

`app/globals.css` is the single stylesheet. It holds the `@tailwind` import and a
`@theme` block carrying the design tokens; everything else is utilities. Tokens
were extracted from the Claude Design source so the canvas and the build cannot drift.

Screens currently render from `lib/mock.ts`, whose shapes match the oRPC contract
exactly. Switching one to live data means replacing the mock import with
`useQuery(api.<domain>.<procedure>.queryOptions({ input }))`.

```bash
pnpm --filter @rumbelo/application dev   # :3000
```

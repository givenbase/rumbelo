/**
 * Alias entrypoint — prefer `drop-schema-cascade.ts`.
 * Kept so existing `pnpm db:drop` / `db:reset` callers keep working.
 */
import './drop-schema-cascade';

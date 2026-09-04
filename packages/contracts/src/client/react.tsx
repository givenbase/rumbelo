/**
 * React helpers for oRPC — Galighticus-style.
 *
 * Apps own a module-level `createClient` singleton (`app/_lib/api.ts`) and
 * `createAPIUtils(client)`. This package only provides the utils factory.
 * QueryClientProvider lives in the app (not an ApiProvider that owns the client).
 */

'use client';

import { createTanstackQueryUtils } from '@orpc/tanstack-query';

import type { AppClient } from './index';

/**
 * TanStack Query option factories for a client (`queryOptions` / `mutationOptions`).
 * Call once per app with the shared client singleton.
 */
export function createAPIUtils(client: AppClient) {
    return createTanstackQueryUtils(client);
}

export type APIUtils = ReturnType<typeof createAPIUtils>;

/**
 * Better Auth API Route Handler — proxies to the Nest backend via @rumbelo/utils.
 *
 * Same-origin `/api/auth` so session cookies bind to DOMAIN_APP (Galighticus pattern).
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { createBetterAuthRouteHandlers } from '@rumbelo/utils';

import { env } from '@/app/_utils/get-env';

export const { DELETE, GET, PATCH, POST, PUT } = createBetterAuthRouteHandlers({
    backendUrl: env.NEXT_PUBLIC_DOMAIN_BACK,
});

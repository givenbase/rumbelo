/**
 * Better Auth API Route Handler — proxies to Nest (Galighticus pattern).
 * Cookies bind to DOMAIN_WEB for sign-up / verify / reset flows.
 */

import { createBetterAuthRouteHandlers } from '@rumbelo/utils';

import { env } from '@/lib/get-env';

export const { DELETE, GET, PATCH, POST, PUT } = createBetterAuthRouteHandlers({
    backendUrl: env.DOMAIN_BACK,
});

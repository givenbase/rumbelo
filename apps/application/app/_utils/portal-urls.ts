import {
    BACKEND_AUTH_PATH,
    BACKEND_RPC_PROXY_PATH,
    joinBackendOrigin,
} from '@/app/_utils/backend-paths';
import { env } from '@/app/_utils/get-env';

/**
 * oRPC via same-origin proxy — `{DOMAIN_APP}/api/backend` → Nest.
 * Prefer `api` from `@/app/_lib/api` (uses window.origin in the browser).
 */
export function backendRpcUrl(): string {
    return joinBackendOrigin(env.NEXT_PUBLIC_DOMAIN_APP, BACKEND_RPC_PROXY_PATH);
}

/**
 * Nest Better Auth mount on the **public** Nest origin.
 * Browser clients should use DOMAIN_APP + `/api/auth` (Next proxy), not this URL.
 */
export function backendAuthUrl(): string {
    return joinBackendOrigin(env.NEXT_PUBLIC_DOMAIN_BACK, BACKEND_AUTH_PATH);
}

export function portalDomains() {
    return {
        app: env.NEXT_PUBLIC_DOMAIN_APP,
        web: env.NEXT_PUBLIC_DOMAIN_WEB,
        /** Nest public origin — not the private proxy target. */
        back: env.NEXT_PUBLIC_DOMAIN_BACK,
    };
}

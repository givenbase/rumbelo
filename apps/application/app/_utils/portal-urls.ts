import {
    BACKEND_AUTH_PATH,
    BACKEND_RPC_PATH,
    joinBackendOrigin,
} from '@/app/_utils/backend-paths';
import { env } from '@/app/_utils/get-env';

/** oRPC — `{DOMAIN_BACK}/rpc` */
export function backendRpcUrl(): string {
    return joinBackendOrigin(env.NEXT_PUBLIC_DOMAIN_BACK, BACKEND_RPC_PATH);
}

/** Better Auth — `{DOMAIN_BACK}/api/auth` */
export function backendAuthUrl(): string {
    return joinBackendOrigin(env.NEXT_PUBLIC_DOMAIN_BACK, BACKEND_AUTH_PATH);
}

export function portalDomains() {
    return {
        app: env.NEXT_PUBLIC_DOMAIN_APP,
        web: env.NEXT_PUBLIC_DOMAIN_WEB,
        back: env.NEXT_PUBLIC_DOMAIN_BACK,
    };
}

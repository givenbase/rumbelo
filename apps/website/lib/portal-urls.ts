import { env } from '@/lib/get-env';

function joinOrigin(origin: string, path: string): string {
    const base = origin.replace(/\/$/, '');
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${base}${suffix}`;
}

/** Product app origin. */
export function appOrigin(): string {
    return env.NEXT_PUBLIC_DOMAIN_APP.replace(/\/$/, '');
}

/** Marketing site origin. */
export function webOrigin(): string {
    return env.NEXT_PUBLIC_DOMAIN_WEB.replace(/\/$/, '');
}

/** Product sign-in. */
export function appSignInUrl(query?: Record<string, string>): string {
    const url = new URL('/sign-in', `${appOrigin()}/`);
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.set(key, value);
        }
    }
    return url.toString();
}

/** Local marketing sign-up (same origin). */
export function webSignUpPath(): string {
    return '/sign-up';
}

/** Post-verify / post-reset landing on the product. */
export function appSignInAfterAuthUrl(): string {
    return appSignInUrl({ verified: '1' });
}

export function portalDomains() {
    return {
        app: env.NEXT_PUBLIC_DOMAIN_APP,
        web: env.NEXT_PUBLIC_DOMAIN_WEB,
        back: env.NEXT_PUBLIC_DOMAIN_BACK,
    };
}

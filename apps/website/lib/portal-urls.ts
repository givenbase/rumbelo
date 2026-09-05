import { env } from '@/lib/get-env';

function joinOrigin(origin: string, path: string): string {
    const base = origin.replace(/\/$/, '');
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${base}${suffix}`;
}

/** Product app origin (user-facing). */
export function appOrigin(): string {
    return env.NEXT_PUBLIC_DOMAIN_APP.replace(/\/$/, '');
}

export function appSignInUrl(): string {
    return joinOrigin(env.NEXT_PUBLIC_DOMAIN_APP, '/sign-in');
}

export function appSignUpUrl(): string {
    return joinOrigin(env.NEXT_PUBLIC_DOMAIN_APP, '/sign-up');
}

export function portalDomains() {
    return {
        app: env.NEXT_PUBLIC_DOMAIN_APP,
        web: env.NEXT_PUBLIC_DOMAIN_WEB,
        back: env.NEXT_PUBLIC_DOMAIN_BACK,
    };
}

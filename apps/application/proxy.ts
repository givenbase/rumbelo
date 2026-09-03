import { type NextRequest, NextResponse } from 'next/server';

import { getSessionCookie } from 'better-auth/cookies';

/**
 * Next.js 16 Proxy with Better Auth (cookie existence only).
 *
 * Per Better Auth:
 * - Uses getSessionCookie() for fast, optimistic session checks
 * - Does NOT validate the session (only checks cookie existence)
 * - Actual session validation happens server-side / via auth.api.getSession
 *
 * Cookie prefix must match backend `advanced.cookiePrefix` (`rumbelo`).
 *
 * @see https://www.better-auth.com/docs/integrations/next#auth-protection
 */

const AUTH_COOKIE_PREFIX = 'rumbelo';

export async function proxy(request: NextRequest) {
    // Design preview: allow browsing without a session (fixtures only).
    if (process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true') {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request, {
        cookiePrefix: AUTH_COOKIE_PREFIX,
    });
    const hasSession = !!sessionCookie;

    const pathname = request.nextUrl.pathname;

    const isAuthRoute =
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    const isSystemRoute = pathname.startsWith('/api/') || pathname.startsWith('/_next/');

    const isProtectedRoute = !isAuthRoute && !isSystemRoute;

    if (!hasSession && isProtectedRoute) {
        const signInUrl = new URL('/sign-in', request.url);
        if (pathname !== '/') {
            signInUrl.searchParams.set('redirectTo', pathname);
        }
        return NextResponse.redirect(signInUrl);
    }

    if (hasSession && isAuthRoute) {
        const redirectTo = request.nextUrl.searchParams.get('redirectTo');
        const target =
            redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
                ? redirectTo
                : '/';
        return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

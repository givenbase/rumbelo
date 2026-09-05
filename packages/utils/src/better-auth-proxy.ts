import { rewriteBetterAuthSetCookie } from './better-auth-proxy-cookies';

export type BetterAuthProxyOptions = {
    backendUrl?: string;
    logLabel?: string;
};

function resolveBackendUrl(backendUrl?: string): string {
    return (
        backendUrl ??
        process.env.DOMAIN_BACK ??
        process.env.NEXT_PUBLIC_DOMAIN_BACK ??
        'http://localhost:3002'
    );
}

/**
 * Proxy a Better Auth request from a Next.js app to the Nest backend API.
 * Preserves cookies and rewrites Set-Cookie for local dev vs production.
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */
export async function proxyBetterAuthRequest(
    request: Request,
    options?: BetterAuthProxyOptions
): Promise<Response> {
    const backendUrl = resolveBackendUrl(options?.backendUrl);
    const logLabel = options?.logLabel ?? 'Auth Proxy';
    const url = new URL(request.url);
    const backendPath = `${backendUrl.replace(/\/$/, '')}${url.pathname}${url.search}`;

    const requestHeaders = new Headers(request.headers);

    const origin = request.headers.get('origin');
    if (origin) {
        requestHeaders.set('origin', origin);
    }

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
        requestHeaders.set('cookie', cookieHeader);
    }

    let response: Response;

    try {
        response = await fetch(backendPath, {
            body:
                request.method !== 'GET' && request.method !== 'HEAD'
                    ? await request.arrayBuffer()
                    : undefined,
            credentials: 'include',
            headers: Object.fromEntries(requestHeaders.entries()),
            method: request.method,
        });
    } catch (error) {
        const isConnectionRefused =
            error instanceof Error &&
            'cause' in error &&
            (error.cause as { code?: string })?.code === 'ECONNREFUSED';

        const message = isConnectionRefused
            ? `Backend service is unavailable. Could not connect to ${backendUrl}. Make sure the backend server is running.`
            : `Auth proxy request failed: ${error instanceof Error ? error.message : String(error)}`;

        console.error(`[${logLabel}] Proxy fetch failed:`, { message, path: url.pathname });

        return Response.json({ error: message, status: 503 }, { status: 503 });
    }

    const responseBody = await response.arrayBuffer();

    const setCookieHeaders: string[] = [];
    response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
            setCookieHeaders.push(value);
        }
    });

    // Strip encoding headers: Node.js fetch auto-decompresses gzip/brotli, so forwarding
    // Content-Encoding causes the browser to attempt a second decompression.
    const STRIP_HEADERS = new Set([
        'set-cookie',
        'content-encoding',
        'transfer-encoding',
        'content-length',
    ]);

    const responseHeaders = new Headers();

    response.headers.forEach((value, key) => {
        if (!STRIP_HEADERS.has(key.toLowerCase())) {
            responseHeaders.set(key, value);
        }
    });

    for (const cookieValue of setCookieHeaders) {
        responseHeaders.append('set-cookie', rewriteBetterAuthSetCookie(cookieValue));
    }

    if (response.status >= 400) {
        console.error(`[${logLabel}] Error response:`, {
            hasSetCookie: setCookieHeaders.length > 0,
            path: url.pathname,
            status: response.status,
        });
    }

    return new Response(responseBody, {
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText,
    });
}

/** Next.js App Router handlers for `/api/auth/[...all]`. */
export function createBetterAuthRouteHandlers(options?: BetterAuthProxyOptions) {
    const proxy = (request: Request) => proxyBetterAuthRequest(request, options);

    return {
        DELETE: proxy,
        GET: proxy,
        PATCH: proxy,
        POST: proxy,
        PUT: proxy,
    };
}

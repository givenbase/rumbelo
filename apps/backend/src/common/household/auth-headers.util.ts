import type { FastifyRequest } from 'fastify';

type Req = FastifyRequest & { headers: Record<string, string | string[] | undefined> };

export function toAuthHeaders(
    req: Req,
    appUrl = process.env.DOMAIN_APP ?? 'http://localhost:3000'
): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    if (!headers.has('origin')) headers.set('origin', appUrl);
    return headers;
}

import type { FastifyRequest } from 'fastify';

type Req = FastifyRequest & { headers: Record<string, string | string[] | undefined> };

export function toAuthHeaders(
    req: Req,
    appUrl = process.env.APP_URL ?? 'http://localhost:3000'
): Headers {
    const h = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        h.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    if (!h.has('origin')) h.set('origin', appUrl);
    return h;
}

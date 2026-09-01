import type { FastifyReply, FastifyRequest } from 'fastify';

import { ForbiddenException, Injectable, type NestMiddleware } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';

import { toAuthHeaders } from './auth-headers.util.js';
import { MembershipService } from './membership.service.js';
import { tenantStorage, authHeadersStorage, type TenantContext } from './tenant.context.js';

type Req = FastifyRequest & {
    user?: { id: string } | null;
    session?: Awaited<ReturnType<AuthService['api']['getSession']>> | null;
    rumbeloTenant?: TenantContext;
    rumbeloAuthHeaders?: Headers;
};

/**
 * Establishes the tenant scope for the request.
 *
 * Runs as middleware (before guards) so we resolve the better-auth session here —
 * AuthGuard attaches the same fields later for controllers.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        private readonly membership: MembershipService,
        private readonly authService: AuthService
    ) {}

    async use(req: Req, _res: FastifyReply, next: (err?: unknown) => void): Promise<void> {
        if (!req.user) {
            const session = await this.authService.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });
            req.session = session;
            req.user = session?.user ?? null;
        }

        const userId = req.user?.id;
        if (!userId) throw new ForbiddenException('Not authenticated');

        const url = req.url ?? '';
        const pathname = url.split('?')[0] ?? '';
        const isOnboard =
            pathname.endsWith('/household/onboard') || pathname === '/household/onboard';

        const householdId = resolveHouseholdId(req);

        if (!householdId && isOnboard) {
            const ctx: TenantContext = { userId, householdId: null, role: 'OWNER' };
            const headers = toAuthHeaders(req);
            req.rumbeloTenant = ctx;
            req.rumbeloAuthHeaders = headers;
            tenantStorage.run(ctx, () => authHeadersStorage.run(headers, () => next()));
            return;
        }

        if (!householdId) throw new ForbiddenException('No household selected');

        const role = await this.membership.roleFor(userId, householdId);
        if (!role) throw new ForbiddenException('Not a member of this household');

        const ctx: TenantContext = { userId, householdId, role };
        const headers = toAuthHeaders(req);
        req.rumbeloTenant = ctx;
        req.rumbeloAuthHeaders = headers;
        tenantStorage.run(ctx, () => authHeadersStorage.run(headers, () => next()));
    }
}

/** Explicit header wins, then the oRPC input body, then the session's active org. */
function resolveHouseholdId(req: Req): string | null {
    const header = req.headers['x-household-id'];
    if (typeof header === 'string' && header.length > 0) return header;

    const body = req.body as { householdId?: string } | undefined;
    if (body?.householdId) return body.householdId;

    const activeOrg = (req.session?.session as { activeOrganizationId?: string | null } | undefined)
        ?.activeOrganizationId;
    return activeOrg ?? null;
}

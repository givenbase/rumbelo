import type { FastifyRequest } from 'fastify';

import {
    ForbiddenException,
    Injectable,
    type CallHandler,
    type ExecutionContext,
    type NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Observable } from 'rxjs';

import { toAuthHeaders } from './auth-headers.util.js';
import { MembershipService } from './membership.service.js';
import { authHeadersStorage, tenantStorage, type TenantContext } from './tenant.context.js';

type Req = FastifyRequest & {
    user?: { id: string } | null;
    session?: Awaited<ReturnType<AuthService['api']['getSession']>> | null;
};

/**
 * Resolves tenant scope at oRPC handler time (when req.url is the real route path).
 * Middleware runs too early in Fastify/Nest and sees req.url as `/`.
 */
@Injectable()
export class TenantOrpcInterceptor implements NestInterceptor {
    constructor(
        private readonly membership: MembershipService,
        private readonly authService: AuthService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest<Req>();
        const pathname = (req.url ?? '').split('?')[0] ?? '';
        if (pathname.startsWith('/api/auth')) return next.handle();

        return new Observable(subscriber => {
            void this.resolve(req)
                .then(({ ctx, headers }) => {
                    tenantStorage.run(ctx, () => {
                        authHeadersStorage.run(headers, () => {
                            next.handle().subscribe(subscriber);
                        });
                    });
                })
                .catch(err => subscriber.error(err));
        });
    }

    private async resolve(req: Req): Promise<{ ctx: TenantContext; headers: Headers }> {
        if (!req.user) {
            const session = await this.authService.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });
            req.session = session;
            req.user = session?.user ?? null;
        }

        const userId = req.user?.id;
        if (!userId) throw new ForbiddenException('Not authenticated');

        const pathname = (req.url ?? '').split('?')[0] ?? '';
        const isOnboard = pathname.endsWith('/household/onboard');

        const householdId = resolveHouseholdId(req);
        const headers = toAuthHeaders(req);

        if (!householdId && isOnboard) {
            return { ctx: { userId, householdId: null, role: 'OWNER' }, headers };
        }

        if (!householdId) throw new ForbiddenException('No household selected');

        const role = await this.membership.roleFor(userId, householdId);
        if (!role) throw new ForbiddenException('Not a member of this household');

        return { ctx: { userId, householdId, role }, headers };
    }
}

function resolveHouseholdId(req: Req): string | null {
    const header = req.headers['x-household-id'];
    if (typeof header === 'string' && header.length > 0) return header;

    const body = req.body as { householdId?: string } | undefined;
    if (body?.householdId) return body.householdId;

    const activeOrg = (req.session?.session as { activeOrganizationId?: string | null } | undefined)
        ?.activeOrganizationId;
    return activeOrg ?? null;
}

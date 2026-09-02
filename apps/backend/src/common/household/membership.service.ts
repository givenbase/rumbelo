import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import type { HouseholdContext } from './household.context.js';

/**
 * Membership lives in better-auth's organization tables, which better-auth owns
 * and migrates. We read them directly rather than mapping MikroORM entities over
 * them, so there is exactly one writer for auth state.
 */
@Injectable()
export class MembershipService {
    constructor(private readonly em: EntityManager) {}

    async roleFor(userId: string, householdId: string): Promise<HouseholdContext['role'] | null> {
        const rows = await this.em
            .getConnection()
            .execute<{ role: string }[]>(
                `SELECT role FROM public."member" WHERE "userId" = ? AND "organizationId" = ? LIMIT 1`,
                [userId, householdId]
            );
        const raw = rows[0]?.role;
        if (!raw) return null;

        switch (raw.toLowerCase()) {
            case 'owner':
            case 'admin':
                return 'OWNER';
            case 'partner':
            case 'member':
                return 'PARTNER';
            case 'viewer':
                return 'VIEWER';
            default:
                return 'VIEWER';
        }
    }
}

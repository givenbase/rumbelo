import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import type { HouseholdContext } from './household.context';

import { AuthMember } from '../../modules/auth/better-auth/member/auth-member.entity';

/**
 * Membership lives in better-auth's organization tables, which better-auth owns,
 * writes and migrates. The AuthMember entity maps that table read-only, so auth
 * state keeps exactly one writer.
 */
@Injectable()
export class MembershipService {
    constructor(private readonly em: EntityManager) {}

    async roleFor(userId: string, householdId: string): Promise<HouseholdContext['role'] | null> {
        const membership = await this.em.findOne(AuthMember, {
            user: userId,
            organization: householdId,
        });
        if (!membership) return null;

        switch (membership.role.toLowerCase()) {
            case 'owner':
            case 'admin':
                return 'OWNER';
            case 'member':
                return 'MEMBER';
            case 'viewer':
            default:
                return 'VIEWER';
        }
    }
}

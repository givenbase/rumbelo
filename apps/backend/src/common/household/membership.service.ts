import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import type { HouseholdContext } from './household.context';

import { AuthMember } from '../../modules/auth/household/managed/member/auth-member.entity';

/**
 * Membership lives in better-auth's household table (organization plugin,
 * modelName: household). better-auth owns writes; AuthMember is read-only.
 */
@Injectable()
export class MembershipService {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async roleFor(userId: string, householdId: string): Promise<HouseholdContext['role'] | null> {
        const membership = await this.em.findOne(AuthMember, {
            user: userId,
            household: householdId,
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

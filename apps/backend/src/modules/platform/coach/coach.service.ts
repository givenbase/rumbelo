import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../common/household/household-scoped.repository';
import { CoachMessage } from './coach-message.entity';

@Injectable()
export class CoachService {
    private readonly repo: HouseholdScopedRepository<CoachMessage>;
    constructor(private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, CoachMessage);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async feed(period: string) {
        const rows = await this.repo.find(
            { period, dismissedAt: null },
            { orderBy: { createdAt: 'DESC' }, limit: 20 }
        );
        return rows.map(m => ({
            id: m.id,
            householdId: m.householdId,
            period: m.period,
            kind: m.kind,
            text: m.text,
            ctaLabel: m.ctaLabel,
            ctaHref: m.ctaHref,
            dismissedAt: m.dismissedAt?.toISOString() ?? null,
            createdAt: m.createdAt.toISOString(),
        }));
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async dismiss(id: string) {
        const message = await this.repo.findOneOrFail({ id });
        message.dismissedAt = new Date();
        await this.em.flush();
    }
}

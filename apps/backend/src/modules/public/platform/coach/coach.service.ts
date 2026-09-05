import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../common/household/household-scoped.repository';
import { CoachMessage } from './coach-message.entity';

@Injectable()
export class CoachService {
    private readonly repo: HouseholdScopedRepository<CoachMessage>;
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
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
        return rows.map(message => ({
            id: message.id,
            householdId: message.householdId,
            period: message.period,
            kind: message.kind,
            text: message.text,
            ctaLabel: message.ctaLabel,
            ctaHref: message.ctaHref,
            dismissedAt: message.dismissedAt?.toISOString() ?? null,
            createdAt: message.createdAt.toISOString(),
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

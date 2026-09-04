import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../common/household/household-scoped.repository';
import { IncomeMilestone } from './milestone.entity';

@Injectable()
export class MilestoneService {
    private readonly repo: HouseholdScopedRepository<IncomeMilestone>;
    constructor(private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, IncomeMilestone);
    }

    async list() {
        const rows = await this.repo.find();
        return rows.map(m => ({
            id: m.id,
            householdId: m.householdId,
            label: m.label,
            targetMonthly: Number(m.targetMonthly),
            reachedOn: m.reachedOn,
        }));
    }
}

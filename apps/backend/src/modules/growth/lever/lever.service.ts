import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../common/household/household-scoped.repository.js';
import { IncomeLever } from './lever.entity.js';

/** Things that move earning power. A Growth surface, not a budget line. */
@Injectable()
export class LeverService {
    private readonly repo: HouseholdScopedRepository<IncomeLever>;
    constructor(private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, IncomeLever);
    }

    async list() {
        const rows = await this.repo.find();
        return rows.map(l => ({
            id: l.id,
            householdId: l.householdId,
            label: l.label,
            note: l.note,
            potentialMonthly: Number(l.potentialMonthly),
            done: l.done,
        }));
    }
}

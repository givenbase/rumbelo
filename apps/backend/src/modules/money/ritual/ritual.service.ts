import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentHouseholdId } from '../../../common/tenancy/tenant.context.js';
import { Jar } from '../jar/entities/index.js';
import { RitualAllocation, WeeklyRitual } from './entities/index.js';

@Injectable()
export class RitualService {
    private readonly rituals: ScopedRepository<WeeklyRitual>;
    private readonly allocations: ScopedRepository<RitualAllocation>;

    constructor(private readonly em: EntityManager) {
        this.rituals = new ScopedRepository(em, WeeklyRitual);
        this.allocations = new ScopedRepository(em, RitualAllocation);
    }

    async advance(input: {
        week: string;
        stage: 'LOOK' | 'REDIRECT' | 'INTEND' | 'DONE';
        allocations?: { jarId: string; amount: number }[];
        intention?: string;
    }) {
        let ritual = await this.rituals.findOne({ week: input.week });
        if (!ritual) {
            ritual = this.em.create(WeeklyRitual, {
                householdId: currentHouseholdId(),
                week: input.week,
            } as never);
            await this.em.persistAndFlush(ritual);
        }

        ritual.stage = input.stage as never;
        if (input.intention !== undefined) ritual.intention = input.intention;
        if (input.stage === 'DONE') ritual.completedAt = new Date();
        if (input.allocations?.length) {
            ritual.surplus = input.allocations.reduce((sum, a) => sum + a.amount, 0);
            await this.em.nativeDelete(RitualAllocation, { ritual: ritual.id });
            for (const a of input.allocations) {
                this.em.create(RitualAllocation, {
                    householdId: currentHouseholdId(),
                    ritual,
                    jar: this.em.getReference(Jar, a.jarId),
                    amount: a.amount,
                } as never);
            }
        }

        await this.em.flush();
        return this.toDto(ritual);
    }

    /** Created lazily: opening the ritual screen is what starts the week's ritual. */
    async current(week: string) {
        let ritual = await this.rituals.findOne({ week });
        if (!ritual) {
            ritual = this.em.create(WeeklyRitual, {
                householdId: currentHouseholdId(),
                week,
            } as never);
            await this.em.persistAndFlush(ritual);
        }
        return this.toDto(ritual);
    }

    async history() {
        const rows = await this.rituals.find({}, { orderBy: { week: 'DESC' }, limit: 26 });
        return Promise.all(rows.map(r => this.toDto(r)));
    }

    private async toDto(ritual: WeeklyRitual) {
        const allocations = await this.allocations.find({ ritual: ritual.id });
        return {
            id: ritual.id,
            householdId: ritual.householdId,
            week: ritual.week,
            stage: ritual.stage,
            surplus: Number(ritual.surplus),
            allocations: allocations.map(a => ({ jarId: a.jar.id, amount: Number(a.amount) })),
            intention: ritual.intention,
            completedAt: ritual.completedAt?.toISOString() ?? null,
        };
    }
}

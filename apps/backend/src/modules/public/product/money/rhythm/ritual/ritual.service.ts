import { RitualStage } from '@rumbelo/contracts';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { Jar } from '../../plan/jar/jar.entity';
import { RitualAllocation } from './ritual-allocation.entity';
import { WeeklyRitual } from './weekly-ritual.entity';

@Injectable()
export class RitualService {
    private readonly rituals: HouseholdScopedRepository<WeeklyRitual>;
    private readonly allocations: HouseholdScopedRepository<RitualAllocation>;

    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
        this.rituals = new HouseholdScopedRepository(em, WeeklyRitual);
        this.allocations = new HouseholdScopedRepository(em, RitualAllocation);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Created lazily: opening the ritual screen is what starts the week's ritual. */
    async current(week: string) {
        let ritual = await this.rituals.findOne({ week });
        if (!ritual) {
            ritual = this.em.create(WeeklyRitual, {
                householdId: currentHouseholdId(),
                week,
            } as never);
            await this.em.persist(ritual).flush();
        }
        return this.toDto(ritual);
    }

    async history() {
        const rows = await this.rituals.find({}, { orderBy: { week: 'DESC' }, limit: 26 });
        return Promise.all(rows.map(ritual => this.toDto(ritual)));
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async advance(input: {
        week: string;
        stage: RitualStage;
        allocations?: { jarId: string; amount: number }[];
        intention?: string;
    }) {
        let ritual = await this.rituals.findOne({ week: input.week });
        if (!ritual) {
            ritual = this.em.create(WeeklyRitual, {
                householdId: currentHouseholdId(),
                week: input.week,
            } as never);
            await this.em.persist(ritual).flush();
        }

        ritual.stage = input.stage;
        if (input.intention !== undefined) ritual.intention = input.intention;
        if (input.stage === RitualStage.DONE) ritual.completedAt = new Date();
        if (input.allocations?.length) {
            ritual.surplus = input.allocations.reduce(
                (sum, allocation) => sum + allocation.amount,
                0
            );
            await this.em.nativeDelete(RitualAllocation, { ritual: ritual.id });
            for (const allocation of input.allocations) {
                this.em.create(RitualAllocation, {
                    householdId: currentHouseholdId(),
                    ritual,
                    jar: this.em.getReference(Jar, allocation.jarId),
                    amount: allocation.amount,
                } as never);
            }
        }

        await this.em.flush();
        return this.toDto(ritual);
    }

    // Private

    private async toDto(ritual: WeeklyRitual) {
        const allocations = await this.allocations.find({ ritual: ritual.id });
        return {
            id: ritual.id,
            householdId: ritual.householdId,
            week: ritual.week,
            stage: ritual.stage,
            surplus: Number(ritual.surplus),
            allocations: allocations.map(allocation => ({
                jarId: allocation.jar.id,
                amount: Number(allocation.amount),
            })),
            intention: ritual.intention,
            completedAt: ritual.completedAt?.toISOString() ?? null,
        };
    }
}

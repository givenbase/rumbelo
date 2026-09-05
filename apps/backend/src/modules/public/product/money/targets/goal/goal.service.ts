import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { Jar } from '../../plan/jar/jar.entity';
import { GoalStatus } from '@rumbelo/contracts';

import { Goal } from './goal.entity';

@Injectable()
export class GoalService {
    private readonly repo: HouseholdScopedRepository<Goal>;
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, Goal);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        jarId?: string | null;
        name: string;
        icon?: string | null;
        target: number;
        monthlyContribution?: number;
        targetOn?: string | null;
        status?: string;
        why?: string | null;
    }) {
        const entity = this.em.create(Goal, {
            householdId: currentHouseholdId(),
            jar: input.jarId ? this.em.getReference(Jar, input.jarId) : null,
            name: input.name,
            icon: input.icon ?? null,
            target: input.target,
            saved: 0,
            monthlyContribution: input.monthlyContribution ?? 0,
            targetOn: input.targetOn ?? null,
            status: (input.status as GoalStatus) ?? GoalStatus.ACTIVE,
            why: input.why ?? null,
        } as never);
        await this.em.persist(entity).flush();
        return toDto(entity);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list() {
        const rows = await this.repo.find({ status: GoalStatus.ACTIVE });
        return rows.map(toDto);
    }

    /** Straight-line projection at the current contribution rate. */
    async projections() {
        const rows = await this.repo.find({ status: GoalStatus.ACTIVE });
        return rows.map(goal => {
            const remaining = Number(goal.target) - Number(goal.saved);
            const monthly = Number(goal.monthlyContribution);
            const months = monthly > 0 ? Math.ceil(remaining / monthly) : null;

            const projectedDate = months === null ? null : addMonths(new Date(), months);
            const onTrack =
                goal.targetOn === null || projectedDate === null
                    ? monthly > 0
                    : projectedDate <= goal.targetOn;

            // What the monthly contribution would need to be to hit a stated deadline.
            const shortfall =
                goal.targetOn && monthly >= 0
                    ? Math.max(
                          0,
                          Math.ceil(remaining / Math.max(1, monthsUntil(goal.targetOn))) - monthly
                      )
                    : 0;

            return {
                goalId: goal.id,
                projectedDate,
                monthsRemaining: months,
                onTrack,
                shortfallPerMonth: shortfall,
            };
        });
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        id: string,
        patch: Partial<{
            jarId: string | null;
            name: string;
            icon: string | null;
            target: number;
            saved: number;
            monthlyContribution: number;
            targetOn: string | null;
            status: string;
            why: string | null;
        }>
    ) {
        const entity = await this.repo.findOneOrFail({ id });
        if (patch.jarId !== undefined) {
            entity.jar = patch.jarId ? this.em.getReference(Jar, patch.jarId) : null;
        }
        if (patch.name !== undefined) entity.name = patch.name;
        if (patch.icon !== undefined) entity.icon = patch.icon;
        if (patch.target !== undefined) entity.target = patch.target;
        if (patch.saved !== undefined) entity.saved = patch.saved;
        if (patch.monthlyContribution !== undefined) {
            entity.monthlyContribution = patch.monthlyContribution;
        }
        if (patch.targetOn !== undefined) entity.targetOn = patch.targetOn;
        if (patch.status !== undefined) entity.status = patch.status as GoalStatus;
        if (patch.why !== undefined) entity.why = patch.why;
        await this.em.flush();
        return toDto(entity);
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    async remove(id: string) {
        const entity = await this.repo.findOneOrFail({ id });
        await this.em.remove(entity).flush();
        return { ok: true as const };
    }
}

function addMonths(from: Date, months: number): string {
    const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + months, 1));
    return date.toISOString().slice(0, 10);
}

function monthsUntil(isoDate: string): number {
    const target = new Date(isoDate);
    const now = new Date();
    return Math.max(
        1,
        (target.getUTCFullYear() - now.getUTCFullYear()) * 12 +
            (target.getUTCMonth() - now.getUTCMonth())
    );
}

export function toDto(goal: Goal) {
    return {
        id: goal.id,
        householdId: goal.householdId,
        jarId: goal.jar?.id ?? null,
        name: goal.name,
        icon: goal.icon,
        target: Number(goal.target),
        saved: Number(goal.saved),
        monthlyContribution: Number(goal.monthlyContribution),
        targetOn: goal.targetOn,
        status: goal.status,
        why: goal.why,
    };
}

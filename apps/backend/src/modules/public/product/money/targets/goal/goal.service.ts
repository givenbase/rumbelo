import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { CAPABILITIES, GoalKind, GoalStatus } from '@rumbelo/contracts';
import { earnGoalProgress } from '@rumbelo/utils';

import { PlanAccessService } from '../../../../../../common/capability';
import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { Jar } from '../../plan/jar/jar.entity';
import { JarService } from '../../plan/jar/jar.service';

import { Goal } from './goal.entity';

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class GoalService {
    private readonly repo: HouseholdScopedRepository<Goal>;
    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(PlanAccessService) private readonly planAccess: PlanAccessService,
        @Inject(JarService) private readonly jars: JarService
    ) {
        this.repo = new HouseholdScopedRepository(em, Goal);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        kind?: string;
        jarId?: string | null;
        name: string;
        icon?: string | null;
        target: number;
        monthlyContribution?: number;
        targetOn?: string | null;
        status?: string;
        why?: string | null;
    }) {
        await this.planAccess.assertCapability(CAPABILITIES.growthGoals);
        const occupied = await this.repo.count({ status: GoalStatus.ACTIVE });
        await this.planAccess.assertWithinLimit('maxGoals', occupied);

        const kind = (input.kind as GoalKind) ?? GoalKind.SAVE;
        const entity = this.em.create(Goal, {
            household: currentHouseholdId(),
            kind,
            jar:
                kind === GoalKind.EARN
                    ? null
                    : input.jarId
                      ? this.em.getReference(Jar, input.jarId)
                      : null,
            name: input.name,
            icon: input.icon ?? null,
            target: input.target,
            saved: 0,
            monthlyContribution: kind === GoalKind.EARN ? 0 : (input.monthlyContribution ?? 0),
            targetOn: input.targetOn ?? null,
            fulfilledOn: null,
            status: (input.status as GoalStatus) ?? GoalStatus.ACTIVE,
            why: input.why ?? null,
        } as never);
        await this.em.persist(entity).flush();
        if (kind === GoalKind.EARN) {
            await this.evaluateEarnGoals();
            await this.em.refresh(entity);
        }
        return toDto(entity);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list() {
        await this.evaluateEarnGoals();
        const rows = await this.repo.find({
            status: { $in: [GoalStatus.ACTIVE, GoalStatus.REACHED] },
        });
        return rows.map(toDto);
    }

    /** Straight-line projection at the current contribution rate (SAVE); EARN uses net progress. */
    async projections() {
        await this.evaluateEarnGoals();
        const rows = await this.repo.find({ status: GoalStatus.ACTIVE });
        const net = await this.jars.monthlyNetIncome();

        return rows.map(goal => {
            if (goal.kind === GoalKind.EARN) {
                const progress = earnGoalProgress({
                    target: Number(goal.target),
                    currentNet: net,
                });
                return {
                    goalId: goal.id,
                    projectedDate: null,
                    monthsRemaining: null,
                    onTrack: progress.reached || progress.current > 0,
                    shortfallPerMonth: progress.remaining,
                };
            }

            const remaining = Number(goal.target) - Number(goal.saved);
            const monthly = Number(goal.monthlyContribution);
            const months = monthly > 0 ? Math.ceil(remaining / monthly) : null;

            const projectedDate = months === null ? null : addMonths(new Date(), months);
            const onTrack =
                goal.targetOn === null || projectedDate === null
                    ? monthly > 0
                    : projectedDate <= goal.targetOn;

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

    /**
     * Mark ACTIVE EARN goals REACHED when household monthly net >= target.
     * Idempotent — safe to call from income writes and goal list.
     */
    async evaluateEarnGoals(): Promise<void> {
        const earnGoals = await this.repo.find({
            kind: GoalKind.EARN,
            status: GoalStatus.ACTIVE,
        });
        if (earnGoals.length === 0) return;

        const net = await this.jars.monthlyNetIncome();
        let changed = false;
        for (const goal of earnGoals) {
            if (earnGoalProgress({ target: Number(goal.target), currentNet: net }).reached) {
                goal.status = GoalStatus.REACHED;
                goal.fulfilledOn = todayIso();
                changed = true;
            }
        }
        if (changed) await this.em.flush();
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        id: string,
        patch: Partial<{
            kind: string;
            jarId: string | null;
            name: string;
            icon: string | null;
            target: number;
            saved: number;
            monthlyContribution: number;
            targetOn: string | null;
            status: string;
            why: string | null;
            fulfilledOn: string | null;
        }>
    ) {
        const entity = await this.repo.findOneOrFail({ id });
        if (patch.kind !== undefined) entity.kind = patch.kind as GoalKind;
        if (patch.jarId !== undefined) {
            entity.jar =
                entity.kind === GoalKind.EARN
                    ? null
                    : patch.jarId
                      ? this.em.getReference(Jar, patch.jarId)
                      : null;
        }
        if (patch.name !== undefined) entity.name = patch.name;
        if (patch.icon !== undefined) entity.icon = patch.icon;
        if (patch.target !== undefined) entity.target = patch.target;
        if (patch.saved !== undefined) entity.saved = patch.saved;
        if (patch.monthlyContribution !== undefined) {
            entity.monthlyContribution =
                entity.kind === GoalKind.EARN ? 0 : patch.monthlyContribution;
        }
        if (patch.targetOn !== undefined) entity.targetOn = patch.targetOn;
        if (patch.status !== undefined) entity.status = patch.status as GoalStatus;
        if (patch.why !== undefined) entity.why = patch.why;
        if (patch.fulfilledOn !== undefined) entity.fulfilledOn = patch.fulfilledOn;
        if (entity.kind === GoalKind.EARN) {
            entity.jar = null;
            entity.monthlyContribution = 0;
        }
        await this.em.flush();
        if (entity.kind === GoalKind.EARN && entity.status === GoalStatus.ACTIVE) {
            await this.evaluateEarnGoals();
            await this.em.refresh(entity);
        }
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
        householdId: goal.household,
        kind: goal.kind,
        jarId: goal.jar?.id ?? null,
        name: goal.name,
        icon: goal.icon,
        target: Number(goal.target),
        saved: Number(goal.saved),
        monthlyContribution: Number(goal.monthlyContribution),
        targetOn: goal.targetOn,
        status: goal.status,
        why: goal.why,
        fulfilledOn: goal.fulfilledOn,
    };
}

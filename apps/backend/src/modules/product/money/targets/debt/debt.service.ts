import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../common/household/household.context';
import { Debt, DebtKind, PayoffStrategy } from './debt.entity';

@Injectable()
export class DebtService {
    private readonly repo: HouseholdScopedRepository<Debt>;
    constructor(private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, Debt);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        name: string;
        kind: string;
        balance: number;
        originalBalance?: number;
        interestRate: number;
        minimumPayment?: number;
        extraPayment?: number;
        dueDay?: number | null;
        closedOn?: string | null;
    }) {
        const entity = this.em.create(Debt, {
            householdId: currentHouseholdId(),
            name: input.name,
            kind: input.kind as DebtKind,
            balance: input.balance,
            originalBalance: input.originalBalance ?? input.balance,
            interestRate: Number(input.interestRate).toFixed(2),
            minimumPayment: input.minimumPayment ?? 0,
            extraPayment: input.extraPayment ?? 0,
            dueDay: input.dueDay ?? null,
            closedOn: input.closedOn ?? null,
        } as never);
        await this.em.persistAndFlush(entity);
        return toDto(entity);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list() {
        const rows = await this.repo.find({ closedOn: null });
        return rows.map(toDto);
    }

    /**
     * Avalanche pays the highest rate first and costs least; snowball clears the
     * smallest balance first and is easier to sustain. We surface both because the
     * cheaper plan is worthless if the user abandons it.
     */
    async plan(strategy: PayoffStrategy) {
        const debts = await this.repo.find({ closedOn: null });
        if (debts.length === 0) {
            return {
                strategy,
                totalBalance: 0,
                totalInterestProjected: 0,
                debtFreeOn: null,
                monthsRemaining: null,
                order: [],
            };
        }

        const ordered = [...debts].sort((a, b) =>
            strategy === PayoffStrategy.AVALANCHE
                ? Number(b.interestRate) - Number(a.interestRate)
                : Number(a.balance) - Number(b.balance)
        );

        const totalBalance = debts.reduce((s, d) => s + Number(d.balance), 0);
        const monthlyPool = debts.reduce(
            (s, d) => s + Number(d.minimumPayment) + Number(d.extraPayment),
            0
        );

        // TODO: full amortisation with rollover of freed minimums; this is the
        // first-order estimate that keeps the screen honest until then.
        const months = monthlyPool > 0 ? Math.ceil(totalBalance / monthlyPool) : null;

        return {
            strategy,
            totalBalance,
            totalInterestProjected: 0,
            debtFreeOn: months === null ? null : addMonths(months),
            monthsRemaining: months,
            order: ordered.map(d => ({ debtId: d.id, name: d.name, payoffOn: null })),
        };
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        id: string,
        patch: Partial<{
            name: string;
            kind: string;
            balance: number;
            originalBalance: number;
            interestRate: number;
            minimumPayment: number;
            extraPayment: number;
            dueDay: number | null;
            closedOn: string | null;
        }>
    ) {
        const entity = await this.repo.findOneOrFail({ id });
        if (patch.name !== undefined) entity.name = patch.name;
        if (patch.kind !== undefined) entity.kind = patch.kind as DebtKind;
        if (patch.balance !== undefined) entity.balance = patch.balance;
        if (patch.originalBalance !== undefined) entity.originalBalance = patch.originalBalance;
        if (patch.interestRate !== undefined) {
            entity.interestRate = Number(patch.interestRate).toFixed(2);
        }
        if (patch.minimumPayment !== undefined) entity.minimumPayment = patch.minimumPayment;
        if (patch.extraPayment !== undefined) entity.extraPayment = patch.extraPayment;
        if (patch.dueDay !== undefined) entity.dueDay = patch.dueDay;
        if (patch.closedOn !== undefined) entity.closedOn = patch.closedOn;
        await this.em.flush();
        return toDto(entity);
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    async remove(id: string) {
        const entity = await this.repo.findOneOrFail({ id });
        await this.em.removeAndFlush(entity);
        return { ok: true as const };
    }
}

function addMonths(months: number): string {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + months, 1))
        .toISOString()
        .slice(0, 10);
}

export function toDto(d: Debt) {
    return {
        id: d.id,
        householdId: d.householdId,
        name: d.name,
        kind: d.kind,
        balance: Number(d.balance),
        originalBalance: Number(d.originalBalance),
        interestRate: Number(d.interestRate),
        minimumPayment: Number(d.minimumPayment),
        extraPayment: Number(d.extraPayment),
        dueDay: d.dueDay,
        closedOn: d.closedOn,
    };
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { Cadence, IncomeKind } from '@rumbelo/contracts';

import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { splitByPercentage } from '../../../../../../common/utils/money.util';
import { JarService } from '../jar/jar.service';
import { IncomeSource } from './income-source.entity';

@Injectable()
export class IncomeService {
    private readonly sources: HouseholdScopedRepository<IncomeSource>;

    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(JarService) private readonly jars: JarService
    ) {
        this.sources = new HouseholdScopedRepository(em, IncomeSource);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        name: string;
        kind: string;
        amount: number;
        cadence?: string;
        expectedDay?: number | null;
        active?: boolean;
        startedOn?: string | null;
    }) {
        const source = this.em.create(IncomeSource, {
            householdId: currentHouseholdId(),
            name: input.name,
            kind: input.kind as IncomeKind,
            amount: input.amount,
            cadence: (input.cadence as Cadence) ?? Cadence.MONTHLY,
            expectedDay: input.expectedDay ?? null,
            active: input.active ?? true,
            startedOn: input.startedOn ?? null,
        } as never);
        await this.em.persist(source).flush();
        return toDto(source);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list() {
        const rows = await this.sources.find();
        return rows.map(toDto);
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        id: string,
        patch: Partial<{
            name: string;
            kind: string;
            amount: number;
            cadence: string;
            expectedDay: number | null;
            active: boolean;
            startedOn: string | null;
        }>
    ) {
        const source = await this.sources.findOneOrFail({ id });
        if (patch.name !== undefined) source.name = patch.name;
        if (patch.kind !== undefined) source.kind = patch.kind as IncomeKind;
        if (patch.amount !== undefined) source.amount = patch.amount;
        if (patch.cadence !== undefined) source.cadence = patch.cadence as Cadence;
        if (patch.expectedDay !== undefined) source.expectedDay = patch.expectedDay;
        if (patch.active !== undefined) source.active = patch.active;
        if (patch.startedOn !== undefined) source.startedOn = patch.startedOn;
        await this.em.flush();
        return toDto(source);
    }

    /**
     * The core money movement: income arrives and is split across jars in the same
     * moment. Uses splitByPercentage so no cent is lost to rounding.
     */
    async applySplit(amount: number) {
        const jars = await this.jars.list();
        const allocations = splitByPercentage(
            amount,
            jars.map(j => ({ id: j.id, percentage: j.percentage }))
        );
        // TODO: persist allocations as ledger rows once the allocation table lands.
        return { allocations: allocations.map(a => ({ jarId: a.id, amount: a.amount })) };
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    async remove(id: string) {
        const source = await this.sources.findOneOrFail({ id });
        await this.em.remove(source).flush();
        return { ok: true as const };
    }
}

export function toDto(s: IncomeSource) {
    return {
        id: s.id,
        householdId: s.householdId,
        name: s.name,
        kind: s.kind,
        amount: Number(s.amount),
        cadence: s.cadence,
        expectedDay: s.expectedDay,
        active: s.active,
        startedOn: s.startedOn,
    };
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { Cadence, type IncomeKind } from '@rumbelo/contracts';

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
        isActive?: boolean;
        startedOn?: string | null;
    }) {
        const source = this.em.create(IncomeSource, {
            householdId: currentHouseholdId(),
            name: input.name,
            kind: input.kind as IncomeKind,
            amount: input.amount,
            cadence: (input.cadence as Cadence) ?? Cadence.MONTHLY,
            expectedDay: input.expectedDay ?? null,
            isActive: input.isActive ?? true,
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
            isActive: boolean;
            startedOn: string | null;
        }>
    ) {
        const source = await this.sources.findOneOrFail({ id });
        if (patch.name !== undefined) source.name = patch.name;
        if (patch.kind !== undefined) source.kind = patch.kind as IncomeKind;
        if (patch.amount !== undefined) source.amount = patch.amount;
        if (patch.cadence !== undefined) source.cadence = patch.cadence as Cadence;
        if (patch.expectedDay !== undefined) source.expectedDay = patch.expectedDay;
        if (patch.isActive !== undefined) source.isActive = patch.isActive;
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
            jars.map(jar => ({ id: jar.id, percentage: jar.percentage }))
        );
        // TODO: persist allocations as ledger rows once the allocation table lands.
        return {
            allocations: allocations.map(allocation => ({
                jarId: allocation.id,
                amount: allocation.amount,
            })),
        };
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

export function toDto(source: IncomeSource) {
    return {
        id: source.id,
        householdId: source.householdId,
        name: source.name,
        kind: source.kind,
        amount: Number(source.amount),
        cadence: source.cadence,
        expectedDay: source.expectedDay,
        isActive: source.isActive,
        startedOn: source.startedOn,
    };
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { Cadence, FlowDirection } from '../../../../../../common/database/enums';
import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { Category } from '../jar/category.entity';
import { Jar } from '../jar/jar.entity';
import { FixedCost } from './fixed-cost.entity';

@Injectable()
export class FixedCostService {
    private readonly repo: HouseholdScopedRepository<FixedCost>;
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, FixedCost);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        jarId: string;
        categoryId?: string | null;
        name: string;
        amount: number;
        cadence?: string;
        dueDay?: number | null;
        direction?: 'IN' | 'OUT';
        active?: boolean;
        endsOn?: string | null;
        note?: string | null;
    }) {
        const entity = this.em.create(FixedCost, {
            householdId: currentHouseholdId(),
            jar: this.em.getReference(Jar, input.jarId),
            category: input.categoryId ? this.em.getReference(Category, input.categoryId) : null,
            name: input.name,
            amount: input.amount,
            cadence: (input.cadence as Cadence) ?? Cadence.MONTHLY,
            dueDay: input.dueDay ?? null,
            direction: (input.direction as FlowDirection) ?? FlowDirection.OUT,
            active: input.active ?? true,
            endsOn: input.endsOn ?? null,
            note: input.note ?? null,
        } as never);
        await this.em.persistAndFlush(entity);
        return toDto(entity);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list(direction?: 'IN' | 'OUT' | null) {
        const rows = await this.repo.find((direction ? { direction } : {}) as never);
        return rows.map(toDto);
    }

    /** Grouped by jar so the UI can show what each jar already owes before spending. */
    async byJar() {
        const rows = await this.repo.find({}, { orderBy: { name: 'ASC' } });
        await this.em.populate(rows, ['jar']);
        const groups = new Map<
            string,
            { jarKey: string; jarName: string; items: ReturnType<typeof toDto>[] }
        >();
        for (const row of rows) {
            const jarId = row.jar.id;
            const existing = groups.get(jarId);
            if (existing) {
                existing.items.push(toDto(row));
            } else {
                groups.set(jarId, {
                    jarKey: row.jar.key,
                    jarName: row.jar.name,
                    items: [toDto(row)],
                });
            }
        }
        return [...groups.entries()].map(([jarId, group]) => ({
            jarId,
            jarKey: group.jarKey,
            jarName: group.jarName,
            total: group.items.reduce((s, i) => s + i.amount, 0),
            items: group.items,
        }));
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        id: string,
        patch: Partial<{
            jarId: string;
            categoryId: string | null;
            name: string;
            amount: number;
            cadence: string;
            dueDay: number | null;
            direction: 'IN' | 'OUT';
            active: boolean;
            endsOn: string | null;
            note: string | null;
        }>
    ) {
        const entity = await this.repo.findOneOrFail({ id });
        if (patch.jarId !== undefined) entity.jar = this.em.getReference(Jar, patch.jarId);
        if (patch.categoryId !== undefined) {
            entity.category = patch.categoryId
                ? this.em.getReference(Category, patch.categoryId)
                : null;
        }
        if (patch.name !== undefined) entity.name = patch.name;
        if (patch.amount !== undefined) entity.amount = patch.amount;
        if (patch.cadence !== undefined) entity.cadence = patch.cadence as Cadence;
        if (patch.dueDay !== undefined) entity.dueDay = patch.dueDay;
        if (patch.direction !== undefined) entity.direction = patch.direction as FlowDirection;
        if (patch.active !== undefined) entity.active = patch.active;
        if (patch.endsOn !== undefined) entity.endsOn = patch.endsOn;
        if (patch.note !== undefined) entity.note = patch.note;
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

export function toDto(f: FixedCost) {
    return {
        id: f.id,
        householdId: f.householdId,
        jarId: f.jar.id,
        categoryId: f.category?.id ?? null,
        name: f.name,
        amount: Number(f.amount),
        cadence: f.cadence,
        dueDay: f.dueDay,
        direction: f.direction,
        active: f.active,
        endsOn: f.endsOn,
        note: f.note,
    };
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import type { Jar as ContractJar } from '@rumbelo/contracts';

import { CADENCE_TO_MONTHLY, Cadence } from '@rumbelo/contracts';
import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { Category } from './category.entity';
import { Jar } from './jar.entity';

/**
 * The contract is the source of truth for wire shapes; deriving the DTO from it
 * means a schema change breaks this file rather than silently shipping a mismatch.
 */
export type JarDto = ContractJar;

@Injectable()
export class JarService {
    private readonly jars: HouseholdScopedRepository<Jar>;
    private readonly categories: HouseholdScopedRepository<Category>;

    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
        this.jars = new HouseholdScopedRepository(em, Jar);
        this.categories = new HouseholdScopedRepository(em, Category);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async createCategory(jarId: string, name: string, budgeted: number) {
        const jar = await this.jars.findOneOrFail({ id: jarId });
        const cat = this.em.create(Category, {
            householdId: currentHouseholdId(),
            jar,
            name,
            budgeted,
        } as never);
        await this.em.persist(cat).flush();
        return {
            id: cat.id,
            jarId: jar.id,
            name: cat.name,
            budgeted: Number(cat.budgeted),
            actual: 0,
            archived: false,
        };
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list(): Promise<JarDto[]> {
        const rows = await this.jars.find({}, { orderBy: { sortOrder: 'ASC' } });
        return rows.map(toJarDto);
    }

    async balances(period: string) {
        const jars = await this.jars.find({}, { orderBy: { sortOrder: 'ASC' } });
        const spentByJar = await this.spentByJar(period);
        const income = await this.monthlyNetIncome();

        return Promise.all(
            jars.map(async jar => {
                const allocated = Math.round((income * Number(jar.percentage)) / 100);
                const spent = spentByJar.get(jar.id) ?? 0;
                const remaining = allocated - spent;
                const cats = await this.categories.find({ jar: jar.id });
                return {
                    ...toJarDto(jar),
                    period,
                    allocated,
                    spent,
                    remaining,
                    progress:
                        allocated > 0 ? Math.min(1, Math.max(0, remaining / allocated)) : null,
                    overspent: remaining < 0,
                    categories: cats.map(c => ({
                        id: c.id,
                        jarId: jar.id,
                        name: c.name,
                        budgeted: Number(c.budgeted),
                        actual: 0,
                        archived: c.archived,
                    })),
                };
            })
        );
    }

    /** Active income normalised to a monthly figure. */
    async monthlyNetIncome(): Promise<number> {
        const rows = await this.em
            .getConnection()
            .execute<{ amount: string; cadence: Cadence }[]>(
                `SELECT amount::text, cadence FROM money_income_source WHERE household_id = ? AND active = true`,
                [currentHouseholdId()]
            );
        return Math.round(
            rows.reduce(
                (sum, r) => sum + Number(r.amount) * (CADENCE_TO_MONTHLY[r.cadence] ?? 0),
                0
            )
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /**
     * A split that does not total 100 silently loses or invents money, so this is
     * rejected rather than normalised.
     */
    async updateSplit(split: { jarId: string; percentage: number }[]): Promise<JarDto[]> {
        const total = split.reduce((sum, s) => sum + s.percentage, 0);
        if (Math.abs(total - 100) > 0.01) {
            throw new Error(`Jar split must total 100%, received ${total}%`);
        }
        for (const { jarId, percentage } of split) {
            const jar = await this.jars.findOneOrFail({ id: jarId });
            jar.percentage = percentage.toFixed(2);
        }
        await this.em.flush();
        return this.list();
    }

    async update(
        id: string,
        patch: Partial<Pick<Jar, 'name' | 'subtitle' | 'icon'>>
    ): Promise<JarDto> {
        const jar = await this.jars.findOneOrFail({ id });
        Object.assign(jar, patch);
        await this.em.flush();
        return toJarDto(jar);
    }

    async updateCategory(
        id: string,
        patch: Partial<{ name: string; budgeted: number; archived: boolean }>
    ) {
        const cat = await this.categories.findOneOrFail({ id });
        Object.assign(cat, patch);
        await this.em.flush();
        return {
            id: cat.id,
            jarId: cat.jar.id,
            name: cat.name,
            budgeted: Number(cat.budgeted),
            actual: 0,
            archived: cat.archived,
        };
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    async deleteCategory(id: string) {
        const cat = await this.categories.findOneOrFail({ id });
        await this.em.remove(cat).flush();
    }

    // Private

    /** One grouped query rather than a per-jar round trip. */
    private async spentByJar(period: string): Promise<Map<string, number>> {
        const rows = await this.em.getConnection().execute<{ jar_id: string; total: string }[]>(
            `SELECT jar_id, COALESCE(SUM(-amount), 0)::text AS total
         FROM money_transaction
        WHERE household_id = ? AND status = 'SORTED' AND amount < 0
          AND to_char(booked_on, 'YYYY-MM') = ?
        GROUP BY jar_id`,
            [currentHouseholdId(), period]
        );
        return new Map(rows.filter(r => r.jar_id).map(r => [r.jar_id, Number(r.total)]));
    }
}

function toJarDto(jar: Jar): JarDto {
    return {
        // String-enum members are nominal in TypeScript, so they need widening to the
        // contract's literal union even though the runtime values are identical.
        id: jar.id,
        householdId: jar.householdId,
        key: jar.key as JarDto['key'],
        name: jar.name,
        subtitle: jar.subtitle,
        icon: jar.icon,
        percentage: Number(jar.percentage),
        spendable: jar.spendable,
        sortOrder: jar.sortOrder,
    };
}

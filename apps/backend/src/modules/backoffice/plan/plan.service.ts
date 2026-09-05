import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { PlanKey } from '@rumbelo/contracts';

import { Plan } from './plan.entity';

/**
 * Plan Service
 *
 * Catalog of product tiers we publish. Households never write these rows.
 */
@Injectable()
export class PlanService {
    private readonly logger = new Logger(PlanService.name);

    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Idempotent seed / staff upsert of catalog rows. */
    async ensureDefaults(rows: Array<Partial<Plan> & { key: PlanKey }>) {
        for (const [sortOrder, row] of rows.entries()) {
            const existing = await this.em.findOne(Plan, { key: row.key });
            if (existing) continue;
            this.em.create(Plan, {
                sortOrder: row.sortOrder ?? sortOrder,
                isActive: true,
                priceMonthly: row.priceMonthly ?? '0.00',
                unlocks: row.unlocks ?? [],
                ...row,
            } as never);
        }
        await this.em.flush();
        this.logger.log(`Ensured ${rows.length} plans`);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Active tiers in rank / display order. */
    async listActive(): Promise<Plan[]> {
        return this.em.find(Plan, { isActive: true }, { orderBy: { sortOrder: 'ASC' } });
    }

    async findByKey(key: PlanKey): Promise<Plan | null> {
        return this.em.findOne(Plan, { key, isActive: true });
    }
}

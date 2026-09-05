import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { Plan } from '../../../modules/backoffice/plan/plan.entity';
import { PLAN_SEED } from '../../../modules/backoffice/plan/seed/plan.seed-data';

/**
 * Seeds the Rumbelo-owned product tier catalog (backoffice.plan).
 * Safe to re-run — updates capabilities on existing keys.
 */
export class PlanSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of PLAN_SEED.entries()) {
            const existing = await em.findOne(Plan, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.priceMonthly = row.priceMonthly;
                existing.capabilities = { ...row.capabilities };
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(Plan, {
                key: row.key,
                name: row.name,
                priceMonthly: row.priceMonthly,
                capabilities: { ...row.capabilities },
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

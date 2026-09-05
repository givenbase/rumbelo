import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { Plan } from '../../modules/backoffice/plan/plan.entity';
import { PLAN_SEED } from '../../modules/backoffice/plan/seed/plan.seed-data';

/**
 * Seeds the Rumbelo-owned product tier catalog (backoffice.plan).
 * Safe to re-run — skips keys that already exist.
 */
export class PlanSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of PLAN_SEED.entries()) {
            const existing = await em.findOne(Plan, { key: row.key });
            if (existing) continue;
            em.create(Plan, {
                ...row,
                unlocks: [...row.unlocks],
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

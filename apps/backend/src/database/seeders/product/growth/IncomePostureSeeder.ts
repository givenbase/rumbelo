import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { IncomePosture } from '../../../../modules/backoffice/product/growth/catalog/income-posture/income-posture.entity';
import { INCOME_POSTURE_SEED } from '../../../../modules/backoffice/product/growth/catalog/income-posture/seed/income-posture.seed-data';

/** Seeds backoffice.reference_growth_income_posture — safe to re-run. */
export class IncomePostureSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of INCOME_POSTURE_SEED.entries()) {
            const existing = await em.findOne(IncomePosture, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.summary = row.summary;
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(IncomePosture, {
                key: row.key,
                name: row.name,
                summary: row.summary,
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

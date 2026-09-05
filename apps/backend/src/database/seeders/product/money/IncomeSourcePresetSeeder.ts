import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { IncomeSourcePreset } from '../../../../modules/backoffice/product/money/preset/income/income.entity';
import { INCOME_SOURCE_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/income/seed/income.seed-data';

export class IncomeSourcePresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of INCOME_SOURCE_PRESET_SEED.entries()) {
            const existing = await em.findOne(IncomeSourcePreset, { key: row.key });
            if (existing) continue;
            em.create(IncomeSourcePreset, { ...row, sortOrder, isActive: true } as never);
        }
        await em.flush();
    }
}

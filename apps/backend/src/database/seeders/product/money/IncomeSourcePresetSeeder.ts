import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { IncomeSourcePreset } from '../../../../modules/backoffice/product/money/preset/income/income.entity';
import { INCOME_SOURCE_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/income/seed/income.seed-data';

export class IncomeSourcePresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const keys = INCOME_SOURCE_PRESET_SEED.map(row => row.key);
        const existingRows = await em.find(IncomeSourcePreset, { key: { $in: keys } });
        const existingKeys = new Set(existingRows.map(row => row.key));
        for (const [sortOrder, row] of INCOME_SOURCE_PRESET_SEED.entries()) {
            if (existingKeys.has(row.key)) continue;
            em.create(IncomeSourcePreset, { ...row, sortOrder, isActive: true } as never);
        }
        await em.flush();
    }
}

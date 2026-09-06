import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { DebtPreset } from '../../../../modules/backoffice/product/money/preset/debt/debt.entity';
import { DEBT_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/debt/seed/debt.seed-data';

export class DebtPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const keys = DEBT_PRESET_SEED.map(row => row.key);
        const existingRows = await em.find(DebtPreset, { key: { $in: keys } });
        const existingKeys = new Set(existingRows.map(row => row.key));
        for (const [sortOrder, row] of DEBT_PRESET_SEED.entries()) {
            if (existingKeys.has(row.key)) continue;
            em.create(DebtPreset, { ...row, sortOrder, isActive: true } as never);
        }
        await em.flush();
    }
}

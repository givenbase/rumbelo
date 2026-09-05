import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { DebtPreset } from '../../../../modules/backoffice/product/money/preset/debt/debt.entity';
import { DEBT_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/debt/seed/debt.seed-data';

export class DebtPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of DEBT_PRESET_SEED.entries()) {
            const existing = await em.findOne(DebtPreset, { key: row.key });
            if (existing) continue;
            em.create(DebtPreset, { ...row, sortOrder, isActive: true } as never);
        }
        await em.flush();
    }
}

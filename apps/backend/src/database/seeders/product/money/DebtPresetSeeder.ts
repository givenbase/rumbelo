import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { DebtPreset } from '../../../../modules/backoffice/product/money/preset/debt/debt.entity';
import { DEBT_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/debt/seed/debt.seed-data';

export class DebtPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const keys = DEBT_PRESET_SEED.map(row => row.key);
        const seedKeys = new Set<string>(keys);
        const existingRows = await em.find(DebtPreset, {});
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));
        for (const [sortOrder, row] of DEBT_PRESET_SEED.entries()) {
            const existing = existingByKey.get(row.key);
            const suggestedLenders = [...row.suggestedLenders];
            if (existing) {
                existing.name = row.name;
                existing.kind = row.kind;
                existing.icon = row.icon;
                existing.suggestedLenders = suggestedLenders;
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(DebtPreset, {
                key: row.key,
                name: row.name,
                kind: row.kind,
                icon: row.icon,
                suggestedLenders,
                sortOrder,
                isActive: true,
            } as never);
        }
        for (const row of existingRows) {
            if (!seedKeys.has(row.key)) row.isActive = false;
        }
        await em.flush();
    }
}

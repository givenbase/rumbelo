import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { LeverPreset } from '../../../../modules/backoffice/product/growth/preset/lever/lever.entity';
import { LEVER_PRESET_SEED } from '../../../../modules/backoffice/product/growth/preset/lever/seed/lever.seed-data';

export class LeverPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const keys = LEVER_PRESET_SEED.map(row => row.key);
        const existingRows = await em.find(LeverPreset, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));
        for (const [sortOrder, row] of LEVER_PRESET_SEED.entries()) {
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.name = row.name;
                existing.summary = row.summary;
                existing.accentColor = row.accentColor;
                existing.forPostureKeys = [...row.forPostureKeys];
                existing.forSpendingStyles = [...row.forSpendingStyles];
                existing.minStageKey = row.minStageKey;
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(LeverPreset, {
                key: row.key,
                name: row.name,
                summary: row.summary,
                accentColor: row.accentColor,
                forPostureKeys: [...row.forPostureKeys],
                forSpendingStyles: [...row.forSpendingStyles],
                minStageKey: row.minStageKey,
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { GoalPreset } from '../../../../modules/backoffice/product/money/preset/goal/goal.entity';
import { GOAL_PRESET_SEED } from '../../../../modules/backoffice/product/money/preset/goal/seed/goal.seed-data';
import {
    jarTemplateFromMap,
    loadJarTemplateMap,
} from '../../../../modules/backoffice/product/money/require-jar-template';

export class GoalPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const jarByKey = await loadJarTemplateMap(em);
        const keys = GOAL_PRESET_SEED.map(row => row.key);
        const existingRows = await em.find(GoalPreset, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));
        for (const [sortOrder, row] of GOAL_PRESET_SEED.entries()) {
            const jarTemplate = jarTemplateFromMap(jarByKey, row.jarKey);
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.name = row.name;
                existing.jarTemplate = jarTemplate;
                existing.categoryTemplateKey = row.categoryTemplateKey ?? null;
                existing.icon = row.icon ?? null;
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(GoalPreset, {
                key: row.key,
                name: row.name,
                jarTemplate,
                categoryTemplateKey: row.categoryTemplateKey ?? null,
                icon: row.icon ?? null,
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

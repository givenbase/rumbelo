import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { GoalPreset } from '../../modules/backoffice/reference/preset/goal/goal.entity';
import { GOAL_PRESET_SEED } from '../../modules/backoffice/reference/preset/goal/seed/goal.seed-data';
import { requireJarTemplate } from '../../modules/backoffice/reference/require-jar-template';

export class GoalPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of GOAL_PRESET_SEED.entries()) {
            const jarTemplate = await requireJarTemplate(em, row.jarKey);
            const existing = await em.findOne(GoalPreset, { key: row.key });
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

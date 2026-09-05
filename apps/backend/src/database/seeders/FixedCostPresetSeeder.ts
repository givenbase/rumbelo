import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { FixedCostPreset } from '../../modules/backoffice/reference/preset/fixed-cost/fixed-cost.entity';
import { FIXED_COST_PRESET_SEED } from '../../modules/backoffice/reference/preset/fixed-cost/seed/fixed-cost.seed-data';
import { requireJarTemplate } from '../../modules/backoffice/reference/require-jar-template';

export class FixedCostPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of FIXED_COST_PRESET_SEED.entries()) {
            const jarTemplate = await requireJarTemplate(em, row.jarKey);
            const existing = await em.findOne(FixedCostPreset, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.jarTemplate = jarTemplate;
                existing.categoryTemplateKey = row.categoryTemplateKey;
                existing.audienceTags = [...row.audienceTags];
                existing.sortOrder = sortOrder;
                existing.active = true;
                continue;
            }
            em.create(FixedCostPreset, {
                key: row.key,
                name: row.name,
                jarTemplate,
                categoryTemplateKey: row.categoryTemplateKey,
                audienceTags: [...row.audienceTags],
                sortOrder,
                active: true,
            } as never);
        }
        await em.flush();
    }
}

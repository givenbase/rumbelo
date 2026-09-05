import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { requireJarTemplate } from '../../modules/backoffice/reference/require-jar-template';
import { CategoryTemplate } from '../../modules/backoffice/reference/template/category/category.entity';
import { CATEGORY_TEMPLATE_SEED } from '../../modules/backoffice/reference/template/category/seed/category.seed-data';

export class CategoryTemplateSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of CATEGORY_TEMPLATE_SEED.entries()) {
            const jarTemplate = await requireJarTemplate(em, row.jarKey);
            const existing = await em.findOne(CategoryTemplate, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.jarTemplate = jarTemplate;
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(CategoryTemplate, {
                key: row.key,
                name: row.name,
                jarTemplate,
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

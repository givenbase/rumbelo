import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { JarTemplate } from '../../modules/backoffice/reference/template/jar/jar.entity';
import { JAR_TEMPLATE_SEED } from '../../modules/backoffice/reference/template/jar/seed/jar.seed-data';

export class JarTemplateSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of JAR_TEMPLATE_SEED.entries()) {
            const existing = await em.findOne(JarTemplate, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.subtitle = row.subtitle;
                existing.icon = row.icon;
                existing.defaultPercentage = row.defaultPercentage;
                existing.capabilities = { ...row.capabilities };
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(JarTemplate, {
                ...row,
                capabilities: { ...row.capabilities },
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }
}

import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { JarTemplate } from '../../modules/backoffice/reference/jar-template/jar-template.entity';
import { JAR_TEMPLATE_SEED } from '../../modules/backoffice/reference/jar-template/seed/jar-template.seed-data';

/**
 * Seeds the Rumbelo-owned jar catalog (backoffice.jar_template).
 * Safe to re-run — skips keys that already exist.
 */
export class JarTemplateSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of JAR_TEMPLATE_SEED.entries()) {
            const existing = await em.findOne(JarTemplate, { key: row.key });
            if (existing) continue;
            em.create(JarTemplate, { ...row, sortOrder, active: true } as never);
        }
        await em.flush();
    }
}

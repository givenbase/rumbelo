import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { JarTemplate } from './jar.entity';

/**
 * Jar Template Service
 *
 * Catalog of jar definitions we publish. Households never write these rows.
 */
@Injectable()
export class JarTemplateService {
    private readonly logger = new Logger(JarTemplateService.name);

    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    /** Idempotent seed / staff upsert of catalog rows. */
    async ensureDefaults(rows: Array<Partial<JarTemplate> & { key: JarTemplate['key'] }>) {
        const keys = rows.map(row => row.key);
        const existingRows = await this.em.find(JarTemplate, { key: { $in: keys } });
        const existingKeys = new Set(existingRows.map(row => row.key));
        for (const [sortOrder, row] of rows.entries()) {
            if (existingKeys.has(row.key)) continue;
            this.em.create(JarTemplate, {
                sortOrder: row.sortOrder ?? sortOrder,
                isActive: true,
                ...row,
            } as never);
        }
        await this.em.flush();
        this.logger.log(`Ensured ${rows.length} jar templates`);
    }

    /** Active templates in display order — used by onboard to seed money.jar. */
    async listActive(): Promise<JarTemplate[]> {
        return this.em.find(JarTemplate, { isActive: true }, { orderBy: { sortOrder: 'ASC' } });
    }
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import { JarTemplate } from './jar-template.entity';

/**
 * Jar Template Service
 *
 * Catalog of jar definitions we publish. Households never write these rows.
 */
@Injectable()
export class JarTemplateService {
    private readonly logger = new Logger(JarTemplateService.name);

    constructor(private readonly em: EntityManager) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Idempotent seed / staff upsert of catalog rows. */
    async ensureDefaults(rows: Array<Partial<JarTemplate> & { key: JarTemplate['key'] }>) {
        for (const [sortOrder, row] of rows.entries()) {
            const existing = await this.em.findOne(JarTemplate, { key: row.key });
            if (existing) continue;
            this.em.create(JarTemplate, {
                sortOrder: row.sortOrder ?? sortOrder,
                active: true,
                spendable: row.spendable ?? true,
                ...row,
            } as never);
        }
        await this.em.flush();
        this.logger.log(`Ensured ${rows.length} jar templates`);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Active templates in display order — used by onboard to seed money.jar. */
    async listActive(): Promise<JarTemplate[]> {
        return this.em.find(JarTemplate, { active: true }, { orderBy: { sortOrder: 'ASC' } });
    }
}

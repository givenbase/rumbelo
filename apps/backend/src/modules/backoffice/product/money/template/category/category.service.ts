import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import type { JarKey } from '@rumbelo/contracts';

import { CategoryTemplate } from './category.entity';

@Injectable()
export class CategoryTemplateService {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    async listActive(filters?: { jarKey?: JarKey }): Promise<CategoryTemplate[]> {
        return this.em.find(
            CategoryTemplate,
            {
                isActive: true,
                ...(filters?.jarKey ? { jarTemplate: { key: filters.jarKey } } : {}),
            },
            { orderBy: { sortOrder: 'ASC' }, populate: ['jarTemplate'] }
        );
    }

    async findByKey(key: string): Promise<CategoryTemplate | null> {
        return this.em.findOne(
            CategoryTemplate,
            { key, isActive: true },
            { populate: ['jarTemplate'] }
        );
    }
}

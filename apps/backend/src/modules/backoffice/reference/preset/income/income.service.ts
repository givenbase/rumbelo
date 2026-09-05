import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import type { IncomeKind } from '@rumbelo/contracts';

import { IncomeSourcePreset } from './income.entity';

@Injectable()
export class IncomeSourcePresetService {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    async listActive(filters?: { kind?: IncomeKind }): Promise<IncomeSourcePreset[]> {
        return this.em.find(
            IncomeSourcePreset,
            {
                active: true,
                ...(filters?.kind ? { kind: filters.kind } : {}),
            },
            { orderBy: { sortOrder: 'ASC' } }
        );
    }
}

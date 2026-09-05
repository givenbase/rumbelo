import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import {
    MoneyCharacter,
    WEALTH_STAGE_KEYS,
    filterGrowthLeverPresets,
    type GrowthLeverPreset,
} from '@rumbelo/contracts';

import { WealthStageService } from '../../catalog/wealth-stage/wealth-stage.service';
import { LeverPreset } from './lever.entity';

@Injectable()
export class LeverPresetService {
    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(WealthStageService) private readonly wealthStages: WealthStageService
    ) {}

    async listActive(filters?: {
        postureKey?: string;
        character?: MoneyCharacter;
        stageKey?: string;
        stageSortOrder?: number;
    }): Promise<GrowthLeverPreset[]> {
        const [rows, stages] = await Promise.all([
            this.em.find(LeverPreset, { isActive: true }, { orderBy: { sortOrder: 'ASC' } }),
            this.wealthStages.listActive(),
        ]);

        const sortByKey = new Map(stages.map(s => [s.key, s.sortOrder]));
        const mapped = rows.map(row => toDto(row, sortByKey));

        const stageKey = filters?.stageKey ?? WEALTH_STAGE_KEYS.BUILDING;
        const stageSortOrder =
            filters?.stageSortOrder ?? sortByKey.get(stageKey) ?? 0;

        return filterGrowthLeverPresets(mapped, {
            postureKey: filters?.postureKey,
            character: filters?.character,
            stageKey,
            stageSortOrder,
        });
    }
}

function toDto(
    row: LeverPreset,
    sortByKey: Map<string, number>
): GrowthLeverPreset {
    return {
        key: row.key,
        name: row.name,
        sortOrder: row.sortOrder,
        summary: row.summary,
        accentColor: row.accentColor,
        forPostureKeys: row.forPostureKeys ?? [],
        forCharacters: row.forCharacters ?? [],
        minStageKey: row.minStageKey,
        minStageSortOrder: sortByKey.get(row.minStageKey) ?? 0,
    };
}

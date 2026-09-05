import { z } from 'zod';

import { MoneyCharacter } from '../../../platform/enums';
import { CatalogItemBase } from '../../../../common/schemas';

/**
 * Growth company catalogs — postures, wealth stages, lever presets.
 * Well-known keys are convenience for seeds / defaults; new rows can be added in DB.
 */
export const INCOME_POSTURE_KEYS = {
    TIME_TRADE: 'TIME_TRADE',
    SKILL_TRADE: 'SKILL_TRADE',
    SYSTEM: 'SYSTEM',
    ASSETS: 'ASSETS',
    UNKNOWN: 'UNKNOWN',
} as const;

export const WEALTH_STAGE_KEYS = {
    BUILDING: 'BUILDING',
    SECURE: 'SECURE',
    INDEPENDENT: 'INDEPENDENT',
    ABUNDANT: 'ABUNDANT',
} as const;

/** Scalable earning-posture row (backoffice.reference_growth_income_posture). */
export const IncomePosture = CatalogItemBase.extend({
    summary: z.string().max(280).nullable(),
});
export type IncomePosture = z.infer<typeof IncomePosture>;

/**
 * Scalable wealth-stage row (backoffice.reference_growth_wealth_stage).
 * sortOrder drives progression; optional net-worth floor in minor units for later auto-detect.
 */
export const WealthStage = CatalogItemBase.extend({
    summary: z.string().max(280).nullable(),
    /** Optional display badge (e.g. milestone label) — not a legal/status claim. */
    badgeLabel: z.string().max(64).nullable(),
    /** Net worth floor in eurocents; null = no automatic threshold yet. */
    minNetWorth: z.number().int().nullable(),
});
export type WealthStage = z.infer<typeof WealthStage>;

/**
 * Backoffice catalog row: growth lever / method suggestion.
 * Tags use catalog keys so postures/stages can grow without code deploys.
 */
export const GrowthLeverPreset = CatalogItemBase.extend({
    summary: z.string().min(1).max(280),
    accentColor: z.string().min(1).max(64),
    /** Empty = relevant for every posture. Keys → reference_growth_income_posture.key */
    forPostureKeys: z.array(z.string().min(1).max(64)),
    /** Empty = relevant for every character. */
    forCharacters: z.array(z.enum(MoneyCharacter)),
    /** Lowest wealth stage key that should see this lever. */
    minStageKey: z.string().min(1).max(64),
    /** Copied from wealth stage.sortOrder at list time for filtering. */
    minStageSortOrder: z.int(),
});
export type GrowthLeverPreset = z.infer<typeof GrowthLeverPreset>;

export type LeverAudience = {
    postureKey?: string;
    character?: MoneyCharacter;
    stageKey?: string;
    /** sortOrder of the audience stage (from wealth stage catalog). */
    stageSortOrder?: number;
};

/** Filter catalog levers for the current person / board. */
export function filterGrowthLeverPresets(
    presets: readonly GrowthLeverPreset[],
    audience: LeverAudience = {}
): GrowthLeverPreset[] {
    const postureKey = audience.postureKey ?? INCOME_POSTURE_KEYS.UNKNOWN;
    const character = audience.character ?? MoneyCharacter.UNKNOWN;
    const stageSortOrder = audience.stageSortOrder ?? 0;

    return presets.filter(preset => {
        if (preset.minStageSortOrder > stageSortOrder) return false;
        if (
            preset.forPostureKeys.length > 0 &&
            postureKey !== INCOME_POSTURE_KEYS.UNKNOWN &&
            !preset.forPostureKeys.includes(postureKey)
        ) {
            return false;
        }
        if (
            preset.forCharacters.length > 0 &&
            character !== MoneyCharacter.UNKNOWN &&
            !preset.forCharacters.includes(character)
        ) {
            return false;
        }
        return true;
    });
}

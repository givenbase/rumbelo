/**
 * Catalogs Schemas (Growth)
 * Postures, wealth stages, and lever presets from backoffice.
 * Zod only — no `export type`.
 */

import { z } from 'zod';

import { CatalogItemBase } from '../../../../common/common.schema';
import { SpendingStyle } from '../../../platform/enums';

/** Scalable earning-posture row (backoffice.reference_growth_income_posture). */
export const IncomePosture = CatalogItemBase.extend({
    summary: z.string().max(280).nullable(),
});

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
    forSpendingStyles: z.array(z.enum(SpendingStyle)),
    /** Lowest wealth stage key that should see this lever. */
    minStageKey: z.string().min(1).max(64),
    /** Copied from wealth stage.sortOrder at list time for filtering. */
    minStageSortOrder: z.int(),
});

// Inferred types (same-module merge for consumers)
export type IncomePosture = z.infer<typeof IncomePosture>;
export type WealthStage = z.infer<typeof WealthStage>;
export type GrowthLeverPreset = z.infer<typeof GrowthLeverPreset>;

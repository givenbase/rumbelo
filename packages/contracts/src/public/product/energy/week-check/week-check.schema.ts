/**
 * Week-Check Schemas (Energy)
 * Energy week-check shell — portal week check with completion.
 */

import type { z } from 'zod';

import { PortalWeekCheck } from '../../../../common/common.schema';

/**
 * Energy week-check shell — household + week + completion only.
 * Product fields land later; do not invent them here.
 */
export const EnergyWeekCheck = PortalWeekCheck;

// Inferred types (same-module merge for consumers)
export type EnergyWeekCheck = z.infer<typeof EnergyWeekCheck>;

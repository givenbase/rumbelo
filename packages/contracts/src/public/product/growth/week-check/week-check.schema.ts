/**
 * Week-Check Schemas (Growth)
 * Growth week-check shell — portal week check with completion.
 */

import type { z } from 'zod';

import { PortalWeekCheck } from '../../../../common/common.schema';

/**
 * Growth week-check shell — household + week + completion only.
 * Product fields land later; do not invent them here.
 */
export const GrowthWeekCheck = PortalWeekCheck;

// Inferred types (same-module merge for consumers)
export type GrowthWeekCheck = z.infer<typeof GrowthWeekCheck>;

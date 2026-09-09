/**
 * Week-Check Schemas (Soul)
 * Soul week-check shell — portal week check with completion.
 */

import type { z } from 'zod';

import { PortalWeekCheck } from '../../../../common/common.schema';

/**
 * Soul week-check shell — household + week + completion only.
 * Product fields land later; do not invent them here.
 */
export const SoulWeekCheck = PortalWeekCheck;

// Inferred types (same-module merge for consumers)
export type SoulWeekCheck = z.infer<typeof SoulWeekCheck>;

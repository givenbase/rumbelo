/**
 * Gratitude Schemas (Soul)
 * Weekly gratitude entries.
 * Zod only — no `export type`.
 */

import { z } from 'zod';

import { HouseholdId, Id, WeekKey } from '../../../../common/common.schema';

export const Gratitude = z.object({
    id: Id,
    householdId: HouseholdId,
    /** Rumtelo `auth.account.id` — person who wrote the entry (not Better Auth user). */
    accountId: Id,
    week: WeekKey,
    text: z.string().min(1).max(280),
    createdAt: z.iso.datetime(),
});

// Inferred types (same-module merge for consumers)
export type Gratitude = z.infer<typeof Gratitude>;

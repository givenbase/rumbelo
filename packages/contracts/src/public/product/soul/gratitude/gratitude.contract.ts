/**
 * Gratitude Contract (Soul)
 * oRPC procedures for gratitude entries.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdId, HouseholdScoped, WeekKey } from '../../../../common/common.schema';
import { Gratitude } from './gratitude.schema';

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const gratitudeCreate = oc
    .input(
        z.object({
            householdId: HouseholdId,
            week: WeekKey,
            text: z.string().min(1).max(280),
        })
    )
    .output(Gratitude);

// ====================================================================
// ? READ Operations
// ====================================================================

export const gratitudeList = oc
    .input(HouseholdScoped.extend({ week: WeekKey.nullish() }))
    .output(z.array(Gratitude));

/** Nested contract object mounted at `contract.soul.gratitude`. */
export const gratitudeContract = {
    list: gratitudeList,
    create: gratitudeCreate,
};

/**
 * Coach Contracts
 * Feed + dismiss for household coach messages.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdId, HouseholdScoped, Id, PeriodKey } from '../../../common/common.schema';
import { CoachMessage } from './coach.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const coachFeed = oc
    .input(HouseholdScoped.extend({ period: PeriodKey.nullish() }))
    .output(z.array(CoachMessage));

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const coachDismiss = oc
    .input(z.object({ householdId: HouseholdId, id: Id }))
    .output(z.object({ ok: z.literal(true) }));

/** Nested contract object mounted at `contract.coach`. */
export const coachContract = {
    feed: coachFeed,
    dismiss: coachDismiss,
};

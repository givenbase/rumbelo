/**
 * Week-Check Contract (Soul)
 * oRPC procedures for the soul weekly check-in.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped, WeekKey } from '../../../../common/common.schema';
import { SoulWeekCheck } from './week-check.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const soulWeekCheckCurrent = oc
    .input(HouseholdScoped.extend({ week: WeekKey.nullish() }))
    .output(SoulWeekCheck);

export const soulWeekCheckHistory = oc.input(HouseholdScoped).output(z.array(SoulWeekCheck));

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const soulWeekCheckComplete = oc
    .input(HouseholdScoped.extend({ week: WeekKey }))
    .output(SoulWeekCheck);

/** Nested contract object mounted at `contract.soul.weekCheck`. */
export const soulWeekCheckContract = {
    current: soulWeekCheckCurrent,
    history: soulWeekCheckHistory,
    complete: soulWeekCheckComplete,
};

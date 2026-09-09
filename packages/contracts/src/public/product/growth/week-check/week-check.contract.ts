/**
 * Week-Check Contract (Growth)
 * oRPC procedures for the growth weekly check-in.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped, WeekKey } from '../../../../common/common.schema';
import { GrowthWeekCheck } from './week-check.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const growthWeekCheckCurrent = oc
    .input(HouseholdScoped.extend({ week: WeekKey.nullish() }))
    .output(GrowthWeekCheck);

export const growthWeekCheckHistory = oc.input(HouseholdScoped).output(z.array(GrowthWeekCheck));

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const growthWeekCheckComplete = oc
    .input(HouseholdScoped.extend({ week: WeekKey }))
    .output(GrowthWeekCheck);

/** Nested contract object mounted at `contract.growth.weekCheck`. */
export const growthWeekCheckContract = {
    current: growthWeekCheckCurrent,
    history: growthWeekCheckHistory,
    complete: growthWeekCheckComplete,
};

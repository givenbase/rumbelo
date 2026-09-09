/**
 * Week-Check Contract (Energy)
 * oRPC procedures for the energy weekly check-in.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped, WeekKey } from '../../../../common/common.schema';
import { EnergyWeekCheck } from './week-check.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const energyWeekCheckCurrent = oc
    .input(HouseholdScoped.extend({ week: WeekKey.nullish() }))
    .output(EnergyWeekCheck);

export const energyWeekCheckHistory = oc.input(HouseholdScoped).output(z.array(EnergyWeekCheck));

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const energyWeekCheckComplete = oc
    .input(HouseholdScoped.extend({ week: WeekKey }))
    .output(EnergyWeekCheck);

/** Nested contract object mounted at `contract.energy.weekCheck`. */
export const energyWeekCheckContract = {
    current: energyWeekCheckCurrent,
    history: energyWeekCheckHistory,
    complete: energyWeekCheckComplete,
};

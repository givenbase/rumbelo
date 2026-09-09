/**
 * Log Contract (Energy)
 * oRPC procedures for energy log entries and summaries.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped, IsoDate } from '../../../../common/common.schema';
import { EnergyLog, EnergySummary } from './log.schema';

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const energyLogCreate = oc
    .input(EnergyLog.omit({ id: true, accountId: true }))
    .output(EnergyLog);

// ====================================================================
// ? READ Operations
// ====================================================================

export const energyLogList = oc
    .input(
        HouseholdScoped.extend({
            from: IsoDate.nullish(),
            to: IsoDate.nullish(),
        })
    )
    .output(z.array(EnergyLog));

export const energyLogSummary = oc.input(HouseholdScoped).output(z.array(EnergySummary));

/** Nested contract object mounted at `contract.energy.logs`. */
export const energyLogContract = {
    list: energyLogList,
    create: energyLogCreate,
    summary: energyLogSummary,
};

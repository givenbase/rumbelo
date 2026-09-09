/**
 * Dashboard Contract (Money)
 * oRPC procedure for the money dashboard read.
 */

import { oc } from '@orpc/contract';

import { HouseholdScoped, PeriodKey } from '../../../../common/common.schema';
import { Dashboard } from './dashboard.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const dashboardGet = oc
    .input(HouseholdScoped.extend({ period: PeriodKey.nullish() }))
    .output(Dashboard);

/** Nested contract object mounted at `contract.money.dashboard`. */
export const dashboardContract = {
    get: dashboardGet,
};

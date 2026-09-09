/**
 * Dashboard Contract (Growth)
 * oRPC procedure for the growth dashboard read.
 */

import { oc } from '@orpc/contract';

import { HouseholdScoped } from '../../../../common/common.schema';
import { GrowthDashboard } from './dashboard.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const growthDashboardGet = oc.input(HouseholdScoped).output(GrowthDashboard);

/** Nested contract object mounted at `contract.growth.dashboard`. */
export const growthDashboardContract = {
    get: growthDashboardGet,
};

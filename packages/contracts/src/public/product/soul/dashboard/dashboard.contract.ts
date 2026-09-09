/**
 * Dashboard Contract (Soul)
 * oRPC procedure for the soul dashboard read.
 */

import { oc } from '@orpc/contract';

import { HouseholdScoped } from '../../../../common/common.schema';
import { SoulDashboard } from './dashboard.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const soulDashboardGet = oc.input(HouseholdScoped).output(SoulDashboard);

/** Nested contract object mounted at `contract.soul.dashboard`. */
export const soulDashboardContract = {
    get: soulDashboardGet,
};

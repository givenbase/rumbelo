/**
 * Dashboard Contract (Energy)
 * oRPC procedure for the energy dashboard read.
 */

import { oc } from '@orpc/contract';

import { HouseholdScoped } from '../../../../common/common.schema';
import { EnergyDashboard } from './dashboard.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const energyDashboardGet = oc.input(HouseholdScoped).output(EnergyDashboard);

/** Nested contract object mounted at `contract.energy.dashboard`. */
export const energyDashboardContract = {
    get: energyDashboardGet,
};

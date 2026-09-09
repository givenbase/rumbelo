/**
 * Milestone Contract (Growth)
 * oRPC procedures for income milestones.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped } from '../../../../common/common.schema';
import { IncomeMilestone } from './milestone.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const milestoneList = oc.input(HouseholdScoped).output(z.array(IncomeMilestone));

/** Nested contract object mounted at `contract.growth.milestones`. */
export const milestoneContract = {
    list: milestoneList,
};

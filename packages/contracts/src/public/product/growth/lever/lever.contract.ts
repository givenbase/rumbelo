/**
 * Lever Contract (Growth)
 * oRPC procedures for income levers.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdScoped } from '../../../../common/common.schema';
import { IncomeLever } from './lever.schema';

// ====================================================================
// ? READ Operations
// ====================================================================

export const leverList = oc.input(HouseholdScoped).output(z.array(IncomeLever));

/** Nested contract object mounted at `contract.growth.levers`. */
export const leverContract = {
    list: leverList,
};

/**
 * Fixed-Cost Contract
 * oRPC procedures for fixed cost CRUD and jar grouping.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdId, HouseholdScoped, Id } from '../../../../common/common.schema';
import { FlowDirection } from '../../../../common/common.enums';
import { FixedCost, FixedCostsByJar } from './fixed-cost.schema';

const ok = z.object({ ok: z.literal(true) });

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const fixedCostCreate = oc.input(FixedCost.omit({ id: true })).output(FixedCost);

// ====================================================================
// ? READ Operations
// ====================================================================

export const fixedCostList = oc
    .input(HouseholdScoped.extend({ direction: z.enum(FlowDirection).nullish() }))
    .output(z.array(FixedCost));

export const fixedCostByJar = oc.input(HouseholdScoped).output(z.array(FixedCostsByJar));

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const fixedCostUpdate = oc
    .input(FixedCost.partial().extend({ id: Id, householdId: HouseholdId }))
    .output(FixedCost);

// ====================================================================
// ? DELETE Operations
// ====================================================================

export const fixedCostRemove = oc.input(z.object({ householdId: HouseholdId, id: Id })).output(ok);

/** Nested contract object mounted at `contract.money.fixedCosts`. */
export const fixedCostContract = {
    list: fixedCostList,
    byJar: fixedCostByJar,
    create: fixedCostCreate,
    update: fixedCostUpdate,
    remove: fixedCostRemove,
};

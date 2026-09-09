/**
 * Debt Contract
 * oRPC procedures for debt CRUD and payoff plan.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdId, HouseholdScoped, Id } from '../../../../common/common.schema';
import { PayoffStrategy } from '../enums';
import { Debt, DebtPlan } from './debt.schema';

const ok = z.object({ ok: z.literal(true) });

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const debtCreate = oc.input(Debt.omit({ id: true })).output(Debt);

// ====================================================================
// ? READ Operations
// ====================================================================

export const debtList = oc.input(HouseholdScoped).output(z.array(Debt));

export const debtPlan = oc
    .input(HouseholdScoped.extend({ strategy: z.enum(PayoffStrategy).nullish() }))
    .output(DebtPlan);

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const debtUpdate = oc
    .input(Debt.partial().extend({ id: Id, householdId: HouseholdId }))
    .output(Debt);

// ====================================================================
// ? DELETE Operations
// ====================================================================

export const debtRemove = oc.input(z.object({ householdId: HouseholdId, id: Id })).output(ok);

/** Nested contract object mounted at `contract.money.debts`. */
export const debtContract = {
    list: debtList,
    create: debtCreate,
    update: debtUpdate,
    remove: debtRemove,
    plan: debtPlan,
};

/**
 * Household Contracts
 * oRPC procedures for households, members, settings, onboard, invite.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { AuthId, HouseholdId, HouseholdScoped } from '../../../common/common.schema';
import { HouseholdRole } from '../enums';
import {
    Household,
    HouseholdMember,
    HouseholdSettings,
    HouseholdSettingsPatch,
    OnboardingInput,
} from './household.schema';

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const householdOnboard = oc.input(OnboardingInput).output(Household);

export const householdInvite = oc
    .input(
        z.object({
            householdId: HouseholdId,
            email: z.email(),
            role: z.enum(HouseholdRole),
        })
    )
    .output(z.object({ invitationId: AuthId }));

// ====================================================================
// ? READ Operations
// ====================================================================

export const householdList = oc.output(z.array(Household));

export const householdCurrent = oc.input(z.object({ householdId: HouseholdId })).output(Household);

export const householdMembers = oc.input(HouseholdScoped).output(z.array(HouseholdMember));

export const householdSettings = oc.input(HouseholdScoped).output(HouseholdSettings);

// ====================================================================
// ? UPDATE Operations
// ====================================================================

export const householdUpdateSettings = oc.input(HouseholdSettingsPatch).output(HouseholdSettings);

/** Nested contract object mounted at `contract.household`. */
export const householdContract = {
    list: householdList,
    current: householdCurrent,
    members: householdMembers,
    settings: householdSettings,
    updateSettings: householdUpdateSettings,
    onboard: householdOnboard,
    invite: householdInvite,
};

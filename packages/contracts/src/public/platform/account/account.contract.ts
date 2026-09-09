/**
 * Account Contracts
 * oRPC procedures for profile + account settings.
 */

import { oc } from '@orpc/contract';
import { z } from 'zod';

import { Id } from '../../../common/common.schema';
import { AccountProfile, AccountProfilePatch, AccountSettings } from './account.schema';

// ====================================================================
// ? CREATE Operations
// ====================================================================

export const accountCreateSettings = oc
    .input(AccountSettings.partial().omit({ accountId: true, onboardedAt: true }))
    .output(AccountSettings);

// ====================================================================
// ? READ Operations
// ====================================================================

/** Structured profile + display name */
export const accountProfile = oc.output(AccountProfile);

/** Current authenticated user's settings */
export const accountSettings = oc.output(AccountSettings);

// ====================================================================
// ? UPDATE Operations
// ====================================================================

/** Legal names / DOB / display name (syncs Better Auth `user.name`) */
export const accountUpdateProfile = oc.input(AccountProfilePatch).output(AccountProfile);

export const accountUpdateSettings = oc
    .input(AccountSettings.partial().omit({ accountId: true, onboardedAt: true }))
    .output(AccountSettings);

// ====================================================================
// ? DELETE Operations
// ====================================================================

export const accountDeleteSettings = oc
    .input(z.object({ id: Id }))
    .output(z.object({ ok: z.literal(true) }));

/** Nested contract object mounted at `contract.account`. */
export const accountContract = {
    profile: accountProfile,
    updateProfile: accountUpdateProfile,
    createSettings: accountCreateSettings,
    settings: accountSettings,
    updateSettings: accountUpdateSettings,
    deleteSettings: accountDeleteSettings,
};

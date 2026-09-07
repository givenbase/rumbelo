import { z } from 'zod';

import { Locale, SpendingStyle, Theme } from '../../../enums';
import { Id, UserId } from '../../../common/schemas';

export { SpendingStyle } from '../../../enums';

const PersonName = z.string().trim().min(1).max(80);
const OptionalPersonName = PersonName.nullable().optional();

/**
 * Application personal profile on `auth.account` (names, DOB; address later).
 * Display name lives on Better Auth `user.name` (synced when patched here).
 * Better Auth stays auth-only — this is product data.
 */
export const AccountProfile = z.object({
    accountId: Id,
    /** Better Auth user — linked via Account.user; keep for membership/session joins. */
    userId: UserId,
    /** Public nickname / how we greet you — Better Auth `user.name` (via Account→User). */
    displayName: z.string().trim().min(1).max(80),
    firstName: z.string().trim().max(80).nullable(),
    middleName: z.string().trim().max(80).nullable(),
    lastName: z.string().trim().max(80).nullable(),
    /** ISO calendar date `YYYY-MM-DD`. */
    dateOfBirth: z.iso.date().nullable(),
    email: z.email(),
    image: z.string().nullable(),
});
export type AccountProfile = z.infer<typeof AccountProfile>;

export const AccountProfilePatch = z.object({
    displayName: PersonName.optional(),
    firstName: OptionalPersonName,
    middleName: OptionalPersonName,
    lastName: OptionalPersonName,
    dateOfBirth: z.iso.date().nullable().optional(),
});
export type AccountProfilePatch = z.infer<typeof AccountProfilePatch>;

/**
 * Person UI prefs. Currency is NOT here — the household board has one accounting
 * currency. Theme, locale, and spending style can differ between members of the
 * same household.
 *
 * `onboardedAt` is null until personal setup is finished (locale / character /
 * first household flow for the creator). Separate from Better Auth emailVerified.
 */
export const AccountTourChapterStatus = z.enum(['completed', 'skipped']);
export type AccountTourChapterStatus = z.infer<typeof AccountTourChapterStatus>;

export const AccountTourOfferStatus = z.enum(['idle', 'pending', 'accepted', 'dismissed']);
export type AccountTourOfferStatus = z.infer<typeof AccountTourOfferStatus>;

/** Joyride progress — person-scoped so partners don’t overwrite each other. */
export const AccountTourProgress = z.object({
    offer: AccountTourOfferStatus,
    tours: z.record(z.string(), AccountTourChapterStatus),
    seriesActive: z.boolean(),
    seriesIndex: z.number().int().min(0),
});
export type AccountTourProgress = z.infer<typeof AccountTourProgress>;

export const DEFAULT_ACCOUNT_TOUR_PROGRESS: AccountTourProgress = {
    offer: 'idle',
    tours: {},
    seriesActive: false,
    seriesIndex: 0,
};

export const AccountSettings = z.object({
    accountId: Id,
    locale: z.enum(Locale),
    theme: z.enum(Theme),
    /** Soft spending style — personalises coach tips for who is looking. */
    spendingStyle: z.enum(SpendingStyle),
    /** Guided tour / Help walkthrough progress. */
    tour: AccountTourProgress,
    /** When personal onboarding completed; null = still new. */
    onboardedAt: z.iso.datetime().nullable(),
});
export type AccountSettings = z.infer<typeof AccountSettings>;

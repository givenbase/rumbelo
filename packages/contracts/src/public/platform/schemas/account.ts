import { z } from 'zod';

import { Locale, MoneyCharacter, Theme } from '../../../enums';
import { Id, UserId } from '../../../common/schemas';

export { MoneyCharacter } from '../../../enums';

const PersonName = z.string().trim().min(1).max(80);
const OptionalPersonName = PersonName.nullable().optional();

/**
 * Application personal profile on `auth.account` (names, DOB; address later).
 * Display name lives on Better Auth `user.name` (synced when patched here).
 * Better Auth stays auth-only — this is product data.
 */
export const AccountProfile = z.object({
    accountId: Id,
    userId: UserId,
    /** Public nickname / how we greet you — Better Auth `user.name`. */
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
 * currency. Theme, locale, and money character can differ between members of the
 * same household.
 *
 * `onboardedAt` is null until personal setup is finished (locale / character /
 * first household flow for the creator). Separate from Better Auth emailVerified.
 */
export const AccountSettings = z.object({
    accountId: Id,
    locale: z.enum(Locale),
    theme: z.enum(Theme),
    /** Soft spending style — personalises coach tips for who is looking. */
    moneyCharacter: z.enum(MoneyCharacter),
    /** When personal onboarding completed; null = still new. */
    onboardedAt: z.iso.datetime().nullable(),
});
export type AccountSettings = z.infer<typeof AccountSettings>;

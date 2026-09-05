import { z } from 'zod';

import { Locale, MoneyCharacter, Theme } from '../../../enums';
import { Id } from '../../../common/schemas';

export { MoneyCharacter } from '../../../enums';

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

import { z } from 'zod';

import { Locale, MoneyCharacter, Theme } from '../../enums';
import { Id } from '../common';

export { MoneyCharacter } from '../../enums';

/**
 * Person UI prefs. Currency is NOT here — the household board has one accounting
 * currency. Theme, locale, and money character can differ between members of the
 * same household.
 */
export const AccountSettings = z.object({
    accountId: Id,
    locale: z.enum(Locale),
    theme: z.enum(Theme),
    /** Soft spending style — personalises coach tips for who is looking. */
    moneyCharacter: z.enum(MoneyCharacter),
});
export type AccountSettings = z.infer<typeof AccountSettings>;

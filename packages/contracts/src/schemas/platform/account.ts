import { z } from 'zod';
import { Id, Locale, Theme } from '../common';

/**
 * Person UI prefs. Currency is NOT here — the household board has one accounting
 * currency. Theme and locale can differ between members of the same household.
 */
export const AccountSettings = z.object({
    accountId: Id,
    locale: Locale,
    theme: Theme,
});
export type AccountSettings = z.infer<typeof AccountSettings>;

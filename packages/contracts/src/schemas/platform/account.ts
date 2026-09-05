import { z } from 'zod';

import { Locale, Theme } from '../../enums';
import { Id } from '../common';

/**
 * Person UI prefs. Currency is NOT here — the household board has one accounting
 * currency. Theme and locale can differ between members of the same household.
 */
export const AccountSettings = z.object({
    accountId: Id,
    locale: z.enum(Locale),
    theme: z.enum(Theme),
});
export type AccountSettings = z.infer<typeof AccountSettings>;

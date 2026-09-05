/**
 * Short labels and display names for locale switchers.
 */
import { LocalesEnum, type Locale } from './next-intl';

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
    [LocalesEnum.Dutch]: 'NL',
    [LocalesEnum.English]: 'EN',
};

export const LOCALE_DISPLAY_NAMES: Record<Locale, string> = {
    [LocalesEnum.Dutch]: 'Nederlands',
    [LocalesEnum.English]: 'English',
};

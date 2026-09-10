/**
 * Supported locale codes — must match filenames in packages/i18n/languages/.
 * BCP-47 lowercase (next-intl). Household settings use contracts `Locale` (NL/EN).
 */
/** English first, Dutch second — matches product language order. */
export const SUPPORTED_LOCALES = ['en', 'nl'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Map app locale → ISO 3166-1 alpha-2 (seed / reference data).
 */
export const LOCALE_TO_ISO2: Record<SupportedLocale, string> = {
    en: 'US',
    nl: 'NL',
};

/** Map contracts `Locale` enum (NL/EN) → next-intl locale. Default: English. */
export function contractsLocaleToApp(locale: string): SupportedLocale {
    const upper = locale.toUpperCase();
    if (upper === 'NL') return 'nl';
    return 'en';
}

/** Map next-intl locale → contracts `Locale` enum value. */
export function appLocaleToContracts(locale: SupportedLocale): 'NL' | 'EN' {
    return locale === 'en' ? 'EN' : 'NL';
}

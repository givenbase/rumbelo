import { type AbstractIntlMessages, useTranslations as useNextIntlTranslations } from 'next-intl';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

/**
 * Rumbelo locales — match `packages/i18n/languages/*.json`.
 * Product is NL-first; English is the translation source of truth (Galighticus pattern).
 */
export enum LocalesEnum {
    Dutch = 'nl',
    English = 'en',
}

export const locales = [LocalesEnum.Dutch, LocalesEnum.English] as const;

export type Locale = (typeof locales)[number];

/** Locales enabled for routing / detection / switcher. */
export const activeLocales = locales;

/** Hide locale switcher when only one locale is active. */
export const isLocaleSwitcherVisible = activeLocales.length > 1;

export type Messages = AbstractIntlMessages;

export const routing = defineRouting({
    locales: [...activeLocales],
    defaultLocale: LocalesEnum.Dutch,
    localePrefix: 'never',
});

export const { redirect, usePathname, useRouter, Link } = createNavigation(routing);

export { useNextIntlTranslations as useTranslations };

/** Pass `t` into helpers without repeating `ReturnType<typeof useTranslations>`. */
export type TranslateFn = ReturnType<typeof useNextIntlTranslations>;

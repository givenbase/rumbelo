import { LocalesEnum, locales, type Locale } from '@rumbelo/i18n';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import * as rootParams from 'next/root-params';

export default getRequestConfig(async ({ locale }) => {
    // Prefer an explicit override (Server Actions / Route Handlers); else root `[locale]`.
    if (!locale) {
        const paramValue = await rootParams.locale();
        locale = hasLocale(locales, paramValue) ? paramValue : LocalesEnum.Dutch;
    } else if (!locales.includes(locale as Locale)) {
        locale = LocalesEnum.Dutch;
    }

    return {
        locale,
        messages: (await import(`../../../packages/i18n/languages/${locale}.json`)).default,
        timeZone: 'Europe/Amsterdam',
    };
});

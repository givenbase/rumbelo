import { LocalesEnum, locales, type Locale } from '@rumbelo/i18n';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

/**
 * Resolve locale for Server Components / next-intl APIs.
 *
 * Uses `requestLocale` (middleware / segment), not `next/root-params`:
 * root-params has no exports in the proxy/middleware graph.
 */
export default getRequestConfig(async ({ locale, requestLocale }) => {
    if (!locale) {
        const paramValue = await requestLocale;
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

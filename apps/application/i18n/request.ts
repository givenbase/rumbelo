import { LocalesEnum, locales, type Locale } from '@rumbelo/i18n';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as Locale)) {
        locale = LocalesEnum.Dutch;
    }

    return {
        locale,
        messages: (await import(`../../../packages/i18n/languages/${locale}.json`)).default,
        timeZone: 'Europe/Amsterdam',
    };
});

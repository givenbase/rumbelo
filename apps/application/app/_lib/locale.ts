/** Lightweight locale helper — swap for next-intl `useTranslations` in a follow-up pass. */
import {
    t as translate,
    DEFAULT_LOCALE as defaultLocale,
    type AppLocale as LocaleType,
} from '@rumbelo/i18n';

export { translate as t, defaultLocale as DEFAULT_LOCALE };
export type AppLocale = LocaleType;
export type Locale = AppLocale;
export type { MessageKey } from '@rumbelo/i18n';

/** Re-export shell locale toggle — use inside authenticated layout only. */
export { useAppShell as useLocaleContext } from '@/components/features/shell/app-shell-context';

/**
 * App locale helpers — prefer `useTranslations` from `@rumbelo/i18n` in UI.
 * Maps household settings (contracts Locale NL/EN) ↔ next-intl locales.
 */
export {
    appLocaleToContracts,
    contractsLocaleToApp,
    DEFAULT_LOCALE,
    LocalesEnum,
    type Locale as AppLocale,
    type Locale,
} from '@rumbelo/i18n';

/** Re-export shell locale toggle — use inside authenticated layout only. */
export { useAppShell as useLocaleContext } from '@/components/features/shell/app-shell-context';

export * from './locale-metadata';
export * from './locales';
export * from './next-intl';
export {
    AUTH_QUOTES,
    AUTH_SIGN_IN,
    AUTH_SIGN_UP,
    AUTH_VERIFY,
    AUTH_FORGOT_PASSWORD,
    AUTH_RESET_PASSWORD,
    BRAND_CORE,
    BRAND_TAGLINE,
    type BrandQuote,
} from './brand';

import { LocalesEnum } from './next-intl';

/** Default UI locale — NL-first product. */
export const DEFAULT_LOCALE = LocalesEnum.Dutch;

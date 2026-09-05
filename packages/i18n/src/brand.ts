/**
 * Convenience constants for surfaces that are not yet on `useTranslations`
 * (SSR brand lockups). Source of truth remains `translations/features/brand.ts`
 * + `translations/features/auth.ts` — keep these in sync when editing copy.
 */
import auth from '../translations/features/auth';
import brand from '../translations/features/brand';

export type BrandQuote = {
    eyebrow: string;
    headline: string;
    support: string;
};

export const BRAND_TAGLINE = brand.tagline;

export const BRAND_CORE = [brand.core.one, brand.core.two, brand.core.three] as const;

export const AUTH_QUOTES: readonly BrandQuote[] = [
    brand.auth_quotes.money_picture,
    brand.auth_quotes.how_it_works,
    brand.auth_quotes.who_its_for,
    brand.auth_quotes.bigger_than_balance,
];

export const AUTH_SIGN_IN = auth.sign_in;
export const AUTH_SIGN_UP = auth.sign_up;

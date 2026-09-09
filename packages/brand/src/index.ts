/**
 * Shared Rumtelo brand assets + logo component.
 *
 * Source of truth: `packages/brand/assets/`
 * Apps expose them at `/brand/*` via `public/brand` → symlink to this folder.
 * Do not copy files into app `public/` folders.
 */
export { RumteloLogo, type RumteloLogoProps, type RumteloLogoVariant } from './RumteloLogo';

/** Public URL prefix after the symlink is in place. */
export const BRAND_PUBLIC_BASE = '/brand' as const;

export const BRAND_ASSETS = {
    mark: `${BRAND_PUBLIC_BASE}/rumtelo-mark.png`,
    markSvg: `${BRAND_PUBLIC_BASE}/rumtelo-mark.svg`,
    wordmark: `${BRAND_PUBLIC_BASE}/rumtelo-wordmark.png`,
    wordmarkSvg: `${BRAND_PUBLIC_BASE}/rumtelo-wordmark.svg`,
    wordmarkOnDark: `${BRAND_PUBLIC_BASE}/rumtelo-wordmark-on-dark.jpg`,
    lockup: `${BRAND_PUBLIC_BASE}/rumtelo-lockup.jpg`,
} as const;

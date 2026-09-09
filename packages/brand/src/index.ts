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
    /** App UI — SVG lockup for light surfaces. */
    wordmarkOnLight: `${BRAND_PUBLIC_BASE}/rumtelo-logo-wordmark-on-light.svg`,
    /** App UI — SVG lockup for dark surfaces. */
    wordmarkOnDark: `${BRAND_PUBLIC_BASE}/rumtelo-logo-wordmark-on-dark.svg`,
    /** Email / raster clients — PNG lockup for light surfaces. */
    wordmarkOnLightPng: `${BRAND_PUBLIC_BASE}/rumtelo-logo-wordmark-on-light.png`,
    /** Email / raster clients — PNG lockup for dark surfaces. */
    wordmarkOnDarkPng: `${BRAND_PUBLIC_BASE}/rumtelo-logo-wordmark-on-dark.png`,
} as const;

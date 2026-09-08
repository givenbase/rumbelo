/**
 * Shared Rumbelo brand assets + logo component.
 *
 * Source of truth: `packages/brand/assets/`
 * Apps expose them at `/brand/*` via `public/brand` → symlink to this folder.
 * Do not copy files into app `public/` folders.
 */
export { RumbeloLogo, type RumbeloLogoProps, type RumbeloLogoVariant } from './RumbeloLogo';

/** Public URL prefix after the symlink is in place. */
export const BRAND_PUBLIC_BASE = '/brand' as const;

export const BRAND_ASSETS = {
    mark: `${BRAND_PUBLIC_BASE}/rumbelo-mark.png`,
    markSvg: `${BRAND_PUBLIC_BASE}/rumbelo-mark.svg`,
    wordmark: `${BRAND_PUBLIC_BASE}/rumbelo-wordmark.png`,
    wordmarkSvg: `${BRAND_PUBLIC_BASE}/rumbelo-wordmark.svg`,
    wordmarkOnDark: `${BRAND_PUBLIC_BASE}/rumbelo-wordmark-on-dark.jpg`,
    lockup: `${BRAND_PUBLIC_BASE}/rumbelo-lockup.jpg`,
} as const;

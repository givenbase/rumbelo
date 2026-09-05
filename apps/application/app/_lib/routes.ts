/**
 * App route prefixes — visible URL segments.
 *
 * Product → `/product/{money|growth|energy|soul|ritual|why}/…`
 * Settings → `/settings/…` (folder group `(platform)` is invisible)
 * Auth → unprefixed (`/sign-in`, `/verify`, …)
 *
 * Prefer these helpers over hard-coded strings.
 */

function joinPath(base: string, ...segments: string[]): string {
    const parts = segments
        .flatMap(segment => segment.split('/'))
        .map(segment => segment.replace(/^\/+|\/+$/g, ''))
        .filter(Boolean);
    return parts.length ? `${base}/${parts.join('/')}` : base;
}

export const PRODUCT = '/product' as const;
export const SETTINGS = '/settings' as const;

/** Visible product URL — `/product`, `/product/money/jars`, … */
export function productPath(...segments: string[]): string {
    return joinPath(PRODUCT, ...segments);
}

/** Settings URL — `/settings`, `/settings/product/money/jars`, … */
export function settingsPath(...segments: string[]): string {
    return joinPath(SETTINGS, ...segments);
}

export const moneyPath = (...segments: string[]) => productPath('money', ...segments);
export const growthPath = (...segments: string[]) => productPath('growth', ...segments);
export const energyPath = (...segments: string[]) => productPath('energy', ...segments);
export const soulPath = (...segments: string[]) => productPath('soul', ...segments);

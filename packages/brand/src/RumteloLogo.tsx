import type { ImgHTMLAttributes } from 'react';

export type RumteloLogoVariant = 'wordmark' | 'wordmarkOnLight' | 'wordmarkOnDark';

export type RumteloLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    /**
     * `wordmark` follows the page theme (light/dark).
     * `wordmarkOnLight` / `wordmarkOnDark` force a surface.
     */
    variant?: RumteloLogoVariant;
    /** Accessible name — defaults to “Rumtelo”. */
    alt?: string;
};

/** App UI — SVG. Email keeps PNG (see BRAND_ASSETS). */
const WORDMARK_ON_LIGHT = '/brand/rumtelo-logo-wordmark-on-light.svg';
const WORDMARK_ON_DARK = '/brand/rumtelo-logo-wordmark-on-dark.svg';

/**
 * Shared brand lockup — designer files in `@rumtelo/brand/assets`, served
 * from each app via `public/brand` (symlink, no duplicates).
 *
 * Default wordmark swaps on-light / on-dark via `.rumtelo-logo-*` rules in
 * `packages/config/tailwind/dark.css`.
 */
export function RumteloLogo({
    variant = 'wordmark',
    alt = 'Rumtelo',
    className,
    ...rest
}: RumteloLogoProps) {
    if (variant === 'wordmarkOnLight') {
        return (
            <img
                src={WORDMARK_ON_LIGHT}
                alt={alt}
                className={className}
                decoding="async"
                {...rest}
            />
        );
    }

    if (variant === 'wordmarkOnDark') {
        return (
            <img
                src={WORDMARK_ON_DARK}
                alt={alt}
                className={className}
                decoding="async"
                {...rest}
            />
        );
    }

    return (
        <span className={['rumtelo-logo', 'inline-grid', className].filter(Boolean).join(' ')}>
            <img
                src={WORDMARK_ON_LIGHT}
                alt={alt}
                className="rumtelo-logo-on-light col-start-1 row-start-1 h-full w-auto max-w-full"
                decoding="async"
                {...rest}
            />
            <img
                src={WORDMARK_ON_DARK}
                alt=""
                aria-hidden
                className="rumtelo-logo-on-dark col-start-1 row-start-1 h-full w-auto max-w-full"
                decoding="async"
            />
        </span>
    );
}

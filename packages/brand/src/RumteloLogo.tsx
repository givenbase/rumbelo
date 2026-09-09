import type { ImgHTMLAttributes } from 'react';

export type RumteloLogoVariant = 'wordmark' | 'mark' | 'wordmarkOnDark';

export type RumteloLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    /** Full lockup, icon only, or lockup tuned for dark surfaces. */
    variant?: RumteloLogoVariant;
    /** Accessible name — defaults to “Rumtelo”. */
    alt?: string;
};

/**
 * Shared brand mark — assets live in `@rumtelo/brand/assets` and are served
 * from each app via `public/brand` → that folder (symlink, no duplicates).
 */
export function RumteloLogo({
    variant = 'wordmark',
    alt = 'Rumtelo',
    className,
    ...rest
}: RumteloLogoProps) {
    const src =
        variant === 'mark'
            ? '/brand/rumtelo-mark.png'
            : variant === 'wordmarkOnDark'
              ? '/brand/rumtelo-wordmark-on-dark.jpg'
              : '/brand/rumtelo-wordmark.png';

    return <img src={src} alt={alt} className={className} decoding="async" {...rest} />;
}

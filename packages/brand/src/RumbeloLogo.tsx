import type { ImgHTMLAttributes } from 'react';

export type RumbeloLogoVariant = 'wordmark' | 'mark' | 'wordmarkOnDark';

export type RumbeloLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    /** Full lockup, icon only, or lockup tuned for dark surfaces. */
    variant?: RumbeloLogoVariant;
    /** Accessible name — defaults to “Rumbelo”. */
    alt?: string;
};

/**
 * Shared brand mark — assets live in `@rumbelo/brand/assets` and are served
 * from each app via `public/brand` → that folder (symlink, no duplicates).
 */
export function RumbeloLogo({
    variant = 'wordmark',
    alt = 'Rumbelo',
    className,
    ...rest
}: RumbeloLogoProps) {
    const src =
        variant === 'mark'
            ? '/brand/rumbelo-mark.png'
            : variant === 'wordmarkOnDark'
              ? '/brand/rumbelo-wordmark-on-dark.jpg'
              : '/brand/rumbelo-wordmark.png';

    return <img src={src} alt={alt} className={className} decoding="async" {...rest} />;
}

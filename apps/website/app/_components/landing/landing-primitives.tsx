import type { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

/** Mono eyebrow with the house ✦ mark. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-medium tracking-wide text-accent uppercase sm:text-xs sm:tracking-widest',
                className
            )}>
            <span aria-hidden className="shrink-0">
                ✦
            </span>
            {children}
        </span>
    );
}

interface SectionHeadingProps {
    eyebrow: string;
    headline: string;
    lead?: string;
    align?: 'left' | 'center';
    /** Tailwind max-width for the headline (defaults to a tight measure). */
    headlineClassName?: string;
    className?: string;
}

/** Eyebrow → display headline → lead. One rhythm for every section. */
export function SectionHeading({
    eyebrow,
    headline,
    lead,
    align = 'left',
    headlineClassName,
    className,
}: SectionHeadingProps) {
    const centered = align === 'center';
    return (
        <div className={cn(centered && 'mx-auto text-center', className)}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
                className={cn(
                    'mt-3.5 mb-3 font-display text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-fg lg:text-4xl',
                    centered ? 'mx-auto max-w-2xl' : 'max-w-xl',
                    headlineClassName
                )}>
                {headline}
            </h2>
            {lead ? (
                <p
                    className={cn(
                        'max-w-prose text-base leading-relaxed text-pretty text-fg-muted lg:text-lg',
                        centered && 'mx-auto'
                    )}>
                    {lead}
                </p>
            ) : null}
        </div>
    );
}

type CtaProps = {
    href: string;
    children: ReactNode;
    variant?: 'primary' | 'ghost';
    size?: 'md' | 'lg';
    className?: string;
    onClick?: () => void;
};

/** Pill CTA — primary is the accent gradient, ghost is a hairline. */
export function Cta({
    href,
    children,
    variant = 'primary',
    size = 'md',
    className,
    onClick,
}: CtaProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                'inline-flex items-center justify-center rounded-full text-center font-mono text-xs font-semibold tracking-wide uppercase transition-all active:scale-95',
                size === 'lg' ? 'px-6 py-4' : 'px-5 py-2.5',
                variant === 'primary'
                    ? 'bg-(image:--gradient-accent) text-on-accent shadow-glow hover:brightness-105'
                    : 'border border-line-strong text-fg-secondary hover:border-accent hover:text-accent',
                className
            )}>
            {children}
        </Link>
    );
}

/** Card chrome shared by every landing tile. */
export const CARD =
    'rounded-2xl border border-line bg-surface shadow-md ring-1 ring-fg/6 ring-inset dark:ring-white/6';

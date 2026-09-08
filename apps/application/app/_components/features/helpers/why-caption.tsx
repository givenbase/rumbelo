'use client';

import Link from 'next/link';

import { cn } from '@rumbelo/utils';

import { productPath } from '@/app/_lib/routes';
import { whyLineFor } from '@/app/_lib/why-lines';
import { PAGE_CONTENT_WIDTH, type PageContentWidth } from '@/components/layout/page-content';
import { usePageContentWidth } from '@/components/layout/page-content-width';

import { useHelpersEnabled } from './provider';

type WhyCaptionProps = {
    pathname: string;
    locked?: boolean;
};

/** Full-bleed pages: soft centered whisper. Constrained pages: match PageContent. */
function captionWidthClass(width: PageContentWidth) {
    if (width === 'full') return PAGE_CONTENT_WIDTH.narrow;
    return PAGE_CONTENT_WIDTH[width];
}

/**
 * Soft Coach whisper under the shell — one line, card tint, no link clutter.
 * Width tracks `PageContent` so narrow/prose pages don’t misalign the helper.
 */
export function WhyCaption({ pathname, locked = false }: WhyCaptionProps) {
    const coachGuidesEnabled = useHelpersEnabled();
    const contentWidth = usePageContentWidth();
    if (locked || !coachGuidesEnabled) return null;

    const why = whyLineFor(pathname);
    if (!why) return null;

    return (
        <aside
            className={cn(
                'mx-auto mb-5 w-full rounded-xl border border-line bg-raised/70 px-3 py-2 shadow-sm',
                captionWidthClass(contentWidth)
            )}
            data-feature-helper="why-line"
            data-coach-guide="why"
            aria-label="The Coach">
            <p className="flex items-start gap-2 text-xs leading-snug text-fg-muted">
                <span
                    className="mt-px shrink-0 font-mono text-[10px] font-bold tracking-wider text-accent uppercase"
                    aria-hidden>
                    ✦
                </span>
                <span className="min-w-0 flex-1 text-pretty">{why}</span>
                <Link
                    href={productPath('coach')}
                    className="shrink-0 font-mono text-[10px] font-semibold tracking-wide text-accent/70 uppercase transition-colors hover:text-accent"
                    title="Open The Coach">
                    The Coach
                </Link>
            </p>
        </aside>
    );
}

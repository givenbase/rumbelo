'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

interface CoachSlide {
    kind: string;
    dotColor: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
}

interface RecapRow {
    label: string;
    value: string;
    what: string;
    color: string;
    href: string;
}

/**
 * Dashboard-only coach card (design: Kluis Finance App.dc.html:346-387) — a
 * dot-paginated carousel over coach messages, plus a 6-cell recap strip
 * (one cell per portal/source) beneath it. Distinct from PortalHub's single
 * static coach card.
 */
export function CoachCarousel({ slides, recap }: { slides: CoachSlide[]; recap: RecapRow[] }) {
    const [index, setIndex] = useState(0);
    const slide = slides[index] ?? slides[0];
    if (!slide) return null;

    return (
        <div className="overflow-hidden rounded-2xl border border-accent-hover bg-surface shadow-md">
            <div className="grid gap-3.5 px-5 pt-4.5 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ The coach
                    </span>
                    <span className="flex items-center gap-2">
                        <span
                            className="size-1.75 rounded-full"
                            style={{ background: slide.dotColor }}
                        />
                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                            {slide.kind}
                        </span>
                    </span>
                </div>

                <p className="max-w-prose font-display text-xl leading-snug font-medium text-pretty text-fg lg:text-2xl">
                    {slide.text}
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                    <span className="flex items-center gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                                className={cn(
                                    'h-1 rounded-full transition-all',
                                    i === index ? 'w-6 bg-accent' : 'w-2.5 bg-line-strong'
                                )}
                            />
                        ))}
                    </span>
                    <span className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)}
                            className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent">
                            ←
                        </button>
                        <span className="font-mono text-xs font-medium text-fg-faint">
                            {index + 1} / {slides.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIndex(i => (i + 1) % slides.length)}
                            className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent">
                            →
                        </button>
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                        <Button variant="secondary" size="sm">
                            Share
                        </Button>
                        <Button as={Link} href={slide.ctaHref} size="sm">
                            {slide.ctaLabel}
                        </Button>
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap border-t border-line bg-bg-app">
                {recap.map(r => (
                    <Link
                        key={r.label}
                        href={r.href}
                        className="grid flex-1 gap-1 border-t-2 border-r border-line px-4 py-2.5 transition-colors last:border-r-0 hover:bg-raised"
                        style={{ borderTopColor: r.color }}>
                        <span
                            className="font-mono text-xs font-semibold tracking-widest"
                            style={{ color: r.color }}>
                            {r.label}
                        </span>
                        <span className="flex items-baseline gap-1.5">
                            <span className="font-mono text-xs text-fg">{r.value}</span>
                            <span className="text-xs text-fg-faint">{r.what}</span>
                        </span>
                    </Link>
                ))}
                <Link
                    href="/product/ritual"
                    className="ml-auto flex items-center border-l border-line px-4.5 font-mono text-xs font-medium tracking-wide text-fg-faint uppercase transition-colors hover:text-accent">
                    Detail
                </Link>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';

import { AUTH_QUOTES } from '@rumbelo/i18n';

const ROTATE_MS = 7000;

/** Desktop auth manifesto — quotes only (no video asset on the marketing site). */
export function AuthAside() {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setReduceMotion(media.matches);
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (reduceMotion || AUTH_QUOTES.length < 2) return;
        const id = window.setInterval(() => {
            setQuoteIndex(i => (i + 1) % AUTH_QUOTES.length);
        }, ROTATE_MS);
        return () => window.clearInterval(id);
    }, [reduceMotion]);

    const quote = AUTH_QUOTES[quoteIndex] ?? AUTH_QUOTES[0];
    if (!quote) return null;

    return (
        <aside className="relative hidden overflow-hidden bg-raised lg:block">
            <div
                className="absolute inset-0 opacity-90"
                style={{ background: 'var(--gradient-page)' }}
                aria-hidden
            />
            <div className="relative flex h-full flex-col justify-end p-10 xl:p-14">
                <p className="font-mono text-[10px] tracking-[0.2em] text-fg-faint uppercase">
                    {quote.eyebrow}
                </p>
                <p className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight text-fg xl:text-4xl">
                    {quote.headline}
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">{quote.support}</p>
            </div>
        </aside>
    );
}

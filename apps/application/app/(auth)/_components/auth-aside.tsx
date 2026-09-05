'use client';

import { useEffect, useRef, useState } from 'react';

import { AUTH_QUOTES } from '@/app/_lib/brand-quotes';

const ROTATE_MS = 7000;

/**
 * Desktop auth manifesto panel — looping muted video with brand quotes.
 * Respects prefers-reduced-motion (poster only; first quote stays).
 */
export function AuthAside() {
    const videoRef = useRef<HTMLVideoElement>(null);
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
        const video = videoRef.current;
        if (!video || reduceMotion) return;
        void video.play().catch(() => {
            // Autoplay can fail without user gesture; poster remains visible.
        });
    }, [reduceMotion]);

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
        <aside className="relative hidden overflow-hidden lg:block">
            <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/videos/auth-aside-poster.jpg')" }}
            />

            {!reduceMotion ? (
                <video
                    ref={videoRef}
                    aria-hidden
                    className="absolute inset-0 size-full object-cover"
                    poster="/videos/auth-aside-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata">
                    <source src="/videos/auth-aside.mp4" type="video/mp4" />
                </video>
            ) : null}

            <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/30"
            />

            <div className="relative z-10 flex h-full min-h-dvh flex-col justify-end px-12 py-16">
                <div key={quoteIndex} className="animate-rise">
                    <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                        ✦ {quote.eyebrow}
                    </p>
                    <p className="mt-4 max-w-md font-display text-3xl leading-tight font-semibold tracking-tight text-white">
                        {quote.headline}
                    </p>
                    <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80">
                        {quote.support}
                    </p>
                </div>

                <div className="mt-10 flex gap-1.5" aria-hidden>
                    {AUTH_QUOTES.map((_, i) => (
                        <span
                            key={i}
                            className={
                                i === quoteIndex
                                    ? 'h-1 w-6 rounded-full bg-white'
                                    : 'h-1 w-1.5 rounded-full bg-white/35'
                            }
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}

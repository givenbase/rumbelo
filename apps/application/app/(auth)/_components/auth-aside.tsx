'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Desktop auth manifesto panel — looping muted video with readable overlay.
 * Respects prefers-reduced-motion (poster only).
 */
export function AuthAside() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [reduceMotion, setReduceMotion] = useState(false);

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

    return (
        <aside className="relative hidden overflow-hidden lg:block">
            {/* Fallback / reduced-motion still */}
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

            {/* Scrim so type stays legible on bright frames */}
            <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/30"
            />

            <div className="relative z-10 flex h-full min-h-dvh flex-col justify-center px-12 py-16">
                <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                    ✦ Control that compounds
                </p>
                <p className="mt-4 max-w-md font-display text-3xl leading-tight font-semibold tracking-tight text-white">
                    Your money should give you room to live — and room to grow.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80">
                    Split income into six jars the moment it lands. Spend without guilt. Build
                    freedom on purpose. One short weekly check-in keeps you in the driver&apos;s
                    seat.
                </p>
            </div>
        </aside>
    );
}

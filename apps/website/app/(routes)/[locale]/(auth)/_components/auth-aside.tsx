'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import { AUTH_QUOTES_WEB } from '@rumbelo/i18n';
import { AuthManifesto } from '@rumbelo/ui';

/** Pexels clip (download id 27908405). */
const AUTH_ASIDE_VIDEO =
    'https://videos.pexels.com/video-files/27908405/12260011_1920_1080_60fps.mp4';

/**
 * Desktop auth manifesto — marketing quotes; jars on sign-up, portals elsewhere.
 * Respects prefers-reduced-motion (first quote stays; no video).
 */
export function AuthAside() {
    const pathname = usePathname();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [reduceMotion, setReduceMotion] = useState(false);
    const isSignUp = pathname.includes('/sign-up');
    const footer = isSignUp ? 'jars' : 'portals';
    /** docs/brand/quotes.md — sign-up leads with how-it-works. */
    const initialIndex = isSignUp ? 1 : 0;

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
            // Autoplay can fail without user gesture; manifesto copy remains.
        });
    }, [reduceMotion]);

    return (
        <aside className="relative hidden h-full min-h-dvh overflow-hidden bg-fg lg:block">
            {!reduceMotion ? (
                <video
                    ref={videoRef}
                    aria-hidden
                    className="absolute inset-0 size-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata">
                    <source src={AUTH_ASIDE_VIDEO} type="video/mp4" />
                </video>
            ) : null}

            <AuthManifesto
                quotes={AUTH_QUOTES_WEB}
                reduceMotion={reduceMotion}
                footer={footer}
                initialIndex={initialIndex}
            />
        </aside>
    );
}

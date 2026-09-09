'use client';

import { useEffect, useRef, useState } from 'react';

import { AUTH_QUOTES_APP } from '@rumtelo/i18n';
import { AuthManifesto } from '@rumtelo/ui';

/** Pexels clip (download id 17337078) — dark background. */
const AUTH_ASIDE_VIDEO =
    'https://videos.pexels.com/video-files/15179376/15179376-uhd_1920_1440_60fps.mp4';

/**
 * Desktop auth manifesto — habit quotes to pull them back into the product.
 * Respects prefers-reduced-motion (first quote stays; no video).
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
                quotes={AUTH_QUOTES_APP}
                reduceMotion={reduceMotion}
                autoRotate={false}
                footer="portals"
            />
        </aside>
    );
}

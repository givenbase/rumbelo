'use client';

import { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../../forms/Button';
import { STATUS_COPY } from './copy';
import type { StatusPageProps } from './types';

/** Brand fallbacks mirror packages/config/tailwind/theme.css (light teal). */
const FALLBACK = {
    bg: '#EDEFF3',
    fg: '#0E1116',
    muted: '#5B6575',
    line: '#D5DAE3',
    surface: '#FFFFFF',
    raised: '#F5F6F9',
    accent: '#0f766e',
    accentHover: '#0d9488',
    danger: '#dc2626',
    onAccent: '#FFFFFF',
} as const;

/**
 * Full-viewport status / error surface for Next.js `error`, `global-error`,
 * and `not-found` routes. Self-contained enough to render when the app shell
 * or theme provider failed — uses design tokens with Rumbelo teal fallbacks.
 */
export function StatusPage({
    type,
    statusCode,
    errorDetails,
    reset,
    homeHref = '/',
    homeLabel,
    title,
    description,
}: StatusPageProps) {
    const copy = STATUS_COPY[type];
    const code = statusCode === undefined ? copy.code : statusCode;
    const showDetails =
        type === 'error' && Boolean(errorDetails) && process.env.NODE_ENV === 'development';
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = window.setTimeout(() => setVisible(true), 40);
        return () => window.clearTimeout(t);
    }, []);

    const resolvedHomeLabel = homeLabel ?? (homeHref === '/' ? 'Back home' : 'Continue');

    return (
        <div
            className={cn(
                'relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12 sm:px-6',
                'transition-opacity duration-500 ease-out',
                visible ? 'opacity-100' : 'opacity-0'
            )}
            style={{
                backgroundColor: `var(--color-bg, ${FALLBACK.bg})`,
                backgroundImage: 'var(--gradient-page, none)',
                color: `var(--color-fg, ${FALLBACK.fg})`,
            }}>
            <div
                className={cn(
                    'relative w-full max-w-md overflow-hidden rounded-3xl',
                    'px-6 py-8 text-center sm:px-8 sm:py-10'
                )}
                style={{
                    background: `var(--color-surface, ${FALLBACK.surface})`,
                    border: `1px solid var(--color-line, ${FALLBACK.line})`,
                    boxShadow:
                        'var(--shadow-lg, 0 2px 4px rgb(14 17 22 / 0.06), 0 14px 34px rgb(14 17 22 / 0.1)), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
                }}>
                <span
                    className="absolute inset-x-0 top-0 block h-1"
                    style={{
                        background: `var(--gradient-accent, linear-gradient(135deg, ${FALLBACK.accentHover}, ${FALLBACK.accent}))`,
                    }}
                    aria-hidden
                />

                <p
                    className="mb-4 font-mono text-xs font-medium tracking-widest uppercase"
                    style={{ color: `var(--color-accent, ${FALLBACK.accent})` }}>
                    ✦ {code ? String(code) : 'Rumbelo'}
                </p>

                <p
                    className="mb-3 font-display text-lg font-semibold tracking-tight"
                    style={{ color: `var(--color-fg, ${FALLBACK.fg})` }}>
                    Rumbelo
                </p>

                <h1 className="font-display text-[clamp(1.5rem,4vw,1.875rem)] leading-tight font-semibold tracking-tight">
                    {title ?? copy.title}
                </h1>

                <p
                    className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
                    style={{ color: `var(--color-fg-muted, ${FALLBACK.muted})` }}>
                    {description ?? copy.description}
                </p>

                {showDetails ? (
                    <pre
                        className="mt-5 max-h-40 overflow-auto rounded-xl px-3.5 py-3 text-left font-mono text-xs leading-relaxed wrap-break-word whitespace-pre-wrap"
                        style={{
                            border: `1px solid color-mix(in oklab, var(--color-danger, ${FALLBACK.danger}) 30%, transparent)`,
                            background: `color-mix(in oklab, var(--color-danger, ${FALLBACK.danger}) 8%, transparent)`,
                            color: `var(--color-danger, ${FALLBACK.danger})`,
                        }}>
                        {errorDetails}
                    </pre>
                ) : null}

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                    {reset ? (
                        <Button
                            type="button"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={reset}>
                            Try again
                        </Button>
                    ) : null}
                    <Button
                        as="a"
                        href={homeHref}
                        variant={reset ? 'secondary' : 'primary'}
                        size="lg"
                        className="w-full sm:w-auto">
                        {resolvedHomeLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => {
                            if (typeof window !== 'undefined' && window.history.length > 1) {
                                window.history.back();
                            } else if (typeof window !== 'undefined') {
                                window.location.href = homeHref;
                            }
                        }}>
                        Go back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { StatusPageProps, StatusType } from './types';

'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { cn } from '../lib/utils';

type ThemeToggleProps = {
    className?: string;
    /** Accessible name when icon alone is not enough. */
    'aria-label'?: string;
    /**
     * Called after the local theme flips. Use to persist when signed in
     * (e.g. account settings). Receives the preference being applied.
     */
    onThemeChange?: (next: 'light' | 'dark') => void;
};

function subscribe() {
    return () => undefined;
}

/**
 * Light / dark toggle via `next-themes`. Waits for client mount so the icon
 * matches the resolved theme without a hydration mismatch.
 */
export function ThemeToggle({
    className,
    'aria-label': ariaLabel,
    onThemeChange,
}: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );

    const isDark = mounted && resolvedTheme === 'dark';
    const label = ariaLabel ?? (isDark ? 'Switch to light mode' : 'Switch to dark mode');

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            disabled={!mounted}
            onClick={() => {
                const next = isDark ? 'light' : 'dark';
                setTheme(next);
                onThemeChange?.(next);
            }}
            className={cn(
                'grid size-9 place-items-center rounded-lg border border-line text-fg-secondary transition-colors hover:bg-raised hover:text-fg disabled:opacity-60',
                className
            )}
            suppressHydrationWarning>
            <span aria-hidden>{isDark ? '☾' : '☀'}</span>
        </button>
    );
}

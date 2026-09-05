'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/** Matches CSS `[data-theme]` + existing localStorage key. */
export const THEME_STORAGE_KEY = 'rumbelo-theme';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * App-wide theme — `next-themes` owns storage, flash prevention, and system mode.
 * CSS tokens key off `[data-theme='light'|'dark']`.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            storageKey={THEME_STORAGE_KEY}
            disableTransitionOnChange
            {...props}>
            {children}
        </NextThemesProvider>
    );
}

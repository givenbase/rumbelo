'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@rumtelo/ui';

export function Providers({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}

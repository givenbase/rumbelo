'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@rumbelo/ui';

export function Providers({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}

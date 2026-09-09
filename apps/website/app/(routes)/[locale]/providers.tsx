'use client';

import { Suspense, type ReactNode } from 'react';

import { ThemeProvider } from '@rumtelo/ui';

import { PlanIntentProvider } from '@/app/_components/plan-intent-provider';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <Suspense fallback={null}>
                <PlanIntentProvider>{children}</PlanIntentProvider>
            </Suspense>
        </ThemeProvider>
    );
}

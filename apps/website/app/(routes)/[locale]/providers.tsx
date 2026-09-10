'use client';

import { Suspense, type ReactNode } from 'react';

import { ThemeProvider } from '@rumtelo/ui';

import { MarketingSessionProvider } from '@/app/_components/marketing-session-provider';
import { PlanIntentProvider } from '@/app/_components/plan-intent-provider';
import { SignUpDraftProvider } from '@/app/_components/sign-up-draft-provider';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <Suspense fallback={null}>
                <MarketingSessionProvider>
                    <PlanIntentProvider>
                        <SignUpDraftProvider>{children}</SignUpDraftProvider>
                    </PlanIntentProvider>
                </MarketingSessionProvider>
            </Suspense>
        </ThemeProvider>
    );
}

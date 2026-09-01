'use client';

import { ApiProvider } from '@rumbelo/contracts/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { env } from '@/app/_utils/get-env';
import { AppShellProvider } from '@/components/features/shell/app-shell-context';
import { AuthProvider } from '@/components/features/shell/auth-provider';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        retry: (failureCount, error) => {
                            const status = (error as { status?: number })?.status;
                            if (status === 401 || status === 403) return false;
                            return failureCount < 2;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ApiProvider url={env.NEXT_PUBLIC_API_URL}>
                    <AppShellProvider>{children}</AppShellProvider>
                </ApiProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

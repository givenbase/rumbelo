'use client';

import { ApiProvider } from '@rumbelo/contracts/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { backendRpcUrl } from '@/app/_utils/portal-urls';
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
                <ApiProvider url={backendRpcUrl()}>
                    <AppShellProvider>{children}</AppShellProvider>
                </ApiProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

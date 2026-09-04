'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { setClientHouseholdId } from '@/app/_lib/household-api-context';
import { AppShellProvider } from '@/components/features/shell/app-shell-context';
import { AuthProvider, useAuth } from '@/components/features/shell/auth-provider';

/** Keeps OpenAPILink headers in sync without remounting the oRPC client. */
function HouseholdHeaderSync({ children }: { children: ReactNode }) {
    const { householdId } = useAuth();
    useEffect(() => {
        setClientHouseholdId(householdId);
    }, [householdId]);
    return children;
}

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
                <HouseholdHeaderSync>
                    <AppShellProvider>{children}</AppShellProvider>
                </HouseholdHeaderSync>
            </AuthProvider>
        </QueryClientProvider>
    );
}

'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    type ReactNode,
} from 'react';

import {
    activeHouseholdId,
    listOrganizations,
    setActiveOrganization,
    useSession,
} from '@/app/_lib/auth';

interface AuthCtx {
    session: ReturnType<typeof useSession>['data'];
    isPending: boolean;
    householdId: string | null;
    refreshSession: () => Promise<void>;
    setActiveHousehold: (organizationId: string) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending, refetch } = useSession();
    const activating = useRef(false);

    const householdId = activeHouseholdId(session);

    const refreshSession = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const setActiveHousehold = useCallback(
        async (organizationId: string) => {
            await setActiveOrganization(organizationId);
            await refetch();
        },
        [refetch]
    );

    // Demo / first login: activate the only household if session has none.
    useEffect(() => {
        if (isPending || !session?.user || householdId || activating.current) return;
        activating.current = true;
        void (async () => {
            try {
                const orgs = await listOrganizations();
                const first = orgs.data?.[0];
                if (first?.id) {
                    await setActiveOrganization(first.id);
                    await refetch();
                }
            } finally {
                activating.current = false;
            }
        })();
    }, [isPending, session?.user, householdId, refetch]);

    const value = useMemo(
        () => ({ session, isPending, householdId, refreshSession, setActiveHousehold }),
        [session, isPending, householdId, refreshSession, setActiveHousehold]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

export function useHouseholdId(): string | null {
    return useAuth().householdId;
}

export function useRequireHouseholdId(): string {
    const id = useHouseholdId();
    if (!id) throw new Error('No active household — complete onboarding first');
    return id;
}

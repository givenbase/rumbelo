'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from 'react';
import { useSearchParams } from 'next/navigation';

import type { PendingPlanIntent } from '@rumtelo/utils';
import {
    clearPlanIntent,
    getPlanIntentServerSnapshot,
    getPlanIntentSnapshot,
    parsePlanIntent,
    planIntentFromSearchParams,
    serializePlanIntent,
    subscribePlanIntent,
    writePlanIntent,
} from '@rumtelo/utils';

import { env } from '@/app/_utils/get-env';

type PlanIntentContextValue = {
    intent: PendingPlanIntent | null;
    setIntent: (next: PendingPlanIntent | null) => void;
    clearIntent: () => void;
};

const PlanIntentContext = createContext<PlanIntentContextValue | null>(null);

function domainUrls() {
    return [env.NEXT_PUBLIC_DOMAIN_WEB, env.NEXT_PUBLIC_DOMAIN_APP];
}

/**
 * Carries paid marketing plan intent into the product app (query + cookie/session).
 */
export function PlanIntentProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const storedSnapshot = useSyncExternalStore(
        subscribePlanIntent,
        getPlanIntentSnapshot,
        getPlanIntentServerSnapshot
    );
    const stored = useMemo(() => parsePlanIntent(storedSnapshot || null), [storedSnapshot]);

    const planParam = searchParams.get('plan') ?? searchParams.get('planKey');
    const intervalParam = searchParams.get('interval');
    const clearFromQuery = planParam?.toUpperCase() === 'BASIC';

    const fromQuery = useMemo(() => {
        if (clearFromQuery || !planParam) return null;
        return planIntentFromSearchParams(
            new URLSearchParams({
                plan: planParam,
                ...(intervalParam ? { interval: intervalParam } : {}),
            })
        );
    }, [clearFromQuery, planParam, intervalParam]);

    const intent = clearFromQuery ? null : (fromQuery ?? stored);

    useEffect(() => {
        if (clearFromQuery) {
            if (storedSnapshot) clearPlanIntent({ domainUrls: domainUrls() });
            return;
        }
        if (fromQuery && serializePlanIntent(fromQuery) !== storedSnapshot) {
            writePlanIntent(fromQuery, { domainUrls: domainUrls() });
        }
    }, [clearFromQuery, fromQuery, storedSnapshot]);

    const setIntent = useCallback((next: PendingPlanIntent | null) => {
        writePlanIntent(next, { domainUrls: domainUrls() });
    }, []);

    const clearIntent = useCallback(() => {
        clearPlanIntent({ domainUrls: domainUrls() });
    }, []);

    const value = useMemo(
        () => ({ intent, setIntent, clearIntent }),
        [intent, setIntent, clearIntent]
    );

    return <PlanIntentContext.Provider value={value}>{children}</PlanIntentContext.Provider>;
}

export function usePlanIntent(): PlanIntentContextValue {
    const ctx = useContext(PlanIntentContext);
    if (!ctx) {
        throw new Error('usePlanIntent must be used within PlanIntentProvider');
    }
    return ctx;
}

export function useOptionalPlanIntent(): PlanIntentContextValue | null {
    return useContext(PlanIntentContext);
}

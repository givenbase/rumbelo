'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

import { Locale, type PlanKey } from '@rumbelo/contracts';
import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/app/_lib/api-hooks';
import { markOnboardingDone, resetOnboarding } from '@/app/_lib/onboarding-storage';
import { DEFAULT_PLAN } from '@/app/_lib/plan';
import { resolvePreviewPlan } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Period {
    year: number;
    month: number;
}

interface AppShellCtx {
    toast: Toast | null;
    showToast: (message: string, type?: Toast['type']) => void;
    quickOpen: boolean;
    setQuickOpen: (open: boolean) => void;
    toggleQuick: () => void;
    onboardingOpen: boolean;
    onboardingStep: number;
    openOnboarding: (step?: number) => void;
    closeOnboarding: (completed?: boolean) => void;
    resetOnboardingFlow: () => void;
    setOnboardingStep: (step: number) => void;
    plan: PlanKey;
    setPlan: (plan: PlanKey) => void;
    period: Period;
    setPeriod: (period: Period) => void;
    locale: Locale;
    toggleLocale: () => void;
}

const AppShellContext = createContext<AppShellCtx | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
    const api = useApi();
    const { householdId } = useAuth();
    const [toast, setToast] = useState<Toast | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
    const toastId = useRef(0);

    const [quickOpen, setQuickOpen] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [plan, setPlan] = useState<PlanKey>(resolvePreviewPlan(DEFAULT_PLAN));
    const [locale, setLocale] = useState<Locale>(Locale.EN);

    const now = new Date();
    const [period, setPeriod] = useState<Period>({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
    });

    const settingsQuery = useQuery({
        ...api.household.settings.queryOptions({
            input: { householdId: householdId! },
        }),
        enabled: Boolean(householdId),
    });

    useEffect(() => {
        const key = settingsQuery.data?.planKey;
        if (key) setPlan(resolvePreviewPlan(key));
    }, [settingsQuery.data?.planKey]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        const id = ++toastId.current;
        setToast({ id, message, type });
        toastTimer.current = setTimeout(() => setToast(null), 2800);
    }, []);

    const toggleQuick = useCallback(() => setQuickOpen(v => !v), []);

    const openOnboarding = useCallback((step = 0) => {
        setOnboardingStep(step);
        setOnboardingOpen(true);
    }, []);

    const closeOnboarding = useCallback((completed = false) => {
        setOnboardingOpen(false);
        setOnboardingStep(0);
        if (completed) markOnboardingDone();
    }, []);

    const resetOnboardingFlow = useCallback(() => {
        resetOnboarding();
        setOnboardingStep(0);
        setOnboardingOpen(true);
    }, []);

    const toggleLocale = useCallback(
        () => setLocale(l => (l === Locale.NL ? Locale.EN : Locale.NL)),
        []
    );

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setQuickOpen(v => !v);
            }
            if (e.key === 'Escape') {
                setQuickOpen(false);
                setOnboardingOpen(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <AppShellContext.Provider
            value={{
                toast,
                showToast,
                quickOpen,
                setQuickOpen,
                toggleQuick,
                onboardingOpen,
                onboardingStep,
                openOnboarding,
                closeOnboarding,
                resetOnboardingFlow,
                setOnboardingStep,
                plan,
                setPlan,
                period,
                setPeriod,
                locale,
                toggleLocale,
            }}>
            {children}
        </AppShellContext.Provider>
    );
}

export function useAppShell(): AppShellCtx {
    const ctx = useContext(AppShellContext);
    if (!ctx) throw new Error('useAppShell must be used inside <AppShellProvider>');
    return ctx;
}

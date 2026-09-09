'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from 'react';

import {
    clearSignUpDraft,
    getSignUpDraftServerSnapshot,
    getSignUpDraftSnapshot,
    parseSignUpDraft,
    subscribeSignUpDraft,
    writeSignUpDraft,
    type SignUpDraft,
} from '@/lib/sign-up-draft';

type SignUpDraftContextValue = {
    draft: SignUpDraft | null;
    setDraft: (draft: SignUpDraft) => void;
    clearDraft: () => void;
};

const SignUpDraftContext = createContext<SignUpDraftContextValue | null>(null);

/**
 * Holds landing → register hand-off fields without putting email in the URL.
 */
export function SignUpDraftProvider({ children }: { children: ReactNode }) {
    const snapshot = useSyncExternalStore(
        subscribeSignUpDraft,
        getSignUpDraftSnapshot,
        getSignUpDraftServerSnapshot
    );
    const draft = useMemo(
        () => parseSignUpDraft(snapshot ? JSON.parse(snapshot) : null),
        [snapshot]
    );

    const setDraft = useCallback((next: SignUpDraft) => {
        writeSignUpDraft(next);
    }, []);

    const clearDraft = useCallback(() => {
        clearSignUpDraft();
    }, []);

    const value = useMemo(() => ({ draft, setDraft, clearDraft }), [draft, setDraft, clearDraft]);

    return <SignUpDraftContext.Provider value={value}>{children}</SignUpDraftContext.Provider>;
}

export function useSignUpDraft(): SignUpDraftContextValue {
    const ctx = useContext(SignUpDraftContext);
    if (!ctx) {
        throw new Error('useSignUpDraft must be used within SignUpDraftProvider');
    }
    return ctx;
}

export function useOptionalSignUpDraft(): SignUpDraftContextValue | null {
    return useContext(SignUpDraftContext);
}

'use client';

import type { ReactNode } from 'react';

import { useHelpersEnabled } from './provider';

type HelperGateProps = {
    children: ReactNode;
    /** When helpers are off, render this instead (optional). */
    fallback?: ReactNode;
};

/**
 * Wrap any helper UI (jar guide, why-line, coach tip, …).
 * Reads the shared helpers store directly — turns off immediately when Help toggles.
 */
export function HelperGate({ children, fallback = null }: HelperGateProps) {
    const helpersEnabled = useHelpersEnabled();
    if (!helpersEnabled) return <>{fallback}</>;
    return <>{children}</>;
}

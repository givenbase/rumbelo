'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { PlanKey } from '@/app/_lib/plan';
import { LockedGate } from '@/components/features/shell/locked-gate';
import { usePlanCapabilities } from '@/components/features/shell/use-plan-capabilities';

/**
 * Path-level gate — when the route's capability is locked for the active plan,
 * renders only LockedGate (no page content).
 */
export function CapabilityGate({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { accessForPath } = usePlanCapabilities();
    const access = accessForPath(pathname);

    if (!access.locked) return children;

    return (
        <LockedGate
            requiredPlan={access.requiredPlan ?? PlanKey.PLUS}
            capabilityKey={access.capabilityKey}
        />
    );
}

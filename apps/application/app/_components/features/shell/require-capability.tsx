'use client';

import type { ReactNode } from 'react';

import { PlanKey } from '@/app/_lib/plan';
import { LockedGate } from '@/components/features/shell/locked-gate';
import { usePlanCapabilities } from '@/components/features/shell/use-plan-capabilities';

/**
 * Hard gate by explicit capability key.
 * Use in feature layouts so locked routes never mount page content.
 */
export function RequireCapability({
    capabilityKey,
    children,
}: {
    capabilityKey: string;
    children: ReactNode;
}) {
    const { isCapabilityLocked, requiredPlanFor } = usePlanCapabilities();

    if (!isCapabilityLocked(capabilityKey)) return children;

    return (
        <LockedGate
            requiredPlan={requiredPlanFor(capabilityKey) ?? PlanKey.PLUS}
            capabilityKey={capabilityKey}
        />
    );
}

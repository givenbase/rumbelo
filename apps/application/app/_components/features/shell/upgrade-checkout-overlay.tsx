'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { PlanKey } from '@rumtelo/contracts';
import { Button } from '@rumtelo/ui';

import { api } from '@/app/_lib/api';
import { PLAN_LABELS } from '@/app/_lib/plan';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useOptionalPlanIntent } from '@/components/features/shell/plan-intent-provider';

/**
 * After household onboard: if the user picked Plus/Max on marketing pricing,
 * collect payment via Stripe Checkout (card / bank methods Stripe enables).
 */
export function UpgradeCheckoutOverlay({ open, onSkip }: { open: boolean; onSkip: () => void }) {
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const planIntent = useOptionalPlanIntent();
    const intent = planIntent?.intent ?? null;
    const [busy, setBusy] = useState(false);

    const checkout = useMutation({
        mutationFn: async () => {
            if (!householdId || !intent) throw new Error('Missing household or plan');
            return api.billing.createCheckoutSession({
                householdId,
                planKey: intent.planKey,
                interval: intent.interval,
            });
        },
        onSuccess: result => {
            planIntent?.clearIntent();
            if (result.url) {
                window.location.assign(result.url);
                return;
            }
            if (result.applied) {
                showToast(`${PLAN_LABELS[intent!.planKey]} is active`, 'success');
                onSkip();
            }
        },
        onError: () => {
            showToast('Could not start Stripe checkout — try Settings → Plan', 'error');
            setBusy(false);
        },
    });

    if (!open || !intent || !householdId) return null;
    if (intent.planKey !== PlanKey.PLUS && intent.planKey !== PlanKey.MAX) return null;

    const label = PLAN_LABELS[intent.planKey];
    const period = intent.interval === 'year' ? 'yearly' : 'monthly';

    return (
        <>
            <div aria-hidden="true" className="fixed inset-0 z-70 bg-scrim/70" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Upgrade to ${label}`}
                className="fixed top-1/2 left-1/2 z-71 w-full max-w-md -translate-1/2 animate-rise rounded-2xl border border-line-strong bg-surface p-6 shadow-xl">
                <p className="font-mono text-xs font-semibold tracking-widest text-accent uppercase">
                    Finish your upgrade
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fg">
                    Add payment for {label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    You chose {label} ({period}) when you signed up. Continue to Stripe to add your
                    card or bank payment method and activate the plan. You can skip and stay on
                    Basic for now — upgrade anytime in Settings → Plan.
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        variant="ghost"
                        disabled={busy || checkout.isPending}
                        onClick={() => {
                            planIntent?.clearIntent();
                            onSkip();
                        }}>
                        Stay on Basic
                    </Button>
                    <Button
                        disabled={busy || checkout.isPending}
                        onClick={() => {
                            setBusy(true);
                            checkout.mutate();
                        }}>
                        {checkout.isPending || busy ? 'Opening Stripe…' : `Continue to Stripe`}
                    </Button>
                </div>
            </div>
        </>
    );
}

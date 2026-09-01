'use client';

import { useApiClient } from '@rumbelo/contracts/react';
import { useEffect, useState } from 'react';

import { Button, Field, Input } from '@rumbelo/ui';

import { markOnboardingDone } from '@/app/_lib/onboarding-storage';
import { JAR_META } from '@/app/_mock';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

const STEPS = [
    { title: 'Welcome to Rumbelo', body: 'Money with intention. Six jars, one calm overview.' },
    { title: 'Your income', body: 'What is your net monthly income?' },
    { title: 'The six jars', body: 'Your income is split immediately — pay your future first.' },
    { title: 'Your why', body: 'One sentence on your dashboard. The check when money gets tight.' },
];

export function OnboardingOverlay() {
    const client = useApiClient();
    const { session, householdId, setActiveHousehold, refreshSession } = useAuth();
    const {
        onboardingOpen,
        onboardingStep,
        closeOnboarding,
        setOnboardingStep,
        showToast,
        openOnboarding,
    } = useAppShell();

    useEffect(() => {
        if (session && !householdId) openOnboarding();
    }, [session, householdId, openOnboarding]);

    const [householdName, setHouseholdName] = useState('My household');
    const [monthlyIncome, setMonthlyIncome] = useState('4300');
    const [why, setWhy] = useState('');
    const [pending, setPending] = useState(false);

    if (!session || householdId) return null;
    if (!onboardingOpen) return null;

    const step = STEPS[onboardingStep] ?? STEPS[0]!;
    const isLast = onboardingStep >= STEPS.length - 1;

    async function finish() {
        setPending(true);
        try {
            const euros = Math.round(parseFloat(monthlyIncome.replace(',', '.')) * 100);
            const split = JAR_META.map(j => ({ key: j.key, percentage: j.pct }));
            const household = await client.household.onboard({
                householdName,
                currency: 'EUR',
                locale: 'nl',
                monthlyNetIncome: Number.isFinite(euros) ? euros : 0,
                split,
                why: why.trim() || null,
            });
            await setActiveHousehold(household.id);
            await refreshSession();
            markOnboardingDone();
            closeOnboarding(true);
            showToast('Household created', 'success');
        } catch {
            showToast('Setup failed — please try again', 'error');
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <div aria-hidden="true" className="fixed inset-0 z-70 bg-scrim/70" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Welcome to Rumbelo"
                className="fixed top-1/2 left-1/2 z-71 w-full max-w-md -translate-1/2 animate-rise rounded-2xl border border-line-strong bg-surface p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <p className="font-mono text-xs font-semibold tracking-widest text-accent uppercase">
                        Step {onboardingStep + 1} of {STEPS.length}
                    </p>
                </div>

                <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.body}</p>

                {onboardingStep === 1 && (
                    <div className="mt-4">
                        <Field label="Net monthly income (€)" htmlFor="income">
                            <Input
                                id="income"
                                inputMode="decimal"
                                value={monthlyIncome}
                                onChange={e => setMonthlyIncome(e.target.value)}
                            />
                        </Field>
                    </div>
                )}

                {onboardingStep === 2 && (
                    <ul className="mt-4 grid gap-2">
                        {JAR_META.map(j => (
                            <li
                                key={j.key}
                                className="flex items-center justify-between rounded-xl border border-line bg-raised px-3 py-2 text-sm">
                                <span>
                                    {j.icon} {j.name}
                                </span>
                                <span className="font-mono text-fg-muted">{j.pct}%</span>
                            </li>
                        ))}
                    </ul>
                )}

                {onboardingStep === 3 && (
                    <div className="mt-4 grid gap-3">
                        <Field label="Household name" htmlFor="household">
                            <Input
                                id="household"
                                value={householdName}
                                onChange={e => setHouseholdName(e.target.value)}
                            />
                        </Field>
                        <Field label="Your why" htmlFor="why">
                            <textarea
                                id="why"
                                rows={3}
                                value={why}
                                onChange={e => setWhy(e.target.value)}
                                className="w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm"
                                placeholder="Why are you doing this?"
                            />
                        </Field>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                        {STEPS.map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === onboardingStep ? 'w-5 bg-accent' : 'w-1.5 bg-sunken'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {onboardingStep > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOnboardingStep(onboardingStep - 1)}>
                                Back
                            </Button>
                        )}
                        {isLast ? (
                            <Button size="sm" onClick={() => void finish()} disabled={pending}>
                                {pending ? 'Working…' : 'Done'}
                            </Button>
                        ) : (
                            <Button size="sm" onClick={() => setOnboardingStep(onboardingStep + 1)}>
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

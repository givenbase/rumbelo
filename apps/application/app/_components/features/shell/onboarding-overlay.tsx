'use client';

import { useApiClient } from '@/app/_lib/api-hooks';
import { useEffect, useState } from 'react';

import { Currency, IncomeRhythm, Locale, MoneyCharacter } from '@rumbelo/contracts';
import { Button, Field, Input } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

import { markOnboardingDone } from '@/app/_lib/onboarding-storage';
import { JAR_META } from '@/app/_mock';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

const STEPS = [
    { title: 'Welcome to Rumbelo', body: 'Stop wondering where it went. Six jars, one calm overview.' },
    { title: 'Your income', body: 'What is your net monthly income?' },
    { title: 'The six jars', body: 'Your income is split immediately — pay your future first.' },
    {
        title: 'How you handle money',
        body: 'Soft labels only — so tips fit you. Partners can choose differently later.',
    },
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
    const [moneyCharacter, setMoneyCharacter] = useState(MoneyCharacter.UNKNOWN);
    const [incomeRhythm, setIncomeRhythm] = useState(IncomeRhythm.STABLE);
    const [pending, setPending] = useState(false);

    if (!session || householdId) return null;
    if (!onboardingOpen) return null;

    const step = STEPS[onboardingStep] ?? STEPS[0]!;
    const isLast = onboardingStep >= STEPS.length - 1;

    async function finish() {
        setPending(true);
        try {
            const euros = Math.round(parseFloat(monthlyIncome.replace(',', '.')) * 100);
            const split = JAR_META.map(jar => ({ key: jar.key, percentage: jar.pct }));
            const household = await client.household.onboard({
                householdName,
                currency: Currency.EUR,
                locale: Locale.NL,
                moneyCharacter,
                incomeRhythm,
                monthlyNetIncome: Number.isFinite(euros) ? euros : 0,
                split,
                why: why.trim() || null,
            });
            await setActiveHousehold(household.id);
            await refreshSession();
            markOnboardingDone();
            closeOnboarding(true);
            showToast('Household created', 'success');
        } catch (error) {
            console.error('onboard failed', error);
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : 'Setup failed — please try again';
            showToast(message, 'error');
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
                                onChange={event => setMonthlyIncome(event.target.value)}
                            />
                        </Field>
                        <div className="mt-3">
                            <Field label="Household name" htmlFor="hh-name">
                                <Input
                                    id="hh-name"
                                    value={householdName}
                                    onChange={event => setHouseholdName(event.target.value)}
                                />
                            </Field>
                        </div>
                    </div>
                )}

                {onboardingStep === 2 && (
                    <ul className="mt-4 grid gap-2">
                        {JAR_META.map(jar => (
                            <li
                                key={jar.key}
                                className="flex items-center justify-between rounded-xl border border-line bg-raised px-3 py-2">
                                <span className="text-sm text-fg">
                                    {jar.icon} {jar.name}
                                </span>
                                <span className="font-mono text-xs text-fg-muted">{jar.pct}%</span>
                            </li>
                        ))}
                    </ul>
                )}

                {onboardingStep === 3 && (
                    <div className="mt-4 grid gap-4">
                        <div>
                            <p className="mb-2 font-mono text-[10px] tracking-[0.12em] text-fg-muted uppercase">
                                I tend to…
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {(
                                    [
                                        { key: MoneyCharacter.SPENDER, label: 'Spender' },
                                        { key: MoneyCharacter.SAVER, label: 'Saver' },
                                        { key: MoneyCharacter.BALANCED, label: 'Balanced' },
                                        { key: MoneyCharacter.UNKNOWN, label: 'Not sure' },
                                    ] as const
                                ).map(option => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => setMoneyCharacter(option.key)}
                                        className={cn(
                                            'rounded-full border px-3 py-1.5 text-xs transition-colors',
                                            moneyCharacter === option.key
                                                ? 'border-accent bg-accent-soft text-accent'
                                                : 'border-line text-fg-muted hover:text-fg'
                                        )}>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 font-mono text-[10px] tracking-[0.12em] text-fg-muted uppercase">
                                Income month to month
                            </p>
                            <div className="flex gap-1.5">
                                {(
                                    [
                                        { key: IncomeRhythm.STABLE, label: 'Stable' },
                                        { key: IncomeRhythm.VARIABLE, label: 'Variable' },
                                    ] as const
                                ).map(option => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => setIncomeRhythm(option.key)}
                                        className={cn(
                                            'rounded-full border px-3 py-1.5 text-xs transition-colors',
                                            incomeRhythm === option.key
                                                ? 'border-accent bg-accent-soft text-accent'
                                                : 'border-line text-fg-muted hover:text-fg'
                                        )}>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {onboardingStep === 4 && (
                    <div className="mt-4">
                        <Field label="Why are you here?" htmlFor="why">
                            <Input
                                id="why"
                                value={why}
                                onChange={event => setWhy(event.target.value)}
                                placeholder="e.g. Stop guessing where the money went"
                            />
                        </Field>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="flex gap-1">
                        {STEPS.map((_, index) => (
                            <span
                                key={STEPS[index]!.title}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    index === onboardingStep ? 'w-5 bg-accent' : 'w-1.5 bg-sunken'
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {onboardingStep > 0 && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setOnboardingStep(onboardingStep - 1)}>
                                Back
                            </Button>
                        )}
                        {isLast ? (
                            <Button size="sm" disabled={pending} onClick={() => void finish()}>
                                {pending ? 'Creating…' : 'Start'}
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

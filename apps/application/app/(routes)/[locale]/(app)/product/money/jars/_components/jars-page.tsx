'use client';

import { useApi } from '@/app/_lib/api-hooks';
import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { CADENCE_TO_MONTHLY } from '@rumbelo/contracts';
import { useLiveQuery } from '@rumbelo/hooks';
import { Card, Eyebrow } from '@rumbelo/ui';
import { formatMoney, toPeriodKey, cn } from '@rumbelo/utils';

import { CREATE_HREF } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { JAR_META } from '@/app/_lib/jar-meta';
import { JarSummaryRow } from '@/components/features/money/jar-summary-row';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { ListToolbar, ListToolbarTab } from '@/components/layout/list-toolbar';

type Tab = 'JARS' | 'SIMULATOR';

/**
 * Simulator bounds relative to real monthly income.
 * 0.5× covers a pay cut / one income gone; 2× covers a raise or side income.
 * Beyond that the what-if stops being planning. Tune here, nowhere else.
 */
const SIM_STEP_EUROS = 50;
const SIM_FLOOR_EUROS = 500;
const SIM_MIN_RATIO = 0.5;
const SIM_MAX_RATIO = 2;
/** Used only when the household has no active income yet. */
const SIM_FALLBACK_RANGE_EUROS = { min: 500, max: 8_000, value: 4_300 } as const;

function toCssVar(bgClass: string) {
    return bgClass.replace('bg-', 'var(--color-') + ')';
}

function roundToStep(euros: number) {
    return Math.round(euros / SIM_STEP_EUROS) * SIM_STEP_EUROS;
}

/** Slider bounds anchored on real income; falls back to a generic range without income. */
function simRange(netMonthlyCents: number) {
    if (netMonthlyCents <= 0) return SIM_FALLBACK_RANGE_EUROS;
    const current = roundToStep(netMonthlyCents / 100);
    const min = Math.max(SIM_FLOOR_EUROS, roundToStep(current * SIM_MIN_RATIO));
    const max = Math.max(min + SIM_STEP_EUROS, roundToStep(current * SIM_MAX_RATIO));
    return { min, max, value: Math.min(max, Math.max(min, current)) };
}

function isGoalOpen(goal: { saved: number; target: number }) {
    return goal.saved < goal.target;
}

/**
 * Jars screen — design Kluis Finance App.dc.html :689-839.
 * ListToolbar create stays (+ Move money → URL modal). No dashed add CTAs.
 */
export function JarsPageClient() {
    const api = useApi();
    const { householdId } = useAuth();
    const { period } = useAppShell();
    const router = useRouter();
    const periodKey = toPeriodKey(period.year, period.month);
    const live = isLiveData(householdId);
    const [tab, setTab] = useState<Tab>('JARS');

    /** User override only — `null` means "follow real income". */
    const [simOverrideEuros, setSimOverrideEuros] = useState<number | null>(null);
    const [goalId, setGoalId] = useState<string>('');
    /** User deadline override — `null` means "follow projected months at pace". */
    const [wantOverrideMonths, setWantOverrideMonths] = useState<number | null>(null);

    const jarsQuery = useLiveQuery(
        api.money.jars.balances.queryOptions({
            input: { householdId: householdId!, period: periodKey },
        }),
        [] as never,
        live
    );

    const incomeQuery = useLiveQuery(
        api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const goalsQuery = useLiveQuery(
        api.money.goals.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const jars = jarsQuery.data ?? [];
    const goals = goalsQuery.data ?? [];
    // Monthly-normalised, same rule as JarService.monthlyNetIncome() on the backend.
    const net = Math.round(
        (incomeQuery.data ?? [])
            .filter(source => source.isActive)
            .reduce(
                (total, source) =>
                    total + source.amount * (CADENCE_TO_MONTHLY[source.cadence] ?? 0),
                0
            )
    );
    const totalPct = jars.reduce((total, j) => total + j.percentage, 0);
    const onTarget = jars.filter(j => !j.overspent).length;

    const range = simRange(net);
    const simEuros =
        simOverrideEuros === null
            ? range.value
            : Math.min(range.max, Math.max(range.min, simOverrideEuros));
    const simCents = simEuros * 100;
    const simDeltaPct = net > 0 ? Math.round(((simCents - net) / net) * 100) : 0;
    const openGoals = goals.filter(isGoalOpen);
    const picked = goals.find(candidate => candidate.id === goalId);
    // Default to the first open goal so the pacing slider has something to do.
    const goal = picked ?? openGoals[0] ?? goals[0];
    const nextOpenGoal = openGoals.find(candidate => candidate.id !== goal?.id) ?? openGoals[0];
    const goalJar =
        (goal?.jarId ? jars.find(j => j.id === goal.jarId) : undefined) ??
        jars.find(j => j.key === 'LONG_TERM_SAVINGS') ??
        jars.find(j => j.key === 'FINANCIAL_FREEDOM');
    const goalJarPct = goalJar?.percentage ?? 10;
    const goalJarName = goalJar?.name ?? 'Long Term Savings';
    const goalPerMonth = Math.round((simCents * goalJarPct) / 100);
    const remaining = goal ? Math.max(0, goal.target - goal.saved) : 0;
    const goalReached = Boolean(goal) && remaining <= 0;
    const monthsAtPace =
        goalPerMonth > 0 ? Math.ceil(remaining / goalPerMonth) : Number.POSITIVE_INFINITY;
    // Follow real pace until the user sets their own deadline.
    const suggestedWant = Number.isFinite(monthsAtPace)
        ? Math.min(120, Math.max(3, monthsAtPace))
        : 36;
    const wantMonths = wantOverrideMonths ?? suggestedWant;
    const needPerMonth = wantMonths > 0 ? Math.ceil(remaining / wantMonths) : remaining;
    const aheadOfWant =
        Number.isFinite(monthsAtPace) && monthsAtPace > 0 && monthsAtPace <= wantMonths;
    const onWantTarget =
        Number.isFinite(monthsAtPace) &&
        monthsAtPace > 0 &&
        Math.abs(monthsAtPace - wantMonths) <= 1;

    const whenLabel = useMemo(() => {
        if (!Number.isFinite(monthsAtPace)) return '—';
        if (monthsAtPace <= 0) return 'Now';
        const date = new Date();
        date.setMonth(date.getMonth() + monthsAtPace);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }, [monthsAtPace]);

    const paceMessage = useMemo(() => {
        if (goalPerMonth <= 0) {
            return 'At this income nothing lands in this jar — raise the simulator or change the split.';
        }
        if (!Number.isFinite(monthsAtPace)) {
            return 'Not enough landing in this jar to project a date yet.';
        }
        if (onWantTarget) {
            return `Right on your target — about ${monthsAtPace} months (${whenLabel}).`;
        }
        if (aheadOfWant) {
            return `On pace. You'll hit it in about ${monthsAtPace} months (${whenLabel}) — sooner than your ${wantMonths}-month target.`;
        }
        return `To hit it within ${wantMonths} months you need ${formatMoney(needPerMonth)}/mo in this jar (now ${formatMoney(goalPerMonth)}).`;
    }, [
        aheadOfWant,
        goalPerMonth,
        monthsAtPace,
        needPerMonth,
        onWantTarget,
        wantMonths,
        whenLabel,
    ]);

    return (
        <div className="grid animate-rise gap-8">
            <div>
                <Eyebrow className="text-accent">✦ THE SIX JARS</Eyebrow>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
                    Every euro gets a job before it arrives.
                </h1>
                <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
                    Income lands, the split happens the same second. Financial Freedom is never
                    spent — only invested.
                </p>
            </div>

            <ListToolbar
                createLabel="+ Move money"
                onCreate={() => router.push(CREATE_HREF.move)}
                secondary={
                    tab === 'JARS' ? (
                        <span className="font-mono text-xs font-medium text-fg-faint">
                            {onTarget} / {jars.length} on track
                        </span>
                    ) : net > 0 ? (
                        <span className="font-mono text-xs font-medium text-fg-faint">
                            Income {formatMoney(net)}/mo
                        </span>
                    ) : null
                }>
                {(['JARS', 'SIMULATOR'] as const).map(tabKey => (
                    <ListToolbarTab
                        key={tabKey}
                        active={tab === tabKey}
                        onClick={() => setTab(tabKey)}>
                        {tabKey === 'JARS' ? 'Jars' : 'Simulator'}
                        {tabKey === 'JARS' && (
                            <span
                                className={cn(
                                    'rounded-full px-2 py-0.5 font-mono text-xs',
                                    tab === tabKey
                                        ? 'bg-accent/10 text-accent'
                                        : 'bg-raised text-fg-faint'
                                )}>
                                {Math.round(totalPct * 10) / 10}%
                            </span>
                        )}
                    </ListToolbarTab>
                ))}
            </ListToolbar>

            {tab === 'JARS' && (
                <>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 font-mono text-xs font-medium tracking-wide text-accent uppercase">
                            {jars.length} jars · {Math.round(totalPct * 10) / 10}% allocated
                        </span>
                        <span className="font-mono text-xs font-medium text-fg-faint">
                            Tap a jar for fixed costs, spends, and what is left
                        </span>
                    </div>

                    <div className="grid gap-2">
                        {jars.map(jar => {
                            const meta = JAR_META.find(entry => entry.key === jar.key);
                            return (
                                <JarSummaryRow
                                    key={jar.id}
                                    jar={{
                                        id: jar.id,
                                        key: jar.key,
                                        name: jar.name,
                                        subtitle: jar.subtitle ?? meta?.subtitle ?? '',
                                        icon: jar.icon ?? meta?.icon ?? '◇',
                                        color: meta?.color ?? 'bg-jar-nec',
                                        percentage: jar.percentage,
                                        allocated: jar.allocated,
                                        available: jar.available,
                                        spent: jar.spent,
                                        committedOut: jar.committedOut,
                                        overspent: jar.overspent,
                                        categoryCount: jar.categories?.length ?? 0,
                                    }}
                                />
                            );
                        })}
                    </div>

                    <p className="font-mono text-xs text-fg-faint">
                        {onTarget} / {jars.length} jars on track this period
                    </p>
                </>
            )}

            {tab === 'SIMULATOR' && (
                <Card className="p-5 lg:p-6">
                    <Eyebrow className="text-accent">✦ SPLIT SIMULATOR</Eyebrow>
                    <p className="mt-2 text-sm text-fg-muted">
                        Drag the amount to see what lands in each jar. This runs on every income
                        automatically.
                        {net > 0 ? (
                            <>
                                {' '}
                                Current income:{' '}
                                <span className="text-fg-secondary">{formatMoney(net)}</span>/mo.
                            </>
                        ) : null}
                    </p>

                    <div className="my-5 flex flex-wrap items-center gap-4">
                        <input
                            type="range"
                            min={range.min}
                            max={range.max}
                            step={SIM_STEP_EUROS}
                            value={simEuros}
                            onChange={event => setSimOverrideEuros(Number(event.target.value))}
                            className="min-w-0 flex-1 accent-accent"
                            aria-label="Simulate income"
                        />
                        <span className="shrink-0 font-display text-2xl font-semibold tracking-tight text-accent sm:min-w-36 sm:text-3xl">
                            {formatMoney(simCents)}
                        </span>
                    </div>

                    {net > 0 ? (
                        <div className="-mt-3 mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-faint">
                            <span>
                                Range {formatMoney(range.min * 100)} –{' '}
                                {formatMoney(range.max * 100)}
                            </span>
                            {simDeltaPct !== 0 ? (
                                <>
                                    <span aria-hidden>·</span>
                                    <span className="text-fg-secondary">
                                        {simDeltaPct > 0 ? '+' : ''}
                                        {simDeltaPct}% vs current
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSimOverrideEuros(null)}
                                        className="text-accent underline-offset-2 hover:underline">
                                        Reset to current
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span aria-hidden>·</span>
                                    <span>At current income</span>
                                </>
                            )}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                        {jars.map(j => {
                            const meta = JAR_META.find(entry => entry.key === j.key);
                            const color = meta?.color ?? 'bg-jar-nec';
                            return (
                                <div
                                    key={j.id}
                                    className="rounded-xl border border-line bg-raised p-3.5">
                                    <div
                                        className="font-mono text-xs font-medium tracking-wide uppercase"
                                        style={{ color: toCssVar(color) }}>
                                        {j.name}
                                    </div>
                                    <div className="mt-2 font-mono text-lg text-fg">
                                        {formatMoney(Math.round((simCents * j.percentage) / 100))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 border-t border-line pt-5">
                        <Eyebrow className="text-accent">✦ AND WHAT IT BUYS YOU</Eyebrow>
                        <p className="mt-2 max-w-prose text-sm leading-relaxed text-pretty text-fg-muted">
                            Pick a goal and see when this income reaches it — or how much you would
                            need to hit your own date.
                        </p>

                        {goals.length > 0 ? (
                            <div className="my-4 flex flex-wrap gap-1.5">
                                {goals.map(goalItem => {
                                    const isActive = goalItem.id === goal?.id;
                                    const reached = !isGoalOpen(goalItem);
                                    return (
                                        <button
                                            key={goalItem.id}
                                            type="button"
                                            onClick={() => {
                                                setGoalId(goalItem.id);
                                                setWantOverrideMonths(null);
                                            }}
                                            className={cn(
                                                'flex items-center gap-2 rounded-full border px-3 py-2 text-sm whitespace-nowrap transition-colors',
                                                isActive
                                                    ? 'border-accent/40 bg-accent-soft text-accent'
                                                    : 'border-line text-fg-secondary hover:border-accent hover:text-accent',
                                                reached && !isActive && 'opacity-60'
                                            )}>
                                            <span>{goalItem.icon}</span>
                                            {goalItem.name}
                                            {reached ? (
                                                <span className="font-mono text-[10px] tracking-wide uppercase">
                                                    Done
                                                </span>
                                            ) : null}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="my-4 rounded-xl border border-line bg-raised px-3.5 py-4 text-sm text-fg-secondary">
                                No goals yet. Add one to see when this income gets you there.
                                <button
                                    type="button"
                                    onClick={() => router.push(CREATE_HREF.goal)}
                                    className="mt-3 block font-mono text-xs font-medium tracking-wide text-accent uppercase underline-offset-2 hover:underline">
                                    + Add a goal
                                </button>
                            </div>
                        )}

                        {goal && (
                            <div className="flex flex-wrap items-start gap-4 rounded-xl border border-line bg-raised p-4 lg:gap-8 lg:p-5">
                                <div className="grid min-w-0 flex-1 gap-2.5">
                                    <span className="flex flex-wrap items-baseline gap-2.5">
                                        <span className="font-display text-xl font-semibold tracking-tight text-fg">
                                            {goal.name}
                                        </span>
                                        <span className="font-mono text-xs font-medium tracking-wide text-accent uppercase">
                                            {goalJarName}
                                        </span>
                                    </span>
                                    <span className="block h-2 overflow-hidden rounded-full bg-sunken">
                                        <span
                                            className="block h-full rounded-full bg-accent"
                                            style={{
                                                width: `${Math.min(100, Math.round((goal.saved / goal.target) * 100))}%`,
                                            }}
                                        />
                                    </span>
                                    <span className="font-mono text-xs font-medium text-fg-faint">
                                        {formatMoney(goal.saved)} of {formatMoney(goal.target)}
                                    </span>
                                    <p className="mt-1 text-sm leading-relaxed text-pretty text-fg-secondary">
                                        {goalReached
                                            ? 'Already reached. Pick the next one — this is where momentum comes from.'
                                            : `At this income, ${formatMoney(goalPerMonth)}/mo lands in this jar.`}
                                    </p>
                                </div>
                                <div className="grid w-full gap-3.5 sm:w-52">
                                    <span className="grid gap-1">
                                        <span className="font-mono text-xs font-medium tracking-wide whitespace-nowrap text-fg-faint uppercase">
                                            Reached around
                                        </span>
                                        <span className="font-display text-2xl leading-none font-semibold tracking-tight text-accent">
                                            {whenLabel}
                                        </span>
                                    </span>
                                    <span className="grid gap-1">
                                        <span className="font-mono text-xs font-medium tracking-wide whitespace-nowrap text-fg-faint uppercase">
                                            This jar gets
                                        </span>
                                        <span className="font-mono text-base font-medium text-fg">
                                            {formatMoney(goalPerMonth)} / mo
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )}

                        {!goalReached && goal ? (
                            <>
                                <div className="mt-4 flex flex-wrap items-center gap-3.5">
                                    <span className="font-mono text-xs font-medium tracking-wide whitespace-nowrap text-fg-faint uppercase">
                                        Or I want it in
                                    </span>
                                    <input
                                        type="range"
                                        min={3}
                                        max={120}
                                        step={1}
                                        value={wantMonths}
                                        onChange={event =>
                                            setWantOverrideMonths(Number(event.target.value))
                                        }
                                        className="min-w-0 flex-1 accent-accent"
                                        aria-label="Target months"
                                    />
                                    <span className="font-mono text-sm font-medium whitespace-nowrap text-fg-secondary">
                                        {wantMonths} months
                                    </span>
                                    {wantOverrideMonths !== null ? (
                                        <button
                                            type="button"
                                            onClick={() => setWantOverrideMonths(null)}
                                            className="font-mono text-xs text-accent underline-offset-2 hover:underline">
                                            Reset to pace
                                        </button>
                                    ) : null}
                                </div>
                                <p className="mt-3 rounded-xl border border-line bg-raised px-3.5 py-3 text-sm leading-relaxed text-pretty text-fg-secondary">
                                    {paceMessage}
                                </p>
                            </>
                        ) : goal ? (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-raised px-3.5 py-3 text-sm text-fg-secondary">
                                <span>
                                    {nextOpenGoal && nextOpenGoal.id !== goal.id
                                        ? 'This goal is done — keep the momentum going.'
                                        : openGoals.length === 0
                                          ? 'Every goal here is done. Set the next one.'
                                          : 'This goal is done.'}
                                </span>
                                {nextOpenGoal && nextOpenGoal.id !== goal.id ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGoalId(nextOpenGoal.id);
                                            setWantOverrideMonths(null);
                                        }}
                                        className="font-mono text-xs font-medium tracking-wide text-accent uppercase underline-offset-2 hover:underline">
                                        Next: {nextOpenGoal.name}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => router.push(CREATE_HREF.goal)}
                                        className="font-mono text-xs font-medium tracking-wide text-accent uppercase underline-offset-2 hover:underline">
                                        + Add a goal
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </Card>
            )}
        </div>
    );
}

'use client';

import { apiQuery } from '@/app/_lib/api-hooks';
import { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GoalKind, GoalStatus } from '@rumtelo/contracts';
import { useLiveQuery } from '@rumtelo/hooks';
import { AccentCard, Button, Card, Eyebrow } from '@rumtelo/ui';
import { formatMoney, incomeDelta, monthlyNetAsOf, sumMonthly, toPeriodKey } from '@rumtelo/utils';

import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { JAR_META } from '@/app/_lib/jar-meta';
import { jarKeyToSlug } from '@/app/_lib/jar-slug';
import { CoachMark, useHelpersEnabled } from '@/components/features/helpers';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

/** Demo fallback when no ACTIVE EARN goal is set. */
const FALLBACK_TARGET = 600_000;

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function dayBefore(iso: string): string {
    const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
}

export function IncomePageClient() {
    const { householdId } = useAuth();
    const { period } = useAppShell();
    const router = useRouter();
    const coachGuidesEnabled = useHelpersEnabled();
    const periodKey = toPeriodKey(period.year, period.month);
    const live = isLiveData(householdId);

    const incomeQuery = useLiveQuery(
        apiQuery.money.income.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const jarsQuery = useLiveQuery(
        apiQuery.money.jars.balances.queryOptions({
            input: { householdId: householdId!, period: periodKey },
        }),
        [] as never,
        live
    );

    const goalsQuery = useLiveQuery(
        apiQuery.money.goals.list.queryOptions({ input: { householdId: householdId! } }),
        [] as never,
        live
    );

    const allSources = incomeQuery.data ?? [];
    const NET = sumMonthly(allSources);
    const jars = jarsQuery.data ?? [];
    const sources = allSources.filter(source => source.isActive);

    const target = useMemo(() => {
        const earnTargets = (goalsQuery.data ?? [])
            .filter(
                goal =>
                    goal.kind === GoalKind.EARN &&
                    goal.status === GoalStatus.ACTIVE &&
                    goal.target > 0
            )
            .map(goal => goal.target);
        return earnTargets.length > 0 ? Math.max(...earnTargets) : FALLBACK_TARGET;
    }, [goalsQuery.data]);

    const gap = target - NET;

    const newestEffective = sources
        .flatMap(source => source.periods ?? [])
        .map(amountPeriod => amountPeriod.effectiveOn.slice(0, 10))
        .sort()
        .at(-1);
    const delta =
        newestEffective !== undefined
            ? incomeDelta(
                  monthlyNetAsOf(sources, dayBefore(newestEffective)),
                  monthlyNetAsOf(sources, todayIso())
              )
            : null;

    return (
        <div className="grid animate-rise gap-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ MY INCOME
                    </span>
                    <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                        Spending cuts have a floor. Earning doesn't.
                    </h1>
                </div>
                <Button size="sm" onClick={() => router.push(CREATE_HREF.income)}>
                    + Add income
                </Button>
            </div>

            <div
                className={
                    coachGuidesEnabled ? 'grid gap-4 md:grid-cols-2 md:items-stretch' : 'grid gap-4'
                }>
                <div data-tour="income-summary" className="min-w-0">
                    <AccentCard
                        tint="var(--color-accent)"
                        className="grid h-full content-center gap-4 p-4 sm:p-5">
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="grid gap-1">
                                <Eyebrow>Now</Eyebrow>
                                <p className="font-display text-2xl leading-none font-semibold tracking-tight text-fg sm:text-3xl">
                                    {formatMoney(NET)}
                                </p>
                                <p className="font-mono text-[11px] leading-snug text-fg-muted">
                                    {formatMoney(NET * 12)}/yr
                                    {delta && delta.absolute !== 0 ? (
                                        <>
                                            <br />
                                            <span
                                                className={
                                                    delta.absolute > 0
                                                        ? 'text-success'
                                                        : 'text-warning'
                                                }>
                                                {delta.absolute > 0 ? '+' : ''}
                                                {formatMoney(delta.absolute)}
                                            </span>
                                        </>
                                    ) : null}
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <Eyebrow>Target</Eyebrow>
                                <p
                                    className="font-display text-2xl leading-none font-semibold tracking-tight sm:text-3xl"
                                    style={{
                                        background: 'var(--gradient-accent)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                    {formatMoney(target)}
                                </p>
                                <p className="font-mono text-[11px] text-fg-muted">/mo net</p>
                            </div>
                            <div className="grid gap-1">
                                <Eyebrow>Gap</Eyebrow>
                                <p className="font-display text-2xl leading-none font-semibold tracking-tight text-warning sm:text-3xl">
                                    {formatMoney(Math.max(0, gap))}
                                </p>
                                <p className="font-mono text-[11px] text-fg-muted">
                                    {gap <= 0 ? 'met' : 'to go'}
                                </p>
                            </div>
                        </div>
                    </AccentCard>
                </div>

                {coachGuidesEnabled ? (
                    <div data-tour="income-jars" data-coach-guide="income-jars" className="min-w-0">
                        <Card className="grid h-full content-start gap-2 border-accent/20 p-4 shadow-sm ring-1 ring-accent/10 sm:p-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <CoachMark size="sm" />
                                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                                    At target, each jar
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-fg-muted">
                                If you hit your income target with today&apos;s split, each jar
                                would land here. Tap a jar to open it.
                            </p>
                            <div>
                                {JAR_META.map(j => {
                                    const jar = jars.find(mj => mj.key === j.key);
                                    const now = jar?.allocated ?? 0;
                                    const then = Math.round((target * j.pct) / 100);
                                    return (
                                        <Link
                                            key={j.key}
                                            href={`/product/money/jars/${jarKeyToSlug(j.key)}`}
                                            className="flex items-center gap-2 border-b border-line py-2 transition-colors outline-none last:border-b-0 hover:bg-raised focus-visible:bg-raised">
                                            <span className="shrink-0 text-sm">{j.icon}</span>
                                            <span className="min-w-0 flex-1 truncate text-sm text-fg-secondary">
                                                {j.name}
                                            </span>
                                            <span className="shrink-0 font-mono text-xs whitespace-nowrap text-fg-muted">
                                                {formatMoney(now)} →
                                            </span>
                                            <span className="shrink-0 font-mono text-sm whitespace-nowrap text-success">
                                                {formatMoney(then)}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                ) : null}
            </div>

            <div data-tour="income-sources">
                <Card className="p-0">
                    <div className="border-b border-line px-4 py-2.5 sm:px-5">
                        <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                            ✦ Income sources
                        </span>
                    </div>
                    {sources.length === 0 ? (
                        <p className="px-4 py-3.5 text-sm text-fg-muted sm:px-5">
                            {live
                                ? 'No income sources yet — add one to feed your jars.'
                                : 'Sign in to manage income sources.'}
                        </p>
                    ) : (
                        <div className="grid gap-px">
                            {sources.map(source => (
                                <button
                                    type="button"
                                    key={source.id}
                                    onClick={() => router.push(updateHref('income', source.id))}
                                    className="flex w-full items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-left last:border-b-0 hover:bg-raised sm:px-5 sm:py-3">
                                    <div>
                                        <div className="text-sm text-fg">{source.name}</div>
                                        <div className="mt-0.5 font-mono text-xs tracking-normal text-fg-faint">
                                            {source.kind}
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm text-success">
                                        {formatMoney(source.amount)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

'use client';

import { useApi } from '@/app/_lib/api-hooks';

import { useRouter } from 'next/navigation';

import { useLiveQuery } from '@rumbelo/hooks';
import { AccentCard, Card, Eyebrow } from '@rumbelo/ui';
import { formatMoney, toPeriodKey } from '@rumbelo/utils';

import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { JAR_META } from '@/app/_lib/jar-meta';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { ListToolbar } from '@/components/layout/list-toolbar';

const TARGET = 600_000;

const LEVERS = [
    {
        meta: 'Lever 1',
        name: 'Raise your rate',
        desc: 'Every €100 more per day is €2,000 extra per month. One conversation can do it.',
        color: 'var(--color-accent)',
    },
    {
        meta: 'Lever 2',
        name: 'Add a service',
        desc: 'A second product or service has zero fixed costs once the first is running.',
        color: 'var(--color-jar-lts)',
    },
    {
        meta: 'Lever 3',
        name: 'Build passive income',
        desc: 'Something made once that keeps working. Starts small, never zero.',
        color: 'var(--color-jar-ff)',
    },
    {
        meta: 'Lever 4',
        name: 'Activate your network',
        desc: 'Revenue from people costs no marketing. Every happy client is a channel.',
        color: 'var(--color-jar-edu)',
    },
] as const;

export function IncomePageClient() {
    const api = useApi();
    const { householdId } = useAuth();
    const { period } = useAppShell();
    const router = useRouter();
    const periodKey = toPeriodKey(period.year, period.month);
    const live = isLiveData(householdId);

    const incomeQuery = useLiveQuery(
        api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const jarsQuery = useLiveQuery(
        api.money.jars.balances.queryOptions({
            input: { householdId: householdId!, period: periodKey },
        }),
        [] as never,
        live
    );

    const NET = (incomeQuery.data ?? []).filter(s => s.isActive).reduce((s, i) => s + i.amount, 0);
    const GAP = TARGET - NET;
    const jars = jarsQuery.data ?? [];
    const sources = (incomeQuery.data ?? []).filter(s => s.isActive);

    return (
        <div className="grid animate-rise gap-8">
            <div>
                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ MY INCOME
                </span>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
                    Spending cuts have a floor. Earning doesn't.
                </h1>
            </div>

            <ListToolbar createLabel="+ Add" onCreate={() => router.push(CREATE_HREF.income)}>
                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ Income sources
                </span>
            </ListToolbar>

            <div className="flex flex-wrap items-start gap-5">
                <AccentCard
                    tint="var(--color-accent)"
                    className="grid min-w-0 flex-1 basis-80 gap-5">
                    <div className="flex flex-wrap gap-6">
                        <div className="grid gap-1.5">
                            <Eyebrow>Now, per month</Eyebrow>
                            <p className="font-display text-3xl leading-none font-semibold tracking-tight text-fg lg:text-4xl">
                                {formatMoney(NET)}
                            </p>
                            <p className="font-mono text-xs text-fg-muted">
                                {formatMoney(NET * 12)} per year
                            </p>
                        </div>
                        <div className="grid gap-1.5">
                            <Eyebrow>Target</Eyebrow>
                            <p
                                className="font-display text-3xl leading-none font-semibold tracking-tight lg:text-4xl"
                                style={{
                                    background: 'var(--gradient-accent)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                {formatMoney(TARGET)}
                            </p>
                        </div>
                        <div className="grid gap-1.5">
                            <Eyebrow>Gap</Eyebrow>
                            <p className="font-display text-3xl leading-none font-semibold tracking-tight text-warning lg:text-4xl">
                                {formatMoney(GAP)}
                            </p>
                        </div>
                    </div>
                </AccentCard>

                <Card className="grid min-w-0 flex-1 basis-72 content-start gap-4">
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ What that does to each jar
                    </span>
                    <div>
                        {JAR_META.map(j => {
                            const jar = jars.find(mj => mj.key === j.key);
                            const now = jar?.allocated ?? 0;
                            const then = Math.round((TARGET * j.pct) / 100);
                            return (
                                <div
                                    key={j.key}
                                    className="flex items-center gap-2.5 border-b border-line py-2.5 last:border-b-0">
                                    <span className="shrink-0">{j.icon}</span>
                                    <span className="min-w-0 flex-1 truncate text-sm text-fg-secondary">
                                        {j.name}
                                    </span>
                                    <span className="shrink-0 font-mono text-xs whitespace-nowrap text-fg-muted">
                                        {formatMoney(now)} →
                                    </span>
                                    <span className="shrink-0 font-mono text-sm whitespace-nowrap text-success">
                                        {formatMoney(then)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <Card className="p-0">
                <div className="border-b border-line px-5 py-3.5">
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ Income sources
                    </span>
                </div>
                {sources.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-fg-muted">
                        {live
                            ? 'No income sources yet — add one to feed your jars.'
                            : 'Sign in to manage income sources.'}
                    </p>
                ) : (
                    <div className="grid gap-px">
                        {sources.map(s => (
                            <button
                                type="button"
                                key={s.id}
                                onClick={() => router.push(updateHref('income', s.id))}
                                className="flex w-full items-center justify-between gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised">
                                <div>
                                    <div className="text-sm text-fg">{s.name}</div>
                                    <div className="mt-0.5 font-mono text-xs tracking-normal text-fg-faint">
                                        {s.kind}
                                    </div>
                                </div>
                                <span className="font-mono text-sm text-success">
                                    {formatMoney(s.amount)}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {LEVERS.map(l => (
                    <AccentCard key={l.name} tint={l.color} className="grid content-start gap-2.5">
                        <span
                            className="font-mono text-xs font-medium tracking-widest uppercase"
                            style={{ color: l.color }}>
                            {l.meta}
                        </span>
                        <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-fg">
                            {l.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-pretty text-fg-muted">
                            {l.desc}
                        </p>
                    </AccentCard>
                ))}
            </div>
        </div>
    );
}

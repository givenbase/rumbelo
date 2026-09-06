'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { JarKey } from '@rumbelo/contracts';
import { useLiveQuery } from '@rumbelo/hooks';
import { Card } from '@rumbelo/ui';
import { cn, formatMoney, monthlyAmount, toPeriodKey } from '@rumbelo/utils';

import { useApi } from '@/app/_lib/api-hooks';
import { CREATE_HREF, spendFromJarHref, updateHref } from '@/app/_lib/create-routes';
import { JAR_GUIDE, type JarGuideKey } from '@/app/_lib/jar-guide';
import { JAR_META } from '@/app/_lib/jar-meta';
import { isLiveData } from '@/app/_lib/preview';
import { JarCategoryTable } from '@/components/features/money/jar-drilldown-parts';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

const CADENCE_LABEL: Record<string, string> = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    YEARLY: 'Yearly',
    ONCE: 'Once',
};

/**
 * Per-jar detail — coverage (allocated / committed / spent / available),
 * categories, fixed costs, period transactions, guide, and CTAs.
 */
export function JarDetailPageClient({ jarKey }: { jarKey: JarKey }) {
    const api = useApi();
    const { householdId } = useAuth();
    const { period } = useAppShell();
    const router = useRouter();
    const periodKey = toPeriodKey(period.year, period.month);
    const live = isLiveData(householdId);
    const meta = JAR_META.find(entry => entry.key === jarKey);
    const guide = JAR_GUIDE[jarKey as JarGuideKey];

    const jarsQuery = useLiveQuery(
        api.money.jars.balances.queryOptions({
            input: { householdId: householdId!, period: periodKey },
        }),
        [] as never,
        live
    );

    const byJarQuery = useLiveQuery(
        api.money.fixedCosts.byJar.queryOptions({ input: { householdId: householdId! } }),
        [] as never,
        live
    );

    const jar = (jarsQuery.data ?? []).find(row => row.key === jarKey);

    const txQuery = useLiveQuery(
        api.money.transactions.list.queryOptions({
            input: {
                householdId: householdId!,
                period: periodKey,
                jarId: jar?.id,
                limit: 50,
            },
        }),
        { items: [], nextCursor: null } as never,
        live && Boolean(jar?.id)
    );

    const fixedGroup = (byJarQuery.data ?? []).find(group => group.jarKey === jarKey);
    const fixedOut = (fixedGroup?.items ?? []).filter(
        item => item.direction === 'OUT' && item.isActive !== false
    );

    const transactions = [...(txQuery.data?.items ?? [])].sort((left, right) =>
        right.bookedOn.localeCompare(left.bookedOn)
    );

    if (!jar) {
        return (
            <div className="grid animate-rise gap-6">
                <Link
                    href="/product/money/jars"
                    className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase hover:text-accent">
                    ← Jars
                </Link>
                <p className="text-sm text-fg-muted">Loading jar…</p>
            </div>
        );
    }

    const usedPct =
        jar.allocated > 0
            ? Math.min(100, Math.round(((jar.allocated - jar.available) / jar.allocated) * 100))
            : 0;
    const accent = (meta?.color ?? 'bg-jar-nec').replace('bg-', 'var(--color-') + ')';

    return (
        <div className="grid animate-rise gap-8">
            <div className="grid gap-4">
                <Link
                    href="/product/money/jars"
                    className="w-fit font-mono text-xs font-medium tracking-wide text-fg-faint uppercase transition-colors hover:text-accent">
                    ← Jars
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-raised text-xl">
                            {jar.icon ?? meta?.icon ?? '◇'}
                        </span>
                        <div className="grid min-w-0 gap-1">
                            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
                                {jar.name}
                            </h1>
                            <p className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                {jar.subtitle ?? meta?.subtitle ?? ''} · {jar.percentage}% of net
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => router.push(spendFromJarHref(jar.id))}
                            className="rounded-full border border-line-strong bg-transparent px-4 py-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                            Add a spend
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push(CREATE_HREF.move)}
                            className="rounded-full border border-line-strong bg-transparent px-4 py-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                            Move money
                        </button>
                    </div>
                </div>
            </div>

            {/* Coverage strip */}
            <div
                className="rounded-2xl border border-t-[3px] border-line bg-card"
                style={{ borderTopColor: accent }}>
                <div className="grid gap-4 p-5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span
                            className={cn(
                                'font-display text-3xl font-semibold tracking-tight',
                                jar.overspent ? 'text-danger' : 'text-fg'
                            )}>
                            {formatMoney(jar.available)}
                        </span>
                        <span className="font-mono text-xs font-medium text-fg-faint">
                            available of {formatMoney(jar.allocated)} allocated
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-sunken">
                        <div
                            className={cn(
                                'h-full rounded-full',
                                jar.overspent ? 'bg-danger' : (meta?.color ?? 'bg-jar-nec')
                            )}
                            style={{ width: `${jar.overspent ? 100 : usedPct}%` }}
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <CoverageStat label="Allocated" value={jar.allocated} />
                        <CoverageStat label="Fixed (committed)" value={jar.committedOut} />
                        <CoverageStat label="Spent" value={jar.spent} />
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-fg-faint">
                        Available = allocated − spent − fixed. Booking the same bill as a
                        transaction and a fixed cost will count twice until payments are linked.
                    </p>
                </div>
            </div>

            {/* Categories */}
            <section className="grid gap-3">
                <h2 className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ Categories this month
                </h2>
                <Card className="p-4">
                    <JarCategoryTable categories={jar.categories ?? []} />
                </Card>
            </section>

            {/* Fixed costs */}
            <section className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ Fixed costs
                    </h2>
                    <Link
                        href="/product/money/fixed-costs"
                        className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase hover:text-accent">
                        All fixed costs ›
                    </Link>
                </div>
                <Card className="p-0">
                    {fixedOut.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-fg-muted">
                            No active fixed costs on this jar.
                        </p>
                    ) : (
                        <ul className="grid gap-px">
                            {fixedOut.map(item => {
                                const monthly = monthlyAmount(item.amount, item.cadence);
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(updateHref('fixed', item.id))
                                            }
                                            className="flex w-full items-center justify-between gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised">
                                            <span className="min-w-0">
                                                <span className="block text-sm text-fg">
                                                    {item.name}
                                                </span>
                                                <span className="mt-0.5 block font-mono text-xs text-fg-faint">
                                                    {CADENCE_LABEL[item.cadence] ?? item.cadence}
                                                    {item.dueDay !== null
                                                        ? ` · day ${item.dueDay}`
                                                        : ''}
                                                    {item.cadence !== 'MONTHLY'
                                                        ? ` · ${formatMoney(monthly)}/mo`
                                                        : ''}
                                                </span>
                                            </span>
                                            <span className="shrink-0 font-mono text-sm text-fg">
                                                {formatMoney(-Math.abs(monthly))}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Card>
            </section>

            {/* Period transactions */}
            <section className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ This period
                    </h2>
                    <Link
                        href="/product/money/transactions"
                        className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase hover:text-accent">
                        All spending ›
                    </Link>
                </div>
                <Card className="p-0">
                    {transactions.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-fg-muted">
                            No transactions sorted into this jar this month.
                        </p>
                    ) : (
                        <ul className="grid gap-px">
                            {transactions.map(tx => (
                                <li key={tx.id}>
                                    <button
                                        type="button"
                                        onClick={() => router.push(updateHref('tx', tx.id))}
                                        className="flex w-full items-center justify-between gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised">
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm text-fg">
                                                {tx.counterparty || tx.description}
                                            </span>
                                            <span className="mt-0.5 block font-mono text-xs text-fg-faint">
                                                {tx.bookedOn}
                                                {tx.counterparty && tx.description
                                                    ? ` · ${tx.description}`
                                                    : ''}
                                            </span>
                                        </span>
                                        <span
                                            className={cn(
                                                'shrink-0 font-mono text-sm',
                                                tx.amount < 0 ? 'text-fg' : 'text-success'
                                            )}>
                                            {formatMoney(tx.amount)}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </section>

            {/* Guide */}
            {guide && (
                <section className="grid gap-3">
                    <h2 className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ What can I use this for?
                    </h2>
                    <Card className="grid gap-4 p-5">
                        <p className="text-sm leading-relaxed text-pretty text-fg-muted">
                            {guide.note}
                        </p>
                        <div>
                            <p className="mb-2.5 font-mono text-xs font-medium tracking-widest text-accent uppercase">
                                This may go to
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {guide.allowed.map(label => (
                                    <span
                                        key={label}
                                        className="rounded-full border border-line bg-raised px-2.5 py-1.5 text-sm text-fg-secondary">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {guide.subs && guide.subs.length > 0 && (
                            <div>
                                <p className="mb-2.5 font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                    Split inside this jar
                                </p>
                                <div className="grid gap-2.5">
                                    {guide.subs.map(sub => (
                                        <div key={sub.label}>
                                            <div className="mb-1 flex justify-between gap-2.5 font-mono text-xs font-medium">
                                                <span className="text-fg-secondary">
                                                    {sub.label}
                                                </span>
                                                <span className="text-accent">
                                                    {formatMoney(
                                                        Math.round((jar.allocated * sub.pct) / 100)
                                                    )}{' '}
                                                    · {sub.pct}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-sunken">
                                                <div
                                                    className="h-full rounded-full bg-accent"
                                                    style={{ width: `${sub.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {guide.subNote && (
                                    <p className="mt-3 text-sm leading-relaxed text-pretty text-accent">
                                        {guide.subNote}
                                    </p>
                                )}
                            </div>
                        )}
                        <p className="border-t border-line pt-3 text-sm leading-relaxed text-pretty text-fg-muted">
                            {guide.notAllowed}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {guide.links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="rounded-full border border-line-strong bg-transparent px-3 py-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Card>
                </section>
            )}
        </div>
    );
}

function CoverageStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-line bg-raised px-3 py-2.5">
            <p className="font-mono text-xs tracking-wide text-fg-faint uppercase">{label}</p>
            <p className="mt-1 font-mono text-sm text-fg tabular-nums">{formatMoney(value)}</p>
        </div>
    );
}

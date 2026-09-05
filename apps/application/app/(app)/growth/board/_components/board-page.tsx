'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { AccentCard, Button, Card, EmptyState, Eyebrow, Section } from '@rumbelo/ui';
import { cn, formatMoney } from '@rumbelo/utils';

import { CREATE_HREF } from '@/app/_lib/create-routes';
import { HOLDING_KINDS, type HoldingKind } from '@/app/_lib/holding-kinds';
import { JAR_META } from '@/app/_lib/jar-meta';
import { ListToolbar } from '@/components/layout/list-toolbar';

type Holding = {
    id: string;
    name: string;
    jarKey: string;
    value: number;
    flow: number;
    kind: HoldingKind;
    locked: boolean;
};

const holdings: Holding[] = [];
const TOTAL_DEBT = 0;

type FilterKey = 'all' | HoldingKind;

/**
 * BOARD — net worth board + assets + month score + level ladder + log.
 * Design: Kluis Finance App.dc.html:1236-1357 (MIJN VERMOGEN).
 */
export function BoardPageClient() {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterKey>('all');

    const assetWorth = holdings.reduce((s, h) => s + h.value, 0);
    const monthlyPassive = holdings.filter(h => !h.locked).reduce((s, h) => s + h.flow, 0);
    const netWorth = assetWorth - TOTAL_DEBT;

    const presentKinds = HOLDING_KINDS.filter(k => holdings.some(h => h.kind === k.key));

    const groups: Array<{
        key: HoldingKind;
        nl: string;
        desc: string;
        items: Holding[];
        total: number;
        flow: number;
        isPension: boolean;
        flowLabel: string;
    }> = [];

    for (const meta of HOLDING_KINDS) {
        if (filter !== 'all' && filter !== meta.key) continue;
        const items = holdings.filter(h => h.kind === meta.key);
        if (items.length === 0) continue;
        const total = items.reduce((s, h) => s + h.value, 0);
        const flow = items.reduce((s, h) => s + h.flow, 0);
        const isPension = meta.key === 'pension';
        groups.push({
            ...meta,
            items,
            total,
            flow,
            isPension,
            flowLabel: isPension
                ? 'locked'
                : flow > 0
                  ? `+ ${formatMoney(flow)} p/m`
                  : 'no income p/m',
        });
    }

    return (
        <div className="grid animate-rise gap-8">
            <div>
                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ MY NET WORTH
                </span>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
                    Where your money stands — not how it moves.
                </h1>
                <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
                    Everything you own minus everything you owe. A tile turns gold the moment it
                    pays you every month — that is the difference between owning something and
                    having it.
                </p>
            </div>

            <ListToolbar
                createLabel="+ Add asset"
                onCreate={() => router.push(CREATE_HREF.asset)}
            />

            <AccentCard tint="var(--color-accent)">
                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ How far this takes you
                </span>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                    <div className="grid gap-1.5">
                        <Eyebrow>Total value</Eyebrow>
                        <p className="font-display text-2xl leading-none font-semibold tracking-tight text-fg lg:text-3xl">
                            {formatMoney(assetWorth)}
                        </p>
                    </div>
                    <div className="grid gap-1.5">
                        <Eyebrow>Monthly income</Eyebrow>
                        <p
                            className="font-display text-2xl leading-none font-semibold tracking-tight lg:text-3xl"
                            style={{ color: 'var(--color-jar-give)' }}>
                            {monthlyPassive === 0 ? 'None yet' : formatMoney(monthlyPassive)}
                        </p>
                    </div>
                    <div className="grid gap-1.5">
                        <Eyebrow>Your life costs</Eyebrow>
                        <p className="font-display text-2xl leading-none font-semibold tracking-tight text-fg lg:text-3xl">
                            {formatMoney(0)}
                        </p>
                    </div>
                    <div className="grid gap-1.5">
                        <Eyebrow>Total debt</Eyebrow>
                        <p className="font-display text-2xl leading-none font-semibold tracking-tight text-danger lg:text-3xl">
                            {formatMoney(TOTAL_DEBT)}
                        </p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-pretty text-fg-muted">
                    Your net worth is <strong className="text-fg">{formatMoney(netWorth)}</strong>.
                    Every euro you add to Financial Freedom works for you — forever.
                </p>
            </AccentCard>

            {holdings.length === 0 ? (
                <EmptyState
                    icon="↗"
                    title="Nog geen data"
                    body="Voeg je eerste asset toe om je vermogen te volgen. Binnenkort koppel je ook schulden en maandscore hier."
                />
            ) : (
                <>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 font-mono text-xs font-medium tracking-widest text-fg-muted uppercase">
                            Show
                        </span>
                        {(
                            [
                                { key: 'all' as const, label: `All  ${holdings.length}` },
                                ...presentKinds.map(k => ({
                                    key: k.key,
                                    label: `${k.nl}  ${holdings.filter(h => h.kind === k.key).length}`,
                                })),
                            ] as const
                        ).map(f => (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => setFilter(f.key)}
                                className={cn(
                                    'rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide uppercase transition-colors',
                                    filter === f.key
                                        ? 'border-accent/40 bg-accent-soft text-accent'
                                        : 'border-line text-fg-secondary hover:border-accent-hover hover:text-accent'
                                )}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4">
                        {groups.map(g => (
                            <Card key={g.key} className="overflow-hidden p-0">
                                <div className="flex flex-wrap items-start gap-4 border-b border-line px-5 py-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-baseline gap-2.5">
                                            <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                                                {g.nl}
                                            </h3>
                                            <span className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                                                {g.items.length === 1
                                                    ? '1 asset'
                                                    : `${g.items.length} assets`}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm leading-relaxed text-pretty text-fg-muted">
                                            {g.desc}
                                        </p>
                                    </div>
                                    <div className="grid justify-items-end gap-1">
                                        <span className="font-display text-2xl leading-none font-semibold tracking-tight text-fg">
                                            {formatMoney(g.total)}
                                        </span>
                                        <span
                                            className={cn(
                                                'font-mono text-xs',
                                                g.isPension || g.flow <= 0
                                                    ? 'text-fg-muted'
                                                    : 'text-accent'
                                            )}>
                                            {g.flowLabel}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="self-center"
                                        onClick={() => router.push(CREATE_HREF.asset)}>
                                        + Add
                                    </Button>
                                </div>
                                <div className="grid gap-3.5 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {g.items.map(h => {
                                        const jar = JAR_META.find(j => j.key === h.jarKey);
                                        const pays = !h.locked && h.flow > 0;
                                        return (
                                            <button
                                                key={h.id}
                                                type="button"
                                                onClick={() => router.push(CREATE_HREF.asset)}
                                                className={cn(
                                                    'grid cursor-pointer gap-0 overflow-hidden rounded-xl border bg-raised text-left transition-colors hover:border-accent-hover',
                                                    pays
                                                        ? 'border-accent/40 shadow-glow'
                                                        : 'border-line'
                                                )}>
                                                <div
                                                    className="h-8.5"
                                                    style={{
                                                        background: h.locked
                                                            ? 'repeating-linear-gradient(45deg, var(--color-sunken) 0 3px, transparent 3px 9px)'
                                                            : pays
                                                              ? 'var(--gradient-accent)'
                                                              : 'repeating-linear-gradient(45deg, var(--color-sunken) 0 8px, var(--color-raised) 8px 16px)',
                                                    }}
                                                />
                                                <div className="grid gap-2 p-4">
                                                    <span className="font-mono text-xs font-medium tracking-wide text-fg-muted uppercase">
                                                        {h.locked
                                                            ? 'Locked until pension'
                                                            : pays
                                                              ? 'Pays you monthly'
                                                              : 'Appreciates in value'}
                                                    </span>
                                                    {jar && (
                                                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-xs tracking-widest text-fg-secondary uppercase">
                                                            <span
                                                                className={cn(
                                                                    'size-1.75 rounded-sm',
                                                                    jar.color
                                                                )}
                                                            />
                                                            {jar.name} ›
                                                        </span>
                                                    )}
                                                    <span className="font-display text-xl leading-snug font-semibold tracking-tight text-fg">
                                                        {h.name}
                                                    </span>
                                                    <div className="flex justify-between font-mono text-xs">
                                                        <span className="text-fg-muted">Value</span>
                                                        <span className="text-fg-secondary">
                                                            {formatMoney(h.value)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between font-mono text-xs">
                                                        <span className="text-fg-muted">
                                                            Monthly income
                                                        </span>
                                                        <span
                                                            className={
                                                                pays ? 'text-accent' : 'text-fg-muted'
                                                            }>
                                                            {h.locked
                                                                ? 'not available yet'
                                                                : pays
                                                                  ? `+ ${formatMoney(h.flow)} p/m`
                                                                  : formatMoney(0) + ' p/m'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            <Section eyebrow="Turn score" title="Binnenkort">
                <EmptyState
                    icon="◇"
                    title="Nog geen data"
                    body="Maandscore, levels en log komen zodra je vermogen en schulden hier gekoppeld zijn."
                />
            </Section>
        </div>
    );
}

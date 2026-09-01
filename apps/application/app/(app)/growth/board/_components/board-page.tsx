'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccentCard, Button, Card, Eyebrow, Meter, Section } from '@rumbelo/ui';
import { cn, formatMoney, formatPeriod } from '@rumbelo/utils';
import { JAR_META, mockDebts, mockHoldings, mockTurn, type HoldingKind } from '@/app/_mock';
import { CREATE_HREF } from '@/app/_lib/create-routes';
import { ListToolbar } from '@/components/layout/list-toolbar';

const TOTAL_DEBT = mockDebts.reduce((s, d) => s + d.balance, 0);
const LIFE_COST = 250_000;

const HOLDING_KINDS: ReadonlyArray<{
  key: HoldingKind;
  nl: string;
  desc: string;
}> = [
  {
    key: 'portfolio',
    nl: 'Portfolio',
    desc: 'Funds, shares and crypto — your most liquid asset.',
  },
  {
    key: 'property',
    nl: 'Real estate',
    desc: 'A house or rental property. Part of the long game.',
  },
  {
    key: 'business',
    nl: 'Business',
    desc: 'A company or stake in one. Usually your highest return and highest risk.',
  },
  {
    key: 'cash',
    nl: 'Cash & reserves',
    desc: 'Immediately accessible. Reassuring, but barely grows.',
  },
  {
    key: 'pension',
    nl: 'Pension',
    desc: 'Truly yours, but locked until you stop working.',
  },
];

const LEVELS = [
  { index: 1, label: 'Beginner', threshold: 0 },
  { index: 2, label: 'Navigator', threshold: 120 },
  { index: 3, label: 'Helmsman', threshold: 320 },
  { index: 4, label: 'Captain', threshold: 640 },
  { index: 5, label: 'Compass', threshold: 1080 },
] as const;

type FilterKey = 'all' | HoldingKind;

/**
 * BOARD — net worth board + assets + month score + level ladder + log.
 * Design: Kluis Finance App.dc.html:1236-1357 (MIJN VERMOGEN).
 */
export function BoardPageClient() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');

  const assetWorth = mockHoldings.reduce((s, h) => s + h.value, 0);
  const monthlyPassive = mockHoldings
    .filter((h) => !h.locked)
    .reduce((s, h) => s + h.flow, 0);
  const netWorth = assetWorth - TOTAL_DEBT;

  const presentKinds = HOLDING_KINDS.filter((k) => mockHoldings.some((h) => h.kind === k.key));

  const groups: Array<{
    key: HoldingKind;
    nl: string;
    desc: string;
    items: Array<(typeof mockHoldings)[number]>;
    total: number;
    flow: number;
    isPension: boolean;
    flowLabel: string;
  }> = [];

  for (const meta of HOLDING_KINDS) {
    if (filter !== 'all' && filter !== meta.key) continue;
    const items = mockHoldings.filter((h) => h.kind === meta.key);
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
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ MY NET WORTH
        </span>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          Where your money stands — not how it moves.
        </h1>
        <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
          Everything you own minus everything you owe. A tile turns gold the moment it pays you
          every month — that is the difference between owning something and having it.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Add asset"
        onCreate={() => router.push(CREATE_HREF.asset)}
      />

      <AccentCard tint="var(--color-accent)">
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ How far this takes you
        </span>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
          <div className="grid gap-1.5">
            <Eyebrow>Total value</Eyebrow>
            <p className="font-display text-2xl lg:text-3xl font-semibold leading-none tracking-tight text-fg">
              {formatMoney(assetWorth)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Monthly income</Eyebrow>
            <p
              className="font-display text-2xl lg:text-3xl font-semibold leading-none tracking-tight"
              style={{ color: 'var(--color-jar-give)' }}
            >
              {monthlyPassive === 0 ? 'None yet' : formatMoney(monthlyPassive)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Your life costs</Eyebrow>
            <p className="font-display text-2xl lg:text-3xl font-semibold leading-none tracking-tight text-fg">
              {formatMoney(LIFE_COST)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Total debt</Eyebrow>
            <p className="font-display text-2xl lg:text-3xl font-semibold leading-none tracking-tight text-danger">
              {formatMoney(TOTAL_DEBT)}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-pretty text-fg-muted">
          Your net worth is <strong className="text-fg">{formatMoney(netWorth)}</strong>. Every
          euro you add to Financial Freedom works for you — forever.
        </p>
      </AccentCard>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-xs font-medium tracking-widest uppercase text-fg-muted">
          Show
        </span>
        {(
          [
            { key: 'all' as const, label: `All  ${mockHoldings.length}` },
            ...presentKinds.map((k) => ({
              key: k.key,
              label: `${k.nl}  ${mockHoldings.filter((h) => h.kind === k.key).length}`,
            })),
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide uppercase transition-colors',
              filter === f.key
                ? 'border-accent/40 bg-accent-soft text-accent'
                : 'border-line text-fg-secondary hover:border-accent-hover hover:text-accent',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {groups.map((g) => (
          <Card key={g.key} className="overflow-hidden p-0">
            <div className="flex flex-wrap items-start gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                    {g.nl}
                  </h3>
                  <span className="font-mono text-xs tracking-wide uppercase text-fg-muted">
                    {g.items.length === 1 ? '1 asset' : `${g.items.length} assets`}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-pretty text-fg-muted">
                  {g.desc}
                </p>
              </div>
              <div className="grid justify-items-end gap-1">
                <span className="font-display text-2xl font-semibold leading-none tracking-tight text-fg">
                  {formatMoney(g.total)}
                </span>
                <span
                  className={cn(
                    'font-mono text-xs',
                    g.isPension || g.flow <= 0 ? 'text-fg-muted' : 'text-accent',
                  )}
                >
                  {g.flowLabel}
                </span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="self-center"
                onClick={() => router.push(CREATE_HREF.asset)}
              >
                + Add
              </Button>
            </div>
            <div className="grid gap-3.5 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((h) => {
                const jar = JAR_META.find((j) => j.key === h.jarKey);
                const pays = !h.locked && h.flow > 0;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => router.push(CREATE_HREF.asset)}
                    className={cn(
                      'grid cursor-pointer gap-0 overflow-hidden rounded-xl border bg-raised text-left transition-colors hover:border-accent-hover',
                      pays ? 'border-accent/40 shadow-glow' : 'border-line',
                    )}
                  >
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
                      <span className="font-mono text-xs font-medium tracking-wide uppercase text-fg-muted">
                        {h.locked
                          ? 'Locked until pension'
                          : pays
                            ? 'Pays you monthly'
                            : 'Appreciates in value'}
                      </span>
                      {jar && (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-xs uppercase tracking-widest text-fg-secondary">
                          <span
                            className={cn('size-1.75 rounded-sm', jar.color)}
                          />
                          {jar.name} ›
                        </span>
                      )}
                      <span className="font-display text-xl font-semibold leading-snug tracking-tight text-fg">
                        {h.name}
                      </span>
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-fg-muted">Value</span>
                        <span className="text-fg-secondary">{formatMoney(h.value)}</span>
                      </div>
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-fg-muted">Monthly income</span>
                        <span className={pays ? 'text-accent' : 'text-fg-muted'}>
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

      <Card className="grid gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>{`Turn · ${formatPeriod(mockTurn.period)}`}</Eyebrow>
            <p className="mt-1.5 font-display text-4xl font-semibold tabular-nums text-fg">
              {mockTurn.score}
              <span className="text-xl text-fg-muted">/{mockTurn.maxScore}</span>
            </p>
          </div>
          <div className="text-right">
            <Eyebrow>Level {mockTurn.level}</Eyebrow>
            <p className="font-display text-xl font-semibold text-accent">{mockTurn.levelLabel}</p>
            <p className="text-xs text-fg-muted">{mockTurn.daysLeft} days left</p>
          </div>
        </div>
        <Meter value={mockTurn.score / mockTurn.maxScore} />
      </Card>

      <Section eyebrow="Levels" title="The way up">
        <div className="grid gap-2">
          {LEVELS.map((l) => {
            const reached = mockTurn.level >= l.index;
            return (
              <Card
                key={l.index}
                className={`flex items-center justify-between gap-4 p-4 ${reached ? '' : 'opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${reached ? 'bg-accent text-on-accent' : 'bg-raised text-fg-muted'}`}
                  >
                    {l.index}
                  </span>
                  <p className="font-semibold text-fg">{l.label}</p>
                </div>
                <p className="text-xs tabular-nums text-fg-muted">{l.threshold} points</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Log" title="What happened">
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {mockTurn.events.map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="w-8 shrink-0 text-xs tabular-nums text-fg-faint">{e.day}</span>
                <span className="min-w-0 flex-1 text-sm text-fg-secondary">{e.text}</span>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${e.points < 0 ? 'text-danger' : 'text-success'}`}
                >
                  {e.points > 0 ? `+${e.points}` : e.points}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}

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
    nl: 'Portefeuille',
    desc: 'Fondsen, aandelen en crypto — je meest liquide bezit.',
  },
  {
    key: 'property',
    nl: 'Vastgoed',
    desc: 'Een huis of huurpand. Hoort bij het lange spel.',
  },
  {
    key: 'business',
    nl: 'Onderneming',
    desc: 'Een bedrijf of aandeel daarin. Meestal je hoogste rendement en je hoogste risico.',
  },
  {
    key: 'cash',
    nl: 'Contant & buffers',
    desc: 'Direct opneembaar. Rustgevend, maar het groeit nauwelijks.',
  },
  {
    key: 'pension',
    nl: 'Pensioen',
    desc: 'Echt van jou, maar vast tot je stopt met werken.',
  },
];

const LEVELS = [
  { index: 1, label: 'Beginner', threshold: 0 },
  { index: 2, label: 'Navigator', threshold: 120 },
  { index: 3, label: 'Stuurman', threshold: 320 },
  { index: 4, label: 'Kapitein', threshold: 640 },
  { index: 5, label: 'Kompas', threshold: 1080 },
] as const;

type FilterKey = 'all' | HoldingKind;

/**
 * BORD — netto-vermogensbord + bezittingen + maandscore + levelladder + logboek.
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
        ? 'staat vast'
        : flow > 0
          ? `+ ${formatMoney(flow)} p/m`
          : 'geen inkomen p/m',
    });
  }

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ MIJN VERMOGEN
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Waar je geld staat — niet hoe het beweegt.
        </h1>
        <p className="mt-2 max-w-[62ch] text-[15px] text-pretty text-fg-muted">
          Alles wat je bezit, min alles wat je schuldig bent. Een tegel wordt goud zodra hij je
          elke maand betaalt — dat is het verschil tussen iets bezitten en iets hebben.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Bezitting toevoegen"
        onCreate={() => router.push(CREATE_HREF.asset)}
      />

      <AccentCard tint="var(--color-accent)">
        <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ Hoe ver dit je brengt
        </span>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
          <div className="grid gap-1.5">
            <Eyebrow>Totale waarde</Eyebrow>
            <p className="font-display text-[clamp(24px,3.4vw,31px)] font-semibold leading-none tracking-tight text-fg">
              {formatMoney(assetWorth)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Betaalt je maandelijks</Eyebrow>
            <p
              className="font-display text-[clamp(24px,3.4vw,31px)] font-semibold leading-none tracking-tight"
              style={{ color: 'var(--color-jar-give)' }}
            >
              {monthlyPassive === 0 ? 'Nog niet' : formatMoney(monthlyPassive)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Je leven kost</Eyebrow>
            <p className="font-display text-[clamp(24px,3.4vw,31px)] font-semibold leading-none tracking-tight text-fg">
              {formatMoney(LIFE_COST)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Totale schuld</Eyebrow>
            <p className="font-display text-[clamp(24px,3.4vw,31px)] font-semibold leading-none tracking-tight text-danger">
              {formatMoney(TOTAL_DEBT)}
            </p>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] text-pretty text-fg-muted">
          Je netto vermogen is <strong className="text-fg">{formatMoney(netWorth)}</strong>. Elke
          euro die je toevoegt aan Financial Freedom werkt voor je — voor altijd.
        </p>
      </AccentCard>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[9.5px] font-medium tracking-[0.18em] uppercase text-fg-muted">
          Toon
        </span>
        {(
          [
            { key: 'all' as const, label: `Alles  ${mockHoldings.length}` },
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
              'rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.08em] uppercase transition-colors',
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
                  <h3 className="font-display text-[19px] font-semibold tracking-tight text-fg">
                    {g.nl}
                  </h3>
                  <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-fg-muted">
                    {g.items.length === 1 ? '1 bezit' : `${g.items.length} bezittingen`}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-pretty text-fg-muted">
                  {g.desc}
                </p>
              </div>
              <div className="grid justify-items-end gap-1">
                <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-fg">
                  {formatMoney(g.total)}
                </span>
                <span
                  className={cn(
                    'font-mono text-[10.5px]',
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
                + Toevoegen
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
                      'grid cursor-pointer gap-0 overflow-hidden rounded-[14px] border bg-raised text-left transition-colors hover:border-accent-hover',
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
                      <span className="font-mono text-[9.5px] font-medium tracking-[0.15em] uppercase text-fg-muted">
                        {h.locked
                          ? 'Vast tot pensioen'
                          : pays
                            ? 'Betaalt je maandelijks'
                            : 'Groeit alleen in waarde'}
                      </span>
                      {jar && (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-secondary">
                          <span
                            className={cn('size-1.75 rounded-sm', jar.color)}
                          />
                          {jar.name} ›
                        </span>
                      )}
                      <span className="font-display text-[19px] font-semibold leading-snug tracking-tight text-fg">
                        {h.name}
                      </span>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-fg-muted">Waarde</span>
                        <span className="text-fg-secondary">{formatMoney(h.value)}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-fg-muted">Levert op p/m</span>
                        <span className={pays ? 'text-accent' : 'text-fg-muted'}>
                          {h.locked
                            ? 'nu nog niet te gebruiken'
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
            <Eyebrow>{`Beurt · ${formatPeriod(mockTurn.period)}`}</Eyebrow>
            <p className="mt-1.5 font-display text-4xl font-semibold tabular-nums text-fg">
              {mockTurn.score}
              <span className="text-xl text-fg-muted">/{mockTurn.maxScore}</span>
            </p>
          </div>
          <div className="text-right">
            <Eyebrow>Niveau {mockTurn.level}</Eyebrow>
            <p className="font-display text-xl font-semibold text-accent">{mockTurn.levelLabel}</p>
            <p className="text-xs text-fg-muted">nog {mockTurn.daysLeft} dagen</p>
          </div>
        </div>
        <Meter value={mockTurn.score / mockTurn.maxScore} />
      </Card>

      <Section eyebrow="Niveaus" title="De weg omhoog">
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
                <p className="text-xs tabular-nums text-fg-muted">{l.threshold} punten</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Logboek" title="Wat er gebeurde">
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

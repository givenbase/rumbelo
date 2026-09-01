'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@rumbelo/contracts/react';
import { useAuth } from '@/components/features/shell/auth-provider';
import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';
import { mockDebts } from '@/app/_mock';
import { isLiveData } from '@/app/_lib/preview';
import { useLiveQuery } from '@rumbelo/hooks';
import { AccentCard, Badge, Card, Eyebrow } from '@rumbelo/ui';
import { ListToolbar } from '@/components/layout/list-toolbar';

const EXTRA_OPTIONS = [
  { label: 'Alleen minimum', value: 0 },
  { label: '+ €50', value: 5_000 },
  { label: '+ €100', value: 10_000 },
  { label: '+ €200', value: 20_000 },
  { label: '+ €300', value: 30_000 },
  { label: '+ €500', value: 50_000 },
] as const;

/** Fallback avalanche simulator used when live plan data isn't available. */
function computeFreedomLocal(
  debts: ReadonlyArray<{ balance: number; interestRate: number; minimumPayment: number }>,
  extraMonthly: number,
): string {
  const debtList = Array.from(debts);
  const balances: number[] = debtList.map((d) => d.balance);
  let months = 0;

  while (balances.some((b) => (b ?? 0) > 0) && months < 600) {
    for (let i = 0; i < debtList.length; i++) {
      const d = debtList[i]!;
      const bal = balances[i] ?? 0;
      if (bal <= 0) continue;
      const interest = Math.round((bal * d.interestRate) / 100 / 12);
      balances[i] = Math.max(0, bal + interest - d.minimumPayment);
    }
    let budget = extraMonthly;
    const byRate = debtList
      .map((d, i) => ({ i, rate: d.interestRate }))
      .filter(({ i }) => (balances[i] ?? 0) > 0)
      .sort((a, b) => b.rate - a.rate);
    for (const { i } of byRate) {
      if (budget <= 0) break;
      const bal = balances[i] ?? 0;
      const payment = Math.min(budget, bal);
      balances[i] = bal - payment;
      budget -= payment;
    }
    months++;
  }

  const date = new Date(2026, 7);
  date.setMonth(date.getMonth() + months);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

export function DebtsPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const router = useRouter();
  const [extra, setExtra] = useState(30_000);
  const live = isLiveData(householdId);

  const debtsQuery = useLiveQuery(
    api.money.debts.list.queryOptions({ input: { householdId: householdId! } }),
    mockDebts as never,
    live,
  );

  const planQuery = useLiveQuery(
    api.money.debts.plan.queryOptions({
      input: { householdId: householdId!, strategy: 'AVALANCHE' },
    }),
    null as never,
    live,
  );

  const debts = (debtsQuery.data ?? mockDebts) as ReadonlyArray<{
    id: string;
    name: string;
    kind: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
  }>;

  const total = debts.reduce((s, d) => s + d.balance, 0);
  const monthly = debts.reduce((s, d) => s + d.minimumPayment, 0);
  const avalanche = [...debts].sort((a, b) => b.interestRate - a.interestRate);

  // Freedom date: use live plan if available, otherwise local simulator
  const liveDebtFreeOn = live && planQuery.data
    ? (planQuery.data as { debtFreeOn: string | null }).debtFreeOn
    : null;
  const freedomDate = liveDebtFreeOn
    ? liveDebtFreeOn.slice(0, 7).split('-').reverse().join('-') // YYYY-MM → MM-YYYY
    : computeFreedomLocal(debts, extra);

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ SCHULDEN
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Schuldenvrij in {freedomDate}.
        </h1>
        <p className="mt-2 max-w-[58ch] text-[15px] text-pretty text-fg-muted">
          Niet alle schuld is hetzelfde. Snap eerst het verschil, kies dan hoe je aflost.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Schuld toevoegen"
        onCreate={() => router.push(CREATE_HREF.debt)}
      />

      <AccentCard tint="var(--color-accent)">
        <div className="flex flex-wrap gap-x-8 gap-y-4 items-start">
          <div className="grid gap-1.5">
            <Eyebrow>Vrij in</Eyebrow>
            <p className="font-display text-4xl font-semibold tracking-tight text-accent">
              {freedomDate}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Totale schuld</Eyebrow>
            <p className="font-display text-2xl font-semibold tabular-nums text-fg">
              {formatMoney(total)}
            </p>
          </div>
          <div className="grid gap-1.5">
            <Eyebrow>Minimaal p/m</Eyebrow>
            <p className="font-display text-2xl font-semibold tabular-nums text-fg">
              {formatMoney(monthly)}
            </p>
          </div>
        </div>

        {/* Simulator only shown in mock mode; live uses the plan endpoint */}
        {!live && (
          <div className="mt-5 border-t border-line pt-4">
            <Eyebrow className="mb-3">
              Aflosversneller · {extra > 0 ? formatMoney(extra) : 'geen'} extra p/m
            </Eyebrow>
            <div className="flex flex-wrap gap-2">
              {EXTRA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExtra(opt.value)}
                  className={cn(
                    'rounded-full border font-mono text-[10.5px] font-medium tracking-widest px-3.5 py-2 transition-all duration-200',
                    extra === opt.value
                      ? 'border-accent/40 bg-accent-soft text-accent'
                      : 'border-line text-fg-muted hover:border-accent-hover hover:text-accent',
                  )}
                >
                  {opt.label}

                </button>
              ))}
            </div>
          </div>
        )}
      </AccentCard>

      <div>
        <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ Aflosvolgorde · Lawine
        </span>
      </div>

      <Card className="p-0">
        <div className="grid gap-3 p-5">
          {avalanche.map((d, i) => (
            <button
              type="button"
              key={d.id}
              onClick={() =>
                router.push(updateHref('debt', d.id))
              }
              className="w-full cursor-pointer rounded-2xl border border-line bg-raised p-4.5 text-left transition-colors hover:border-accent-hover"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent">#{i + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[15px] text-fg">{d.name}</span>
                      <Badge tone={d.interestRate > 10 ? 'danger' : 'neutral'}>
                        {d.interestRate}% rente
                      </Badge>
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.06em] text-fg-faint">
                      {formatMoney(d.minimumPayment)} p/m minimum
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[15px] text-fg">{formatMoney(d.balance)}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-lg border border-line bg-surface p-5 shadow-md"
          style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-accent)' }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-accent">
              Lawine
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-pretty text-fg-secondary">
            Betaal de hoogste rente het eerst af. Kost wiskundig het minst. De enige reden om niet
            lawine te doen is als je een kleine overwinning nodig hebt om door te gaan.
          </p>
        </div>
        <div
          className="rounded-lg border border-line bg-surface p-5 shadow-md"
          style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-fg-muted)' }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-fg-muted" />
            <span className="font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-fg-muted">
              Sneeuwbal
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-pretty text-fg-secondary">
            Los het kleinste saldo het eerst af. Kost meer rente maar levert snellere overwinningen.
            Kies de methode die je vol kunt houden.
          </p>
        </div>
      </div>
    </div>
  );
}

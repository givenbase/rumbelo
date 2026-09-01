'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@rumbelo/contracts/react';
import { Card, Eyebrow } from '@rumbelo/ui';
import { JarCard } from '@/components/features/money/jar-card';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { formatMoney, toPeriodKey } from '@rumbelo/utils';
import { INCOME_SOURCES, mockGoals, mockJars } from '@/app/_mock';
import { CREATE_HREF } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { useLiveQuery } from '@rumbelo/hooks';
import { ListToolbar, ListToolbarTab } from '@/components/layout/list-toolbar';
import { cn } from '@rumbelo/utils';

const MOCK_NET = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);

type Tab = 'JARS' | 'SIMULATOR';

function toCssVar(bgClass: string) {
  return bgClass.replace('bg-', 'var(--color-') + ')';
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

  const [simEuros, setSimEuros] = useState(4_300);
  const [goalId, setGoalId] = useState<string>(mockGoals[0]?.id ?? '');
  const [wantMonths, setWantMonths] = useState(36);

  const jarsQuery = useLiveQuery(
    api.money.jars.balances.queryOptions({ input: { householdId: householdId!, period: periodKey } }),
    mockJars as never,
    live,
  );

  const incomeQuery = useLiveQuery(
    api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );

  const jars = jarsQuery.data ?? mockJars;
  const net = live
    ? (incomeQuery.data ?? []).filter((s) => s.active).reduce((s, i) => s + i.amount, 0)
    : MOCK_NET;
  const totalPct = jars.reduce((s, j) => s + j.percentage, 0);
  const onTarget = jars.filter((j) => !j.overspent).length;

  const simCents = simEuros * 100;
  const goal = mockGoals.find((g) => g.id === goalId) ?? mockGoals[0];
  const goalJarPct =
    jars.find((j) => j.key === 'LONG_TERM_SAVINGS')?.percentage ??
    jars.find((j) => j.key === 'FINANCIAL_FREEDOM')?.percentage ??
    10;
  const goalPerMonth = Math.round((simCents * goalJarPct) / 100);
  const remaining = goal ? Math.max(0, goal.target - goal.saved) : 0;
  const monthsAtPace =
    goalPerMonth > 0 ? Math.ceil(remaining / goalPerMonth) : Number.POSITIVE_INFINITY;
  const needPerMonth =
    wantMonths > 0 ? Math.ceil(remaining / wantMonths) : remaining;

  const whenLabel = useMemo(() => {
    if (!Number.isFinite(monthsAtPace)) return '—';
    if (monthsAtPace <= 0) return 'Now';
    const d = new Date();
    d.setMonth(d.getMonth() + monthsAtPace);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }, [monthsAtPace]);

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <Eyebrow className="text-accent">✦ THE SIX JARS</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
          Every euro gets a job before it arrives.
        </h1>
        <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
          Income lands, the split happens the same second. Financial Freedom is never spent — only
          invested.
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
        }
      >
        {(['JARS', 'SIMULATOR'] as const).map((t) => (
          <ListToolbarTab key={t} active={tab === t} onClick={() => setTab(t)}>
            {t === 'JARS' ? 'Jars' : 'Simulator'}
            {t === 'JARS' && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-xs',
                  tab === t ? 'bg-accent/10 text-accent' : 'bg-raised text-fg-faint',
                )}
              >
                {Math.round(totalPct * 10) / 10}%
              </span>
            )}
          </ListToolbarTab>
        ))}
      </ListToolbar>

      {tab === 'JARS' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 font-mono text-xs font-medium tracking-wide uppercase text-accent">
              {jars.length} jars · {Math.round(totalPct * 10) / 10}% allocated
            </span>
            <span className="font-mono text-xs font-medium text-fg-faint">
              Open a jar to see exactly what it may be used for
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jars.map((jar) => {
              const meta = mockJars.find((m) => m.key === jar.key);
              return (
                <JarCard
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
                    remaining: jar.remaining,
                    spent: jar.spent,
                    overspent: jar.overspent,
                    categories: jar.categories ?? [],
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
            Drag the amount to see what lands in each jar. This runs on every income automatically.
            {net > 0 ? (
              <>
                {' '}
                Current income: <span className="text-fg-secondary">{formatMoney(net)}</span>/mo.
              </>
            ) : null}
          </p>

          <div className="mt-5 mb-5 flex flex-wrap items-center gap-4">
            <input
              type="range"
              min={500}
              max={8000}
              step={50}
              value={simEuros}
              onChange={(e) => setSimEuros(Number(e.target.value))}
              className="min-w-48 flex-1 accent-accent"
              aria-label="Simulate income"
            />
            <span className="min-w-36 font-display text-3xl font-semibold tracking-tight text-accent">
              {formatMoney(simCents)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {jars.map((j) => {
              const meta = mockJars.find((m) => m.key === j.key);
              const color = meta?.color ?? 'bg-jar-nec';
              return (
                <div key={j.id} className="rounded-xl border border-line bg-raised p-3.5">
                  <div
                    className="font-mono text-xs font-medium tracking-wide uppercase"
                    style={{ color: toCssVar(color) }}
                  >
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
              Pick a goal and see when this income reaches it — or how much you would need to hit your
              own date.
            </p>

            <div className="mt-4 mb-4 flex flex-wrap gap-1.5">
              {mockGoals.map((g) => {
                const active = g.id === goal?.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoalId(g.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3 py-2 text-sm whitespace-nowrap transition-colors',
                      active
                        ? 'border-accent/40 bg-accent-soft text-accent'
                        : 'border-line text-fg-secondary hover:border-accent hover:text-accent',
                    )}
                  >
                    <span>{g.icon}</span>
                    {g.name}
                  </button>
                );
              })}
            </div>

            {goal && (
              <div className="flex flex-wrap items-start gap-4 rounded-xl border border-line bg-raised p-4 lg:gap-8 lg:p-5">
                <div className="grid min-w-0 flex-1 gap-2.5">
                  <span className="flex flex-wrap items-baseline gap-2.5">
                    <span className="font-display text-xl font-semibold tracking-tight text-fg">
                      {goal.name}
                    </span>
                    <span className="font-mono text-xs font-medium tracking-wide text-accent uppercase">
                      Long Term Savings
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
                    {remaining <= 0
                      ? 'Already reached. Pick the next one — this is where momentum comes from.'
                      : `At this income, ${formatMoney(goalPerMonth)}/mo lands in this jar.`}
                  </p>
                </div>
                <div className="grid w-full gap-3.5 sm:w-52">
                  <span className="grid gap-1">
                    <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase whitespace-nowrap">
                      Reached around
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight leading-none text-accent">
                      {whenLabel}
                    </span>
                  </span>
                  <span className="grid gap-1">
                    <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase whitespace-nowrap">
                      This jar gets
                    </span>
                    <span className="font-mono text-base font-medium text-fg">
                      {formatMoney(goalPerMonth)} / mo
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3.5">
              <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase whitespace-nowrap">
                Or I want it in
              </span>
              <input
                type="range"
                min={3}
                max={120}
                step={1}
                value={wantMonths}
                onChange={(e) => setWantMonths(Number(e.target.value))}
                className="min-w-40 flex-1 accent-accent"
                aria-label="Target months"
              />
              <span className="font-mono text-sm font-medium text-fg-secondary whitespace-nowrap">
                {wantMonths} months
              </span>
            </div>
            <p className="mt-3 rounded-xl border border-line bg-raised px-3.5 py-3 text-sm leading-relaxed text-pretty text-fg-secondary">
              {remaining <= 0
                ? 'This goal is already reached — pick a new one above.'
                : needPerMonth <= goalPerMonth
                  ? `At this pace you will hit it well within ${wantMonths} months.`
                  : `To hit it within ${wantMonths} months you need ${formatMoney(needPerMonth)}/mo in this jar (now ${formatMoney(goalPerMonth)}).`}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useApi } from '@rumbelo/contracts/react';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useLiveQuery } from '@rumbelo/hooks';
import { Card } from '@rumbelo/ui';
import { cn , formatMoney } from '@rumbelo/utils';

import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { INCOME_SOURCES, JAR_META, mockDebts, mockFixedCosts } from '@/app/_mock';
import { useAuth } from '@/components/features/shell/auth-provider';
import { ListToolbar } from '@/components/layout/list-toolbar';

type Tab = 'ERUIT' | 'ERIN';

const toVar = (bgClass: string) => bgClass.replace('bg-', 'var(--color-') + ')';

const MOCK_TOTAL_DEBT = mockDebts.reduce((s, d) => s + d.balance, 0);

export function FixedCostsPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('ERUIT');
  const live = isLiveData(householdId);

  const byJarQuery = useLiveQuery(
    api.money.fixedCosts.byJar.queryOptions({ input: { householdId: householdId! } }),
    [] as never,
    live,
  );

  const incomeQuery = useLiveQuery(
    api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
    [] as never,
    live,
  );

  // Flatten byJar groups → same shape the template expects (adds jarKey per item)
  const liveFixedCosts =
    live && byJarQuery.data?.length
      ? (byJarQuery.data as Array<{
          jarId: string;
          jarKey: string;
          jarName: string;
          total: number;
          items: Array<{ id: string; name: string; amount: number; direction: string; cadence: string; dueDay: number | null }>;
        }>).flatMap((group) =>
          group.items
            .filter((i) => i.direction === 'OUT')
            .map((i) => ({
              id: i.id,
              name: i.name,
              // normalise: API amount is positive for OUT direction
              amount: -Math.abs(i.amount),
              cadence: i.cadence,
              dueDay: i.dueDay,
              jarId: group.jarId,
              jarKey: group.jarKey,
            })),
        )
      : null;

  const fixedCosts = liveFixedCosts ?? (mockFixedCosts as unknown as Array<{
    id: string;
    name: string;
    amount: number;
    cadence: string;
    dueDay: number | null;
    jarId?: string;
    jarKey: string;
  }>);

  const liveIncome =
    live && (incomeQuery.data as unknown[] | undefined)?.length
      ? (incomeQuery.data as Array<{
          id: string;
          name: string;
          amount: number;
          kind: string;
          expectedDay: number | null;
        }>).map((s) => ({
          id: s.id,
          label: s.name,
          amount: s.amount,
          kind: s.kind,
          dueDay: s.expectedDay,
        }))
      : null;

  const incomeSources =
    liveIncome ??
    INCOME_SOURCES.map((s) => ({
      id: undefined as string | undefined,
      label: s.label,
      amount: s.amount,
      kind: 'SALARY',
      dueDay: null as null,
    }));

  const NET = incomeSources.reduce((s, i) => s + i.amount, 0);
  const outTotal = fixedCosts.reduce((s, f) => s + Math.abs(f.amount), 0);
  const leftover = NET - outTotal;
  const commitmentRatio = NET > 0
    ? Math.round(((outTotal + (live ? 0 : MOCK_TOTAL_DEBT / 12)) / NET) * 100)
    : 0;

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ FIXED COSTS &amp; INCOME
        </span>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          Set it up once. Then it runs automatically.
        </h1>
      </div>

      <ListToolbar
        createLabel={tab === 'ERUIT' ? '+ Add' : '+ Income source'}
        onCreate={() => router.push(tab === 'ERUIT' ? CREATE_HREF.fixed : CREATE_HREF.income)}
        secondary={
          <span
            className={cn(
              'font-mono text-xs font-medium',
              leftover >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {leftover >= 0 ? '+ ' : ''}
            {formatMoney(leftover)} left after costs
          </span>
        }
      >
        {(['ERUIT', 'ERIN'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-2.5 rounded-full border font-mono text-xs font-medium tracking-wide uppercase px-4 py-2 transition-all duration-200',
              tab === t
                ? 'border-accent/40 bg-accent-soft text-accent'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {t === 'ERUIT' ? 'Out' : 'In'}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-xs',
                tab === t ? 'bg-accent/10 text-accent' : 'bg-raised text-fg-faint',
              )}
            >
              {t === 'ERUIT' ? formatMoney(outTotal) : formatMoney(NET)}
            </span>
          </button>
        ))}
      </ListToolbar>

      {tab === 'ERUIT' && (
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
                ✦ Every month out
              </span>
              <span className="font-mono text-sm text-fg-secondary">{formatMoney(outTotal)}</span>
            </div>

            <div className="grid gap-px">
              {fixedCosts.map((f) => {
                const jar = JAR_META.find((j) => j.key === f.jarKey);
                return (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() =>
                      router.push(updateHref('fixed', f.id))
                    }
                    className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {jar && (
                          <span
                            className="size-1.75 shrink-0 rounded-sm"
                            style={{ background: toVar(jar.color) }}
                          />
                        )}
                        <span className="text-sm text-fg">{f.name}</span>
                        {jar && (
                          <span className="font-mono text-xs tracking-wide uppercase text-fg-muted">
                            {jar.name}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 font-mono text-xs tracking-normal text-fg-faint">
                        Monthly{f.dueDay != null ? ` · day ${f.dueDay}` : ''}
                      </div>
                    </div>
                    <span className="whitespace-nowrap font-mono text-sm text-fg">
                      {formatMoney(f.amount)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4">
              {JAR_META.filter((j) => fixedCosts.some((f) => f.jarKey === j.key)).map((j) => (
                <button
                  key={j.key}
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent"
                >
                  <span className="size-1.75 rounded-sm" style={{ background: toVar(j.color) }} />
                  {j.name} ›
                </button>
              ))}
            </div>

          </Card>

          <Card>
            <span className="font-mono text-xs font-medium tracking-widest uppercase text-fg-muted">
              ✦ Subscription check
            </span>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-fg-secondary">
              Check every quarter that everything here still applies. Small amounts add up — a
              subscription you don't use is money you throw away monthly. Healthy: less
              than 20% of Necessity goes to recurring services.
            </p>
          </Card>
        </div>
      )}

      {tab === 'ERIN' && (
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
                ✦ Every month in
              </span>
              <span className="font-mono text-sm text-success">{formatMoney(NET)}</span>
            </div>

            <div className="grid gap-px">
              {incomeSources.map((s, i) => (
                <button
                  type="button"
                  key={s.id ?? i}
                  onClick={() => {
                    if (!s.id) {
                      router.push(CREATE_HREF.income);
                      return;
                    }
                    router.push(updateHref('income', s.id));
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised"
                >
                  <div>
                    <div className="text-sm text-fg">{s.label}</div>
                    <div className="mt-0.5 font-mono text-xs tracking-normal text-fg-faint">
                      Monthly{s.dueDay != null ? ` · pay day ${s.dueDay}` : ' · pay day'}
                    </div>
                  </div>
                  <span className="whitespace-nowrap font-mono text-sm text-success">
                    {formatMoney(s.amount)}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-line px-5 py-4">
              <p className="mb-3 font-mono text-xs tracking-widest uppercase text-fg-muted">
                How this is split
              </p>
              <div className="flex flex-wrap gap-2">
                {JAR_META.map((j) => (
                  <button
                    key={j.key}
                    type="button"
                    className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 font-mono text-xs text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent"
                  >
                    <span className="size-1.75 rounded-sm" style={{ background: toVar(j.color) }} />
                    {j.name} ›
                  </button>
                ))}
              </div>
            </div>

          </Card>

          <Card>
            <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
              ✦ Is this enough?
            </span>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-fg-secondary">
              {formatMoney(NET)}/mo. Fixed costs{!live && ' + debt'} take{' '}
              <strong className="text-fg">{commitmentRatio}%</strong> — that&apos;s{' '}
              {commitmentRatio < 50 ? 'comfortable' : 'tight'}. Under 50% there&apos;s room to build.
              The real ceiling is income, not cutting costs.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

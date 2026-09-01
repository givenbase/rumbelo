'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@rumbelo/contracts/react';
import { useAuth } from '@/components/features/shell/auth-provider';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';
import { mockGoals } from '@/app/_mock';
import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { useLiveQuery } from '@rumbelo/hooks';
import { AccentCard, EmptyState, Meter } from '@rumbelo/ui';
import { ListToolbar } from '@/components/layout/list-toolbar';

type Tab = 'ON_TRACK' | 'REACHED';

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function eta(saved: number, target: number, monthlyContribution: number): string {
  if (monthlyContribution <= 0) return 'Unknown';
  const months = Math.ceil((target - saved) / monthlyContribution);
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return `${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function GoalsPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('ON_TRACK');
  const live = isLiveData(householdId);

  const goalsQuery = useLiveQuery(
    api.money.goals.list.queryOptions({ input: { householdId: householdId! } }),
    mockGoals as never,
    live,
  );

  const goals = (goalsQuery.data ?? mockGoals) as ReadonlyArray<{
    id: string;
    name: string;
    icon: string | null;
    target: number;
    saved: number;
    monthlyContribution: number;
    jarId?: string | null;
    why?: string | null;
    status?: string;
  }>;

  const active = goals.filter((g) => g.saved < g.target && g.status !== 'REACHED' && g.status !== 'ARCHIVED');
  const reached = goals.filter((g) => g.saved >= g.target || g.status === 'REACHED');
  const shown = tab === 'ON_TRACK' ? active : reached;

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ GOALS
        </span>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          Every goal is a decision you've already made.
        </h1>
        <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
          A goal without a monthly amount is a wish. Every goal below has a pace — that is the
          difference.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Add goal"
        onCreate={() => router.push(CREATE_HREF.goal)}
      >
        {(['ON_TRACK', 'REACHED'] as const).map((t) => {
          const count = t === 'ON_TRACK' ? active.length : reached.length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex items-baseline gap-2 rounded-full border font-mono text-xs font-medium tracking-wide uppercase px-4 py-2.5 transition-all duration-200',
                tab === t
                  ? 'border-accent/40 bg-accent-soft text-accent'
                  : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
              )}
            >
              {t === 'ON_TRACK' ? 'On track' : 'Reached'}
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </ListToolbar>

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.length === 0 ? (
          <EmptyState
            icon="🎯"
            title={tab === 'REACHED' ? 'Nothing reached yet.' : 'No active goals.'}
            body={
              tab === 'REACHED'
                ? 'Keep going — your first touchdown is coming.'
                : 'Add a goal to give yourself direction.'
            }
          />
        ) : (
          shown.map((g) => {
            const progress = g.target > 0 ? g.saved / g.target : 0;
            return (
              <AccentCard
                key={g.id}
                tint="var(--color-jar-lts)"
                className="cursor-pointer transition-colors hover:border-accent-hover"
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1 font-mono text-xs tracking-widest uppercase text-fg-secondary">
                  {g.icon ?? '🎯'} Long term ›
                </div>

                <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-fg">
                  {g.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl text-accent">{formatMoney(g.saved)}</span>
                  <span className="font-mono text-xs text-fg-muted">
                    of {formatMoney(g.target)}
                  </span>
                </div>

                <Meter value={progress} className="mt-3.5" />

                <p className="mt-3 text-sm text-fg-muted">
                  ◇ {formatMoney(g.monthlyContribution)} p/m · done by{' '}
                  {eta(g.saved, g.target, g.monthlyContribution)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(updateHref('goal', g.id))
                  }
                  className="mt-4 w-full rounded-full border border-line-strong py-2.5 font-mono text-xs tracking-wide uppercase text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
                >
                  Edit goal
                </button>
              </AccentCard>
            );
          })
        )}
      </div>
    </div>
  );
}

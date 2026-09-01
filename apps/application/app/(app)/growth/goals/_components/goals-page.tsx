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

type Tab = 'ONDERWEG' | 'BEREIKT';

const NL_MONTHS = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'] as const;

function eta(saved: number, target: number, monthlyContribution: number): string {
  if (monthlyContribution <= 0) return 'Onbekend';
  const months = Math.ceil((target - saved) / monthlyContribution);
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return `${NL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function GoalsPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('ONDERWEG');
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
  const shown = tab === 'ONDERWEG' ? active : reached;

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ DOELEN
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Elk doel is een beslissing die je al genomen hebt.
        </h1>
        <p className="mt-2 max-w-[62ch] text-[15px] text-pretty text-fg-muted">
          Een doel zonder maandbedrag is een wens. Elk doel hieronder heeft een tempo — dat is het
          verschil.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Doel toevoegen"
        onCreate={() => router.push(CREATE_HREF.goal)}
      >
        {(['ONDERWEG', 'BEREIKT'] as const).map((t) => {
          const count = t === 'ONDERWEG' ? active.length : reached.length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex items-baseline gap-2 rounded-full border font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase px-4 py-2.5 transition-all duration-200',
                tab === t
                  ? 'border-accent/40 bg-accent-soft text-accent'
                  : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
              )}
            >
              {t === 'ONDERWEG' ? 'Onderweg' : 'Bereikt'}
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </ListToolbar>

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.length === 0 ? (
          <EmptyState
            icon="🎯"
            title={tab === 'BEREIKT' ? 'Nog niets bereikt.' : 'Geen actieve doelen.'}
            body={
              tab === 'BEREIKT'
                ? 'Blijf doorwerken — de eerste touchdown komt eraan.'
                : 'Voeg een doel toe om je richting te geven.'
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
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1 font-mono text-[9.5px] tracking-[0.16em] uppercase text-fg-secondary">
                  {g.icon ?? '🎯'} Lange termijn ›
                </div>

                <h3 className="font-display text-[23px] font-semibold leading-tight tracking-tight text-fg">
                  {g.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-[22px] text-accent">{formatMoney(g.saved)}</span>
                  <span className="font-mono text-[12px] text-fg-muted">
                    van {formatMoney(g.target)}
                  </span>
                </div>

                <Meter value={progress} className="mt-3.5" />

                <p className="mt-3 text-[13px] text-fg-muted">
                  ◇ {formatMoney(g.monthlyContribution)} p/m · klaar in{' '}
                  {eta(g.saved, g.target, g.monthlyContribution)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(updateHref('goal', g.id))
                  }
                  className="mt-4 w-full rounded-full border border-line-strong py-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
                >
                  Doel bewerken
                </button>
              </AccentCard>
            );
          })
        )}
      </div>
    </div>
  );
}

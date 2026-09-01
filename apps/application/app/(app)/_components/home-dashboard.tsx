'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { useLiveQuery } from '@rumbelo/hooks';
import { Eyebrow } from '@rumbelo/ui';
import { formatMoney, formatPeriod , toPeriodKey } from '@rumbelo/utils';

import type { CoachMessage, CoachRecapItem } from '@/components/features/home/coach-verdict';

import { isLiveData } from '@/app/_lib/preview';
import { mockDashboard, mockEnergy, mockJars, mockTurn } from '@/app/_mock';
import { CoachVerdict } from '@/components/features/home/coach-verdict';
import { HeroKluis } from '@/components/features/home/hero-kluis';
import { PortalWidget } from '@/components/features/home/portal-widget';
import { TurnLog } from '@/components/features/home/turn-log';
import { JarDrilldownTable } from '@/components/features/money/jar-drilldown-table';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

const FALLBACK_RECAP: CoachRecapItem[] = [
  { portal: 'Money', value: '—', what: 'spent this week', tint: 'var(--color-jar-give)', href: '/money/transactions' },
  { portal: 'Growth', value: '—', what: 'income growth/year', tint: 'var(--color-jar-lts)', href: '/growth' },
  { portal: 'Energy', value: '—', what: 'trained this week', tint: 'var(--color-jar-play)', href: '/energy' },
  { portal: 'Soul', value: '—', what: 'stillness today', tint: 'var(--color-portal-soul)', href: '/soul' },
];

export function HomeDashboardClient() {
  const api = useApi();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { householdId } = useAuth();
  const { period, showToast, openOnboarding } = useAppShell();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('onboarding') === '1' && !householdId) {
      openOnboarding();
    }
  }, [searchParams, householdId, openOnboarding]);
  const periodKey = toPeriodKey(period.year, period.month);
  const live = isLiveData(householdId);

  const dashboardQuery = useLiveQuery(
    api.money.dashboard.get.queryOptions({
      input: { householdId: householdId!, period: periodKey },
    }),
    mockDashboard as never,
    live,
  );

  const closeTurnMutation = useMutation({
    mutationFn: async () => {
      if (!householdId) throw new Error('No household');
      return client.money.turn.close({ householdId, period: periodKey });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
      showToast('Month closed', 'success');
    },
    onError: () => showToast('Close failed', 'error'),
  });

  const mock = mockDashboard;
  const liveData = dashboardQuery.data;
  const d = live ? { ...mock, ...(liveData ?? {}) } : (liveData ?? mock);
  const jars = live ? (liveData?.jars?.length ? liveData.jars : []) : mockJars;
  const turn = liveData?.turn ?? mockTurn;
  const periodLabel = liveData?.periodLabel ?? formatPeriod(periodKey, 'en-US');
  const coach: CoachMessage[] =
    live && liveData?.coach?.length
      ? liveData.coach.map((m: (typeof liveData.coach)[number]) => ({
          id: m.id,
          kind: m.kind,
          text: m.text,
          ctaLabel: m.ctaLabel ?? 'Open',
          ctaHref: m.ctaHref ?? '/',
        }))
      : [];

  const sleepScore = mockEnergy.find((e) => e.metric === 'SLEEP')?.value ?? 0;

  return (
    <div className="grid gap-6">
      <div>
        <Eyebrow>✦ {formatPeriod(d.period ?? periodKey, 'en-US')}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
          {periodLabel}
        </h1>
      </div>

      <CoachVerdict
        messages={
          coach.length
            ? coach
            : [
                {
                  id: 'fallback',
                  kind: 'NUDGE',
                  text: d.inboxCount
                    ? `${d.inboxCount} transaction${d.inboxCount === 1 ? '' : 's'} waiting for a jar.`
                    : 'All sorted — time for intention.',
                  ctaLabel: d.inboxCount ? 'Sort inbox' : 'Weekly ritual',
                  ctaHref: d.inboxCount ? '/money/transactions' : '/ritual',
                },
              ]
        }
        recap={FALLBACK_RECAP}
      />

      <HeroKluis
        total={formatMoney(d.allocatedTotal ?? mockDashboard.allocatedTotal)}
        incomeBreakdown={`Distributed across ${jars.length} jar${jars.length === 1 ? '' : 's'}`}
        stats={[
          { label: 'Avg left/month', value: formatMoney(d.avgLeftOver ?? 0), tone: 'accent' },
          { label: 'Safe per day', value: formatMoney(d.safePerDay ?? 0), tone: 'accent' },
          { label: 'Left in Play', value: formatMoney(d.playLeft ?? 0) },
        ]}
      >
        <JarDrilldownTable jars={jars as never} />
      </HeroKluis>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PortalWidget
          tint="var(--color-jar-lts)"
          icon="↗"
          title="Growth"
          href="/growth"
          stats={[
            { label: 'INCOME THIS MONTH', value: formatMoney(d.incomeTotal ?? 0) },
            { label: 'INBOX', value: String(d.inboxCount ?? 0) },
          ]}
          tagline="Cutting costs has a floor; raising income does not."
        />
        <PortalWidget
          tint="var(--color-jar-play)"
          icon={"✳\uFE0E"}
          title="Energy"
          href="/energy"
          stats={[
            { label: 'TRAINED THIS WEEK', value: '3h' },
            { label: 'SLEEP SCORE', value: String(sleepScore) },
          ]}
          tagline="A tired mind spends; a rested mind directs."
        />
        <PortalWidget
          tint="var(--color-portal-soul)"
          icon="✦"
          title="Soul"
          href="/soul"
          stats={[
            { label: 'STILLNESS TODAY', value: '10 min' },
            { label: 'WHY', value: d.why ? '✓' : '—' },
          ]}
          tagline="A calm mind directs money. A restless one spends it."
        />
      </div>

      <TurnLog
        score={turn.score}
        daysLeft={turn.daysLeft}
        events={turn.events}
      />

      {live && liveData?.turn && !liveData.turn.closed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => closeTurnMutation.mutate()}
            disabled={closeTurnMutation.isPending}
            className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-xs font-medium tracking-wide uppercase text-fg-muted transition-colors hover:border-accent-hover hover:text-accent disabled:opacity-50"
          >
            {closeTurnMutation.isPending ? 'Working…' : 'Close turn'}
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import type { CoachMessage, CoachRecapItem } from '@/components/features/home/coach-verdict';
import { CoachVerdict } from '@/components/features/home/coach-verdict';
import { HeroKluis } from '@/components/features/home/hero-kluis';
import { JarDrilldownTable } from '@/components/features/money/jar-drilldown-table';
import { PortalWidget } from '@/components/features/home/portal-widget';
import { TurnLog } from '@/components/features/home/turn-log';
import { Eyebrow } from '@rumbelo/ui';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { formatMoney, formatPeriod } from '@rumbelo/utils';
import { mockDashboard, mockEnergy, mockJars, mockTurn } from '@/app/_mock';
import { isLiveData } from '@/app/_lib/preview';
import { toPeriodKey } from '@rumbelo/utils';
import { useLiveQuery } from '@rumbelo/hooks';
import { useApi, useApiClient } from '@rumbelo/contracts/react';

const FALLBACK_RECAP: CoachRecapItem[] = [
  { portal: 'Geld', value: '—', what: 'besteed deze week', tint: 'var(--color-jar-give)', href: '/money/transactions' },
  { portal: 'Groei', value: '—', what: 'inkomen stijging/jaar', tint: 'var(--color-jar-lts)', href: '/growth' },
  { portal: 'Energie', value: '—', what: 'getraind deze week', tint: 'var(--color-jar-play)', href: '/energy' },
  { portal: 'Ziel', value: '—', what: 'stilte vandaag', tint: 'var(--color-portal-soul)', href: '/soul' },
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
      showToast('Maand afgesloten', 'success');
    },
    onError: () => showToast('Afsluiten mislukt', 'error'),
  });

  const mock = mockDashboard;
  const liveData = dashboardQuery.data;
  const d = live ? { ...mock, ...(liveData ?? {}) } : (liveData ?? mock);
  const jars = live ? (liveData?.jars?.length ? liveData.jars : []) : mockJars;
  const turn = liveData?.turn ?? mockTurn;
  const periodLabel = liveData?.periodLabel ?? formatPeriod(periodKey, 'nl-NL');
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
        <Eyebrow>✦ {formatPeriod(d.period ?? periodKey, 'nl-NL')}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
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
                    ? `${d.inboxCount} transacties wachten op een potje.`
                    : 'Alles gesorteerd — tijd voor intentie.',
                  ctaLabel: d.inboxCount ? 'Inbox sorteren' : 'Weekritueel',
                  ctaHref: d.inboxCount ? '/money/transactions' : '/ritual',
                },
              ]
        }
        recap={FALLBACK_RECAP}
      />

      <HeroKluis
        total={formatMoney(d.allocatedTotal ?? mockDashboard.allocatedTotal)}
        incomeBreakdown={`Verdeeld over ${jars.length} potten`}
        stats={[
          { label: 'Gemiddeld over/maand', value: formatMoney(d.avgLeftOver ?? 0), tone: 'accent' },
          { label: 'Veilig per dag', value: formatMoney(d.safePerDay ?? 0), tone: 'accent' },
          { label: 'Over in Spelen', value: formatMoney(d.playLeft ?? 0) },
        ]}
      >
        <JarDrilldownTable jars={jars as never} />
      </HeroKluis>

      <div className="flex flex-wrap items-stretch gap-4.5">
        <PortalWidget
          tint="var(--color-jar-lts)"
          icon="↗"
          title="Groei"
          href="/growth"
          stats={[
            { label: 'INKOMEN DEZE MAAND', value: formatMoney(d.incomeTotal ?? 0) },
            { label: 'INBOX', value: String(d.inboxCount ?? 0) },
          ]}
          tagline="Kosten snijden heeft een vloer; inkomen verhogen niet."
        />
        <PortalWidget
          tint="var(--color-jar-play)"
          icon={"✳\uFE0E"}
          title="Energie"
          href="/energy"
          stats={[
            { label: 'GETRAIND DEZE WEEK', value: '3u' },
            { label: 'SLAAPSCORE', value: String(sleepScore) },
          ]}
          tagline="Een moe hoofd besteedt; een uitgerust hoofd stuurt."
        />
        <PortalWidget
          tint="var(--color-portal-soul)"
          icon="✦"
          title="Ziel"
          href="/soul"
          stats={[
            { label: 'STILTE VANDAAG', value: '10 min' },
            { label: 'WAAROM', value: d.why ? '✓' : '—' },
          ]}
          tagline="Een kalm verstand stuurt geld. Een rusteloos verstand geeft het uit."
        />
      </div>

      <TurnLog
        score={turn.score}
        daysLeft={turn.daysLeft}
        levelLabel={turn.levelLabel}
        events={turn.events}
      />

      {live && liveData?.turn && !liveData.turn.closed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => closeTurnMutation.mutate()}
            disabled={closeTurnMutation.isPending}
            className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-fg-muted transition-colors hover:border-accent-hover hover:text-accent disabled:opacity-50"
          >
            {closeTurnMutation.isPending ? 'Bezig…' : 'Beurt afsluiten'}
          </button>
        </div>
      )}
    </div>
  );
}

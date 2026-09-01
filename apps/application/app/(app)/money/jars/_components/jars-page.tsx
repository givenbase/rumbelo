'use client';

import { useRouter } from 'next/navigation';
import { useApi } from '@rumbelo/contracts/react';
import { Badge, Card, Eyebrow } from '@rumbelo/ui';
import { JarDrilldownRow } from '@/components/features/money/jar-drilldown-row';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { formatMoney, formatPercent } from '@rumbelo/utils';
import { INCOME_SOURCES, mockJars } from '@/app/_mock';
import { CREATE_HREF } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { toPeriodKey } from '@rumbelo/utils';
import { useLiveQuery } from '@rumbelo/hooks';
import { ListToolbar } from '@/components/layout/list-toolbar';

const MOCK_NET = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);

export function JarsPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const { period } = useAppShell();
  const router = useRouter();
  const periodKey = toPeriodKey(period.year, period.month);
  const live = isLiveData(householdId);

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
  const total = jars.reduce((s, j) => s + j.percentage, 0);
  const onTarget = jars.filter((j) => !j.overspent).length;

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ DE ZES POTTEN
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Elke euro krijgt een taak voordat hij binnenkomt.
        </h1>
        <p className="mt-2 max-w-[58ch] text-[15px] text-pretty text-fg-muted">
          Inkomen komt binnen, de splitsing gebeurt dezelfde seconde. Financial Freedom geef je nooit
          uit — die investeer je alleen.
        </p>
      </div>

      <ListToolbar
        createLabel="+ Verplaatsen"
        onCreate={() => router.push(CREATE_HREF.move)}
      >
        <span className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase text-accent">
          {onTarget} / {jars.length} potten op koers
        </span>
        <span className="text-sm text-fg-muted">Klap een pot open om categorieën te zien</span>
      </ListToolbar>

      <Card className="flex flex-wrap items-center justify-between gap-4 py-3">
        <div>
          <Eyebrow>Totale verdeling</Eyebrow>
          <p className="mt-1 text-sm text-fg-secondary">
            Maandinkomen · {formatMoney(net)} per maand
          </p>
        </div>
        <Badge tone={Math.abs(total - 100) < 0.01 ? 'success' : 'danger'}>
          {formatPercent(total)} verdeeld
        </Badge>
      </Card>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="font-mono text-[9.5px] font-medium tracking-[0.18em] uppercase text-fg-faint">
            Pot
          </span>
        </div>
        <div className="px-5 py-1">
          {jars.map((jar) => (
            <JarDrilldownRow key={jar.id} jar={jar as never} />
          ))}
        </div>
      </Card>
    </div>
  );
}

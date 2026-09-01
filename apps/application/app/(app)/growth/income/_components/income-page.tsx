'use client';

import { AccentCard, Card, Eyebrow } from '@rumbelo/ui';
import { formatMoney } from '@rumbelo/utils';
import { JAR_META, mockJars } from '@/app/_mock';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useRouter } from 'next/navigation';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { toPeriodKey } from '@rumbelo/utils';
import { useLiveQuery } from '@rumbelo/hooks';
import { useApi } from '@rumbelo/contracts/react';
import { ListToolbar } from '@/components/layout/list-toolbar';

const TARGET = 600_000;

const LEVERS = [
  {
    meta: 'Hefboom 1',
    name: 'Tarief verhogen',
    desc: 'Elke €100 meer per dag is €2.000 extra per maand. Eén gesprek kan het doen.',
    color: 'var(--color-accent)',
  },
  {
    meta: 'Hefboom 2',
    name: 'Extra dienst',
    desc: 'Een tweede product of dienst heeft nul vaste kosten als de eerste al draait.',
    color: 'var(--color-jar-lts)',
  },
  {
    meta: 'Hefboom 3',
    name: 'Passief bouwen',
    desc: 'Iets dat één keer wordt gemaakt en daarna blijft werken. Begint klein, nooit nul.',
    color: 'var(--color-jar-ff)',
  },
  {
    meta: 'Hefboom 4',
    name: 'Netwerk activeren',
    desc: 'Omzet die via mensen komt kost geen marketing. Elke tevreden klant is een kanaal.',
    color: 'var(--color-jar-edu)',
  },
] as const;

export function IncomePageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const { period } = useAppShell();
  const router = useRouter();
  const periodKey = toPeriodKey(period.year, period.month);
  const live = isLiveData(householdId);

  const incomeQuery = useLiveQuery(
    api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );

  const jarsQuery = useLiveQuery(
    api.money.jars.balances.queryOptions({ input: { householdId: householdId!, period: periodKey } }),
    mockJars as never,
    live,
  );

  const NET = live
    ? (incomeQuery.data ?? []).filter((s) => s.active).reduce((s, i) => s + i.amount, 0)
    : 430_000;
  const GAP = TARGET - NET;
  const jars = jarsQuery.data ?? mockJars;
  const sources = live
    ? (incomeQuery.data ?? []).filter((s) => s.active)
    : [];

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ MIJN INKOMEN
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Bezuinigen heeft een bodem. Verdienen niet.
        </h1>
      </div>

      <ListToolbar
        createLabel="+ Toevoegen"
        onCreate={() => router.push(CREATE_HREF.income)}
      >
        <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ Inkomstenbronnen
        </span>
      </ListToolbar>

      <div className="flex flex-wrap items-start gap-5">
        <AccentCard tint="var(--color-accent)" className="grid min-w-0 flex-[1_1_340px] gap-5">
          <div className="flex flex-wrap gap-6">
            <div className="grid gap-1.5">
              <Eyebrow>Nu, per maand</Eyebrow>
              <p className="font-display text-[clamp(30px,4.4vw,40px)] font-semibold leading-none tracking-tight text-fg">
                {formatMoney(NET)}
              </p>
              <p className="font-mono text-[10.5px] text-fg-muted">{formatMoney(NET * 12)} per jaar</p>
            </div>
            <div className="grid gap-1.5">
              <Eyebrow>Doel</Eyebrow>
              <p
                className="font-display text-[clamp(30px,4.4vw,40px)] font-semibold leading-none tracking-tight"
                style={{
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatMoney(TARGET)}
              </p>
            </div>
            <div className="grid gap-1.5">
              <Eyebrow>Gat</Eyebrow>
              <p className="font-display text-[clamp(30px,4.4vw,40px)] font-semibold leading-none tracking-tight text-warning">
                {formatMoney(GAP)}
              </p>
            </div>
          </div>
        </AccentCard>

        <Card className="grid min-w-0 flex-[1_1_300px] content-start gap-4">
          <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-accent">
            ✦ Wat dat met elke pot doet
          </span>
          <div>
            {JAR_META.map((j) => {
              const jar = jars.find((mj) => mj.key === j.key)!;
              const now = jar?.allocated ?? 0;
              const then = Math.round((TARGET * j.pct) / 100);
              return (
                <div
                  key={j.key}
                  className="grid grid-cols-[16px_1fr_auto_auto] items-center gap-2.5 border-b border-line py-2.5 last:border-b-0"
                >
                  <span>{j.icon}</span>
                  <span className="min-w-0 truncate text-[13px] text-fg-secondary">{j.name}</span>
                  <span className="whitespace-nowrap font-mono text-[11.5px] text-fg-muted">
                    {formatMoney(now)} →
                  </span>
                  <span className="whitespace-nowrap font-mono text-[12.5px] text-success">
                    {formatMoney(then)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b border-line px-5 py-3.5">
          <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-accent">
            ✦ Inkomstenbronnen
          </span>
        </div>
        {sources.length === 0 ? (
          <p className="px-5 py-4 text-sm text-fg-muted">
            {live
              ? 'Nog geen inkomstenbronnen — voeg er een toe om potten te voeden.'
              : 'Log in om inkomstenbronnen te beheren.'}
          </p>
        ) : (
          <div className="grid gap-px">
            {sources.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() =>
                  router.push(updateHref('income', s.id))
                }
                className="grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-5 py-3 text-left last:border-b-0 hover:bg-raised"
              >
                <div>
                  <div className="text-[14px] text-fg">{s.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-fg-faint">
                    {s.kind}
                  </div>
                </div>
                <span className="font-mono text-[13.5px] text-success">{formatMoney(s.amount)}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEVERS.map((l) => (
          <AccentCard key={l.name} tint={l.color} className="grid content-start gap-2.5">
            <span
              className="font-mono text-[9.5px] font-medium tracking-[0.16em] uppercase"
              style={{ color: l.color }}
            >
              {l.meta}
            </span>
            <h3 className="font-display text-[19px] font-semibold leading-snug tracking-tight text-fg">
              {l.name}
            </h3>
            <p className="text-[13.5px] leading-relaxed text-pretty text-fg-muted">{l.desc}</p>
          </AccentCard>
        ))}
      </div>
    </div>
  );
}

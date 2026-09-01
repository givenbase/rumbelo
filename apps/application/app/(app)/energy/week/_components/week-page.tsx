'use client';

import { useApi } from '@rumbelo/contracts/react';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useLiveQuery } from '@rumbelo/hooks';
import { mockEnergy, JAR_META, SLEEP_HOURS } from '@/app/_mock';
import { isLiveData } from '@/app/_lib/preview';
import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

const STEERED_HOURS = 40;
const SLEEP_WEEK = SLEEP_HOURS * 7;
const REST_HOURS = 168 - SLEEP_WEEK - STEERED_HOURS;

const WEEK_WHOLE = [
  { name: 'Slaap', hours: `${SLEEP_WEEK}u`, pct: Math.round((SLEEP_WEEK / 168) * 100), color: 'var(--color-jar-lts)' },
  { name: 'Al het andere', hours: `${REST_HOURS}u`, pct: Math.round((REST_HOURS / 168) * 100), color: 'var(--color-sunken)' },
  { name: 'Jij stuurt', hours: `${STEERED_HOURS}u`, pct: Math.round((STEERED_HOURS / 168) * 100), color: 'var(--color-accent)' },
] as const;

const JAR_BORDER: Record<string, string> = {
  NECESSITIES: 'border-t-jar-nec',
  FINANCIAL_FREEDOM: 'border-t-jar-ff',
  LONG_TERM_SAVINGS: 'border-t-jar-lts',
  EDUCATION: 'border-t-jar-edu',
  PLAY: 'border-t-jar-play',
  GIVE: 'border-t-jar-give',
};

const METRIC_LABEL: Record<string, string> = {
  SLEEP: 'Slaap',
  TRAIN: 'Training',
  FOOD: 'Voeding',
  MIND: 'Stilte',
};

const TREND_ICON: Record<string, string> = { UP: '↑', FLAT: '→', DOWN: '↓' };
const TREND_CLASS: Record<string, string> = { UP: 'text-success', FLAT: 'text-fg-muted', DOWN: 'text-danger' };

export function WeekPageClient() {
  const api = useApi();
  const { householdId } = useAuth();
  const live = isLiveData(householdId);

  const summaryQuery = useLiveQuery(
    api.energy.logs.summary.queryOptions({ input: { householdId: householdId! } }),
    mockEnergy.map((e) => ({
      metric: e.metric,
      average7d: e.value,
      average28d: e.value,
      trend: e.trend,
      spendCorrelation: null,
    })) as never,
    live,
  );

  const summary = summaryQuery.data ?? [];

  return (
    <div className="grid animate-rise gap-6">
      <Section eyebrow="Mijn week" title="Elk uur krijgt ook een taak.">
        <p className="max-w-[62ch] text-[15px] text-fg-muted">
          Dezelfde zes percentages, maar uitgegeven in uren. Geld koopt dingen; uren bouwen de
          persoon die het verdient.
        </p>
      </Section>

      {/* ── Live energy summary ── */}
      {summary.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(summary as Array<{ metric: string; average7d: number; trend: string }>).map((s) => (
            <div
              key={s.metric}
              className="flex items-center gap-3 rounded-xl border border-line bg-raised px-4 py-2.5"
            >
              <span className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-fg-muted">
                {METRIC_LABEL[s.metric] ?? s.metric}
              </span>
              <span className="font-mono text-[15px] font-semibold text-fg">
                {Math.round(s.average7d)}
              </span>
              <span className={cn('font-mono text-[11px]', TREND_CLASS[s.trend] ?? 'text-fg-muted')}>
                {TREND_ICON[s.trend] ?? ''}
              </span>
            </div>
          ))}
        </div>
      )}

      <Card className="grid gap-5 p-6">
        {/* ── 168-hour overview bar ── */}
        <div>
          <Eyebrow>Je week heeft 168 uur</Eyebrow>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full gap-0.5">
            {WEEK_WHOLE.map((w) => (
              <span
                key={w.name}
                title={`${w.name} — ${w.hours}`}
                className="block h-full"
                style={{ width: `${w.pct}%`, background: w.color }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {WEEK_WHOLE.map((w) => (
              <span key={w.name} className="flex items-baseline gap-2 font-mono text-[10px] text-fg-muted">
                <span className="size-2 rounded-sm" style={{ background: w.color }} />
                {w.name} {w.hours}
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-fg-muted">
            Van die 168 uur stuur jij er zelf ongeveer {STEERED_HOURS}. De rest gaat naar slaap,
            werk en alles wat zonder keuze gebeurt.
          </p>
        </div>

        {/* ── Steered-hours slider ── */}
        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
          <Eyebrow className="whitespace-nowrap text-accent">Daarvan stuur je zelf</Eyebrow>
          <input
            type="range"
            min={8}
            max={70}
            defaultValue={STEERED_HOURS}
            className="min-w-50 flex-1 accent-accent"
            readOnly
          />
          <span className="font-display text-3xl font-semibold tabular-nums text-accent">
            {STEERED_HOURS}u
          </span>
        </div>

        {/* ── Per-jar hour cards ── */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(150px,30%,240px),1fr))] gap-3">
          {JAR_META.map((j) => {
            const hours = Math.round((STEERED_HOURS * j.pct) / 100);
            return (
              <div
                key={j.key}
                className={cn(
                  'grid gap-2 rounded-[14px] border border-line border-t-[3px] bg-raised p-4',
                  JAR_BORDER[j.key],
                )}
              >
                <span className={cn('flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase tracking-wider', j.text)}>
                  <span aria-hidden>{j.icon}</span>
                  {j.name}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-[26px] font-semibold tabular-nums text-fg">{hours}u</span>
                  <span className="font-mono text-[10px] text-fg-faint">{j.pct}%</span>
                </span>
                <span className="text-[12.5px] leading-snug text-fg-muted">{j.subtitle}</span>
              </div>
            );
          })}
        </div>

        {/* ── Where time and money disagree ── */}
        <div className="border-t border-line pt-5">
          <Eyebrow className="text-accent">✦ Waar tijd en geld niet kloppen</Eyebrow>
          <p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-fg-secondary">
            Je geeft Play 10% van je geld maar slechts{' '}
            {Math.round((Math.round((STEERED_HOURS * 10) / 100) / STEERED_HOURS) * 100)}% van je
            stuurbare uren. Dat is geen falen — het is een signaal dat je plezier vooral in kleine
            impulsen zit, niet in geplande blokken.
          </p>
        </div>
      </Card>
    </div>
  );
}

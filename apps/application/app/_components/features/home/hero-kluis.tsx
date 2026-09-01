import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@rumbelo/utils';
import { Eyebrow, HeroNumber } from '@rumbelo/ui';

interface KluisStat {
  label: string;
  value: string;
  tone?: 'accent' | 'default';
}

/**
 * Dashboard hero card — "de kluis" (design: Kluis Finance App.dc.html:393-421).
 *
 * Shows the gradient allocated-total, a concise income-breakdown line, and a
 * row of three anchor stats. Below the divider, renders whatever is passed as
 * `children` — typically a JarDrilldownTable.
 */
export function HeroKluis({
  total,
  incomeBreakdown,
  stats,
  children,
}: {
  total: string;
  incomeBreakdown: string;
  stats: KluisStat[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-accent/30 bg-surface p-6 shadow-glow sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        {/* Hero figure */}
        <div>
          <Eyebrow>Geld · Verdeeld deze maand</Eyebrow>
          <HeroNumber className="mt-2.5 text-[40px] leading-none sm:text-[52px]">{total}</HeroNumber>
          <p className="mt-2 text-sm text-fg-muted">{incomeBreakdown}</p>
        </div>

        {/* Anchor stats */}
        <div className="flex flex-wrap gap-7">
          {stats.map((s) => (
            <div key={s.label} className="grid gap-1.5">
              <Eyebrow className="whitespace-nowrap">{s.label}</Eyebrow>
              <p
                className={cn(
                  'font-display text-[28px] leading-none font-semibold tracking-tight tabular-nums',
                  s.tone === 'accent' ? 'text-accent' : 'text-fg',
                )}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-line" />

      {/* Jar section header */}
      <div className="flex items-center justify-between">
        <Eyebrow>✦ De zes potjes</Eyebrow>
        <Link
          href="/money/jars"
          className="font-mono text-[11px] font-semibold tracking-[0.12em] text-fg-muted uppercase hover:text-accent"
        >
          Beheer ▸
        </Link>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

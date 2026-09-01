import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@rumbelo/utils';
import { Eyebrow, HeroNumber } from '@rumbelo/ui';

interface Stat {
  label: string;
  value: string;
  tone?: 'accent' | 'default';
}

/**
 * Dashboard hero (design: Kluis Finance App.dc.html:393-421) — the gradient
 * "allocated this month" figure, the 3-stat row, and the header above the
 * jar list (rendered as `children`, via JarDrilldownRow).
 */
export function HeroCard({
  total, incomeBreakdown, stats, children,
}: {
  total: string;
  incomeBreakdown: string;
  stats: Stat[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-accent-hover bg-surface p-6 shadow-glow sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Eyebrow>Money · Allocated this month</Eyebrow>
          <HeroNumber className="mt-2.5 text-[40px] leading-none sm:text-[52px]">{total}</HeroNumber>
          <p className="mt-2 text-sm text-fg-muted">{incomeBreakdown}</p>
        </div>
        <div className="flex flex-wrap gap-7">
          {stats.map((s) => (
            <div key={s.label} className="grid gap-1.5">
              <Eyebrow className="whitespace-nowrap">{s.label}</Eyebrow>
              <p
                className={cn(
                  'font-display text-[28px] leading-none font-semibold tracking-tight',
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

      <div className="flex items-center justify-between">
        <Eyebrow>✦ The six jars</Eyebrow>
        <Link href="/money/jars" className="font-mono text-[11px] font-semibold tracking-[0.12em] text-fg-muted uppercase hover:text-accent">
          Manage ▸
        </Link>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

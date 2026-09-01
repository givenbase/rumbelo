'use client';

import { useState } from 'react';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';

interface JarCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
}

interface DashboardJar {
  name: string;
  subtitle: string;
  icon: string;
  color: string; // Tailwind bg-* class
  allocated: number;
  remaining: number;
  overspent: boolean;
  categories: JarCategory[];
}

/**
 * One collapsible jar row inside HeroCard (design: Kluis Finance App.dc.html
 * :422-465) — click to expand a 4-column category table sourced from
 * `JarBalance.categories`.
 */
export function JarDrilldownRow({ jar }: { jar: DashboardJar }) {
  const [open, setOpen] = useState(false);
  const usedPct = jar.allocated > 0 ? Math.min(100, Math.round(((jar.allocated - jar.remaining) / jar.allocated) * 100)) : 0;

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[minmax(76px,1.5fr)_minmax(36px,2fr)_minmax(70px,auto)_14px] items-center gap-2 rounded-lg px-1.5 py-2.5 text-left transition-colors hover:bg-raised sm:grid-cols-[minmax(96px,1.3fr)_minmax(60px,3fr)_minmax(88px,auto)_14px] sm:gap-2.5"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-7.5 shrink-0 place-items-center rounded-[9px] border border-line bg-raised text-sm">{jar.icon}</span>
          <span className="grid min-w-0 gap-0.5">
            <span className="truncate text-sm text-fg">{jar.name}</span>
            <span className="truncate font-mono text-[10px] tracking-[0.08em] text-fg-faint">{jar.subtitle}</span>
          </span>
        </span>
        <span className="h-2 overflow-hidden rounded-full bg-sunken">
          <span
            className={cn('block h-full rounded-full', jar.overspent ? 'bg-danger' : jar.color)}
            style={{ width: `${jar.overspent ? 100 : usedPct}%` }}
          />
        </span>
        <span className="text-right">
          <div className={cn('font-mono text-[13px]', jar.overspent ? 'text-danger' : 'text-fg')}>{formatMoney(jar.remaining)}</div>
          <div className="font-mono text-[10px] text-fg-faint">of {formatMoney(jar.allocated)}</div>
        </span>
        <span className={cn('text-center text-xs text-fg-faint transition-transform', open && 'rotate-180')}>▾</span>
      </button>

      {open && (
        <div className="mb-3 ml-11.5 grid animate-rise">
          <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_90px] gap-3 pb-2 text-[9px] font-medium tracking-[0.14em] text-fg-faint uppercase">
            <span>Category</span>
            <span className="text-right">Planned</span>
            <span className="text-right">Spent</span>
            <span className="text-right">Over / under</span>
          </div>
          {jar.categories.length === 0 ? (
            <p className="border-t border-line py-1.5 text-[12.5px] text-fg-faint">No categories yet.</p>
          ) : (
            jar.categories.map((c) => {
              const diff = c.budgeted - c.actual;
              return (
                <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_80px_80px_90px] items-baseline gap-3 border-t border-line py-1.5">
                  <span className="text-[13px] text-fg-secondary">{c.name}</span>
                  <span className="text-right font-mono text-[12.5px] text-fg-muted">{formatMoney(c.budgeted)}</span>
                  <span className="text-right font-mono text-[12.5px] text-fg">{formatMoney(c.actual)}</span>
                  <span className={cn('text-right font-mono text-[12.5px]', diff < 0 ? 'text-danger' : 'text-success')}>
                    {formatMoney(diff, { signed: true })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

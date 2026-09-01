'use client';

import { useAppShell, type Period } from '@/components/features/shell/app-shell-context';

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
];

function encode(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, '0')}`;
}

function decode(v: string): Period {
  const parts = v.split('-');
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  if (!Number.isFinite(y) || !Number.isFinite(m)) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }
  return { year: y, month: m };
}

/** Last 12 months, most recent first. */
function buildOptions(): Array<{ value: string; label: string }> {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    return {
      value: encode({ year, month }),
      label: `${MONTHS_SHORT[d.getMonth()]} ${year}`,
    };
  });
}

export function PeriodSelector() {
  const { period, setPeriod } = useAppShell();
  const options = buildOptions();
  const value = encode(period);

  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-fg-faint">
        Periode
      </span>
      <select
        value={value}
        onChange={(e) => setPeriod(decode(e.target.value))}
        className="h-8 appearance-none rounded-full border border-line bg-raised pl-16 pr-6 font-mono text-[11px] font-medium text-fg transition-colors hover:border-line-strong focus:border-accent focus:outline-none"
        aria-label="Selecteer periode"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[9px] text-fg-faint" aria-hidden>
        ▾
      </span>
    </div>
  );
}

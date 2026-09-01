import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';

export interface JarCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
}

export interface JarDrilldownItem {
  id?: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  allocated: number;
  remaining: number;
  overspent: boolean;
  categories: JarCategory[];
}

const ROW =
  'grid w-full grid-cols-12 items-center gap-3 rounded-lg px-1.5 py-2 text-left outline-none transition-colors hover:bg-raised focus-visible:ring-2 focus-visible:ring-accent/25';

export function JarDrilldownTrigger({
  jar,
  open,
  onToggle,
}: {
  jar: JarDrilldownItem;
  open: boolean;
  onToggle: () => void;
}) {
  const usedPct =
    jar.allocated > 0
      ? Math.min(100, Math.round(((jar.allocated - jar.remaining) / jar.allocated) * 100))
      : 0;

  return (
    <button type="button" onClick={onToggle} aria-expanded={open} className={ROW}>
      <span className="col-span-4 flex min-w-0 items-center gap-2.5">
        <span className="grid size-7.5 shrink-0 place-items-center rounded-lg border border-line bg-raised text-sm">
          {jar.icon}
        </span>
        <span className="grid min-w-0 gap-0.5">
          <span className="truncate text-sm text-fg">{jar.name}</span>
          <span className="truncate font-mono text-xs tracking-wide text-fg-faint">{jar.subtitle}</span>
        </span>
      </span>

      <span className="col-span-5 h-2 overflow-hidden rounded-full bg-sunken">
        <span
          className={cn('block h-full rounded-full transition-all duration-500 ease-out', jar.color)}
          style={{ width: `${usedPct}%` }}
        />
      </span>

      <span className="col-span-2 text-right tabular-nums">
        <div className={cn('font-mono text-sm', jar.overspent ? 'text-danger' : 'text-fg')}>
          {formatMoney(jar.remaining)}
        </div>
        <div className="font-mono text-xs text-fg-faint">of {formatMoney(jar.allocated)}</div>
      </span>

      <span
        className={cn(
          'col-span-1 text-center text-xs text-fg-faint transition-transform duration-200',
          open && 'rotate-180',
        )}
      >
        ▾
      </span>
    </button>
  );
}

export function JarCategoryTable({ categories }: { categories: JarCategory[] }) {
  if (categories.length === 0) {
    return <p className="border-t border-line py-1.5 text-sm text-fg-faint">No categories yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
          <th className="pb-2 text-left font-medium">Category</th>
          <th className="w-20 pb-2 text-right font-medium">Planned</th>
          <th className="w-20 pb-2 text-right font-medium">Spent</th>
          <th className="w-24 pb-2 text-right font-medium">Over / under</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((c) => {
          const diff = c.budgeted - c.actual;
          return (
            <tr key={c.id} className="border-t border-line">
              <td className="py-1.5 text-sm text-fg-secondary">{c.name}</td>
              <td className="py-1.5 text-right font-mono text-sm tabular-nums text-fg-muted">
                {formatMoney(c.budgeted)}
              </td>
              <td className="py-1.5 text-right font-mono text-sm tabular-nums text-fg">
                {formatMoney(c.actual)}
              </td>
              <td
                className={cn(
                  'py-1.5 text-right font-mono text-sm tabular-nums',
                  diff < 0 ? 'text-danger' : 'text-success',
                )}
              >
                {formatMoney(diff, { signed: true })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

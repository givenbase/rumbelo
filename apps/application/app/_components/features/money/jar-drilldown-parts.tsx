import { cn, formatMoney } from '@rumbelo/utils';

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
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="grid w-full gap-2 rounded-lg px-1.5 py-2.5 text-left transition-colors outline-none hover:bg-raised focus-visible:ring-2 focus-visible:ring-accent/25">
            <span className="flex items-center gap-3 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] sm:gap-3">
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    <span className="grid size-7.5 shrink-0 place-items-center rounded-lg border border-line bg-raised text-sm">
                        {jar.icon}
                    </span>
                    <span className="grid min-w-0 gap-0.5">
                        <span className="truncate text-sm text-fg">{jar.name}</span>
                        <span className="truncate font-mono text-xs tracking-wide text-fg-faint">
                            {jar.subtitle}
                        </span>
                    </span>
                </span>

                <span className="hidden h-2 overflow-hidden rounded-full bg-sunken sm:block">
                    <span
                        className={cn(
                            'block h-full rounded-full transition-all duration-500 ease-out',
                            jar.color
                        )}
                        style={{ width: `${usedPct}%` }}
                    />
                </span>

                <span className="shrink-0 text-right tabular-nums">
                    <div
                        className={cn(
                            'font-mono text-sm',
                            jar.overspent ? 'text-danger' : 'text-fg'
                        )}>
                        {formatMoney(jar.remaining)}
                    </div>
                    <div className="font-mono text-xs text-fg-faint">
                        of {formatMoney(jar.allocated)}
                    </div>
                </span>

                <span
                    className={cn(
                        'shrink-0 text-xs text-fg-faint transition-transform duration-200',
                        open && 'rotate-180'
                    )}>
                    ▾
                </span>
            </span>

            <span className="h-2 overflow-hidden rounded-full bg-sunken sm:hidden">
                <span
                    className={cn(
                        'block h-full rounded-full transition-all duration-500 ease-out',
                        jar.color
                    )}
                    style={{ width: `${usedPct}%` }}
                />
            </span>
        </button>
    );
}

export function JarCategoryTable({ categories }: { categories: JarCategory[] }) {
    if (categories.length === 0) {
        return (
            <p className="border-t border-line py-1.5 text-sm text-fg-faint">No categories yet.</p>
        );
    }

    return (
        <>
            {/* Mobile: stacked cards */}
            <ul className="grid gap-2 border-t border-line pt-2 sm:hidden">
                {categories.map(c => {
                    const diff = c.budgeted - c.actual;
                    return (
                        <li
                            key={c.id}
                            className="grid gap-1.5 rounded-lg border border-line bg-raised px-3 py-2.5">
                            <span className="text-sm text-fg-secondary">{c.name}</span>
                            <span className="flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-xs tabular-nums">
                                <span className="text-fg-muted">
                                    Planned {formatMoney(c.budgeted)}
                                </span>
                                <span className="text-fg">Spent {formatMoney(c.actual)}</span>
                                <span className={diff < 0 ? 'text-danger' : 'text-success'}>
                                    {formatMoney(diff, { signed: true })}
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-0 border-collapse">
                    <thead>
                        <tr className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                            <th className="pb-2 text-left font-medium">Category</th>
                            <th className="w-20 pb-2 text-right font-medium">Planned</th>
                            <th className="w-20 pb-2 text-right font-medium">Spent</th>
                            <th className="w-24 pb-2 text-right font-medium">Over / under</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => {
                            const diff = c.budgeted - c.actual;
                            return (
                                <tr key={c.id} className="border-t border-line">
                                    <td className="py-1.5 text-sm text-fg-secondary">{c.name}</td>
                                    <td className="py-1.5 text-right font-mono text-sm text-fg-muted tabular-nums">
                                        {formatMoney(c.budgeted)}
                                    </td>
                                    <td className="py-1.5 text-right font-mono text-sm text-fg tabular-nums">
                                        {formatMoney(c.actual)}
                                    </td>
                                    <td
                                        className={cn(
                                            'py-1.5 text-right font-mono text-sm tabular-nums',
                                            diff < 0 ? 'text-danger' : 'text-success'
                                        )}>
                                        {formatMoney(diff, { signed: true })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

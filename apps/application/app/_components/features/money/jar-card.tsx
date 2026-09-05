'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn, formatMoney } from '@rumbelo/utils';

import { CREATE_HREF, spendFromJarHref } from '@/app/_lib/create-routes';
import { JAR_GUIDE, type JarGuideKey } from '@/app/_lib/jar-guide';

interface JarCategory {
    id: string;
    name: string;
    budgeted: number;
    actual: number;
}

export interface JarCardModel {
    id: string;
    key: string;
    name: string;
    subtitle: string;
    icon: string;
    /** Tailwind bg-* class from JAR_META */
    color: string;
    percentage: number;
    allocated: number;
    remaining: number;
    spent?: number;
    overspent: boolean;
    categories: JarCategory[];
}

function toCssVar(bgClass: string) {
    return bgClass.replace('bg-', 'var(--color-') + ')';
}

/**
 * Design pot card — Kluis Finance App.dc.html :702-775.
 * Create/move stay on URL sheets (ListToolbar + per-card actions).
 */
export function JarCard({ jar }: { jar: JarCardModel }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const guide = JAR_GUIDE[jar.key as JarGuideKey];
    const accent = toCssVar(jar.color);
    const spent = jar.spent ?? jar.allocated - jar.remaining;
    const usedPct =
        jar.allocated > 0 ? Math.min(100, Math.round((spent / jar.allocated) * 100)) : 0;

    const activity =
        jar.categories.length === 0
            ? 'Nothing booked this month'
            : (() => {
                  const biggest = [...jar.categories].sort((a, b) => b.actual - a.actual)[0];
                  if (!biggest) return 'Nothing booked this month';
                  return `${jar.categories.length} entries · biggest: ${biggest.name} ${formatMoney(biggest.actual)}`;
              })();

    return (
        <div
            className="rounded-2xl border border-t-4 border-line bg-card p-5 shadow-sm"
            style={{ borderTopColor: accent }}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-raised text-base">
                        {jar.icon}
                    </span>
                    <span className="grid min-w-0 gap-1">
                        <span className="font-display text-xl font-semibold tracking-tight text-fg">
                            {jar.name}
                        </span>
                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                            {jar.subtitle}
                        </span>
                    </span>
                </div>
                <span
                    className="rounded-full border border-line bg-raised px-2.5 py-1 font-mono text-sm"
                    style={{ color: accent }}>
                    {jar.percentage}%
                </span>
            </div>

            <div className="mt-4 mb-2.5 flex items-baseline gap-2.5">
                <span
                    className={cn(
                        'font-display text-3xl font-semibold tracking-tight',
                        jar.overspent ? 'text-danger' : 'text-fg'
                    )}>
                    {formatMoney(jar.remaining)}
                </span>
                <span className="font-mono text-xs font-medium text-fg-faint">
                    left of {formatMoney(jar.allocated)}
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-sunken">
                <div
                    className={cn('h-full rounded-full', jar.overspent ? 'bg-danger' : jar.color)}
                    style={{ width: `${jar.overspent ? 100 : usedPct}%` }}
                />
            </div>

            {guide && (
                <p className="mt-3.5 text-sm leading-relaxed text-pretty text-fg-muted">
                    {guide.note}
                </p>
            )}

            <p className="mt-3 font-mono text-xs leading-relaxed font-medium text-fg-faint">
                {activity}
            </p>

            <div className="mt-3.5 flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2.5">
                <span className="size-1.75 shrink-0 rounded-sm" style={{ background: accent }} />
                <span className="truncate font-mono text-xs font-medium text-fg-secondary">
                    No account set yet
                </span>
            </div>

            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="mt-3.5 w-full rounded-full border border-accent/40 bg-accent-soft p-2.5 font-mono text-xs font-medium tracking-wide text-accent uppercase transition-colors hover:bg-accent-soft">
                {open ? 'Hide ▴' : 'What can I use this for? ▾'}
            </button>

            {open && guide && (
                <div className="mt-3.5 grid animate-rise gap-3.5 rounded-xl border border-line bg-raised p-4">
                    <div>
                        <p className="mb-2.5 font-mono text-xs font-medium tracking-widest text-accent uppercase">
                            This may go to
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {guide.allowed.map(label => (
                                <span
                                    key={label}
                                    className="rounded-full border border-line bg-card px-2.5 py-1.5 text-sm text-fg-secondary">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {guide.subs && guide.subs.length > 0 && (
                        <div>
                            <p className="mb-2.5 font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                Split inside this jar
                            </p>
                            <div className="grid gap-2.5">
                                {guide.subs.map(sub => (
                                    <div key={sub.label}>
                                        <div className="mb-1 flex justify-between gap-2.5 font-mono text-xs font-medium">
                                            <span className="text-fg-secondary">{sub.label}</span>
                                            <span className="text-accent">
                                                {formatMoney(
                                                    Math.round((jar.allocated * sub.pct) / 100)
                                                )}{' '}
                                                · {sub.pct}%
                                            </span>
                                        </div>
                                        <div className="h-1.25 overflow-hidden rounded-full bg-sunken">
                                            <div
                                                className="h-full rounded-full bg-accent"
                                                style={{ width: `${sub.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {guide.subNote && (
                                <p className="mt-3 text-sm leading-relaxed text-pretty text-accent">
                                    {guide.subNote}
                                </p>
                            )}
                        </div>
                    )}

                    {jar.categories.length > 0 && (
                        <div>
                            <p className="mb-2.5 font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                This month
                            </p>
                            <div className="grid gap-1.5">
                                {jar.categories.map(c => {
                                    const diff = c.budgeted - c.actual;
                                    return (
                                        <div
                                            key={c.id}
                                            className="flex items-baseline justify-between gap-2 border-t border-line pt-1.5 first:border-t-0 first:pt-0">
                                            <span className="text-sm text-fg-secondary">
                                                {c.name}
                                            </span>
                                            <span
                                                className={cn(
                                                    'font-mono text-sm',
                                                    diff < 0 ? 'text-danger' : 'text-fg-muted'
                                                )}>
                                                {formatMoney(c.actual)} / {formatMoney(c.budgeted)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <p className="border-t border-line pt-3 text-sm leading-relaxed text-pretty text-fg-muted">
                        {guide.notAllowed}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        {guide.links.map(l => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="rounded-full border border-line-strong bg-transparent px-3 py-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={() => router.push(spendFromJarHref(jar.id))}
                    className="flex-1 rounded-full border border-line-strong bg-transparent p-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                    Add a spend
                </button>
                <button
                    type="button"
                    onClick={() => router.push(CREATE_HREF.move)}
                    className="flex-1 rounded-full border border-line-strong bg-transparent p-2 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                    Move money
                </button>
            </div>
        </div>
    );
}

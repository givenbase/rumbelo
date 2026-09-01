'use client';

import type { ReactNode } from 'react';

import { Button } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

const TAB =
    'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-medium tracking-wide uppercase transition-all duration-200';

/**
 * Shared list chrome: context/tabs on the left, primary create on the right.
 * Matches the Transacties toolbar pattern (design + muscle memory).
 */
export function ListToolbar({
    children,
    createLabel = '+ Add',
    onCreate,
    secondary,
}: {
    children?: ReactNode;
    createLabel?: string;
    onCreate: () => void;
    /** Optional actions left of create (e.g. Regels toepassen). */
    secondary?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
            <div className="flex flex-wrap items-center gap-2">
                {secondary}
                <Button size="sm" onClick={onCreate}>
                    {createLabel}
                </Button>
            </div>
        </div>
    );
}

/** Pill tab used inside {@link ListToolbar} — Jars, Transactions, Goals, etc. */
export function ListToolbarTab({
    active,
    onClick,
    children,
    className,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                TAB,
                active
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
                className
            )}>
            {children}
        </button>
    );
}

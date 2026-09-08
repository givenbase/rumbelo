'use client';

import { cn, jarCoverage, usedPctDisplay } from '@rumbelo/utils';

type JarProgressBarProps = {
    allocated: number;
    spent: number;
    committedOut: number;
    credited?: number;
    /** Tailwind bg-* class when not overspent */
    colorClass: string;
    className?: string;
    trackClassName?: string;
};

/** Shared used-progress bar — maths from jarCoverage / usedPctDisplay. */
export function JarProgressBar({
    allocated,
    spent,
    committedOut,
    credited = 0,
    colorClass,
    className,
    trackClassName,
}: JarProgressBarProps) {
    const coverage = jarCoverage({ allocated, spent, credited, committedOut });
    const pct = usedPctDisplay(coverage);

    return (
        <span
            className={cn(
                'h-1.5 overflow-hidden rounded-full bg-sunken',
                trackClassName,
                className
            )}>
            <span
                className={cn(
                    'block h-full rounded-full transition-all duration-500 ease-out',
                    coverage.overspent ? 'bg-danger' : colorClass
                )}
                style={{ width: `${pct}%` }}
            />
        </span>
    );
}

/** Calendar month as year + 1-based month (budget period). */
export type YearMonth = { year: number; month: number };

export type PeriodTravel = {
    /** Signed months from current calendar month: negative = past, positive = future. */
    monthsDelta: number;
    direction: 'current' | 'past' | 'future';
    /** "2 months ago" / "1 year ahead" / "This month" */
    relativeLabel: string;
    /** Approximate whole days from the 1st of the selected month to today. */
    daysApprox: number;
    /** Compact days phrase: "≈ 60 days ago" / "≈ 45 days ahead" / null when current. */
    daysLabel: string | null;
};

export function currentYearMonth(now = new Date()): YearMonth {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/** Months from `a` to `b`: positive if `b` is after `a`. */
export function monthsBetween(a: YearMonth, b: YearMonth): number {
    return (b.year - a.year) * 12 + (b.month - a.month);
}

function formatSpan(absMonths: number, suffix: 'ago' | 'ahead'): string {
    if (absMonths === 1) return `1 month ${suffix}`;
    if (absMonths < 12) return `${absMonths} months ${suffix}`;
    const years = Math.floor(absMonths / 12);
    const rem = absMonths % 12;
    const yearPart = years === 1 ? '1 year' : `${years} years`;
    if (rem === 0) return `${yearPart} ${suffix}`;
    const monthPart = rem === 1 ? '1 month' : `${rem} months`;
    return `${yearPart} ${monthPart} ${suffix}`;
}

/**
 * How far a selected budget period sits from the live calendar month.
 * Used to warn when browsing history or peeking ahead.
 */
export function describePeriodTravel(selected: YearMonth, now = new Date()): PeriodTravel {
    const current = currentYearMonth(now);
    const monthsDelta = monthsBetween(current, selected);
    const selectedStart = new Date(selected.year, selected.month - 1, 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysApprox = Math.round((selectedStart.getTime() - startOfToday.getTime()) / 86_400_000);

    if (monthsDelta === 0) {
        return {
            monthsDelta: 0,
            direction: 'current',
            relativeLabel: 'This month',
            daysApprox: 0,
            daysLabel: null,
        };
    }

    const absM = Math.abs(monthsDelta);
    const absD = Math.abs(daysApprox);
    if (monthsDelta < 0) {
        return {
            monthsDelta,
            direction: 'past',
            relativeLabel: formatSpan(absM, 'ago'),
            daysApprox,
            daysLabel: absD === 0 ? null : `≈ ${absD} day${absD === 1 ? '' : 's'} ago`,
        };
    }

    return {
        monthsDelta,
        direction: 'future',
        relativeLabel: formatSpan(absM, 'ahead'),
        daysApprox,
        daysLabel: absD === 0 ? null : `≈ ${absD} day${absD === 1 ? '' : 's'} ahead`,
    };
}

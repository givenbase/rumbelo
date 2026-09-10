/**
 * Money is carried as integer minor units everywhere. These helpers are the only
 * place it becomes a string or major units, so rounding happens once and consistently.
 */

/**
 * Major currency units (e.g. euros) → integer minor units (cents).
 * Use at authoring boundaries (seeds, form parsers) — never for ongoing math.
 */
export function toMinorUnits(major: number): number {
    return Math.round(major * 100);
}

/** Integer minor units → major currency units (display / rare exports). */
export function fromMinorUnits(minor: number): number {
    return minor / 100;
}

export function formatMoney(
    minorUnits: number,
    {
        currency = 'EUR',
        locale = 'en-IE',
        signed = false,
    }: {
        currency?: string;
        locale?: string;
        signed?: boolean;
    } = {}
): string {
    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(fromMinorUnits(minorUnits));
    return signed && minorUnits > 0 ? `+${formatted}` : formatted;
}

export function formatPercent(value: number, locale = 'en-IE'): string {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value) + '%';
}

export function formatPeriod(period: string, locale = 'en-IE'): string {
    const [year, month] = period.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, 1))
    );
}

export function currentPeriod(date = new Date()): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

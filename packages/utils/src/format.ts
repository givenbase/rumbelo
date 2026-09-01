/**
 * Money is carried as integer minor units everywhere. These helpers are the only
 * place it becomes a string, so rounding happens once and consistently.
 */
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
    }).format(minorUnits / 100);
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

export function currentPeriod(d = new Date()): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

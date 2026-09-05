/**
 * Period and week keys. Defined once here because the turn engine, the ritual
 * engine and every dashboard query must agree on what "this month" means.
 */

/** Budget period key, YYYY-MM. One period is one Monopoly turn. */
export function currentPeriod(date = new Date()): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function previousPeriod(period: string): string {
    const [year, month] = period.split('-').map(Number) as [number, number];
    return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
}

export function daysInPeriod(period: string): number {
    const [year, month] = period.split('-').map(Number) as [number, number];
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** ISO week key, YYYY-Www. The unit of the weekly ritual. */
export function currentWeek(date = new Date()): string {
    const thursday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = thursday.getUTCDay() || 7;
    thursday.setUTCDate(thursday.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
    return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

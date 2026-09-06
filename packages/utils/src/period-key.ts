/** `YYYY-MM` period key for oRPC contracts. */
export function toPeriodKey(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}

/** ISO week key `YYYY-Www` (Monday-based, UTC). */
export function currentWeekKey(date = new Date()): string {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

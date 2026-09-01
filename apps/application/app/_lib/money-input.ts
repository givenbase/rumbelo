'use client';

/**
 * Parse a user-entered euro amount ("12,50" / "12.50") into integer cents.
 * Returns null when the string is empty or not a finite number.
 */
export function parseEurosToCents(raw: string): number | null {
    const trimmed = raw.trim().replace(/\s/g, '').replace(',', '.');
    if (!trimmed) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100);
}

/** Format cents for form inputs (Dutch decimal comma when needed). */
export function centsToEurosInput(cents: number): string {
    const euros = cents / 100;
    if (Number.isInteger(euros)) return String(euros);
    return euros.toFixed(2).replace('.', ',');
}

/** Today's date as YYYY-MM-DD for IsoDate fields. */
export function todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

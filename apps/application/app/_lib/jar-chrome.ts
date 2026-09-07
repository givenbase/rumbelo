/** Tailwind bg-* jar color → CSS variable for inline accents. */
export function bgClassToCssVar(bgClass: string): string {
    return bgClass.replace('bg-', 'var(--color-') + ')';
}

/** Human labels for Cadence enum members (UI copy). */
export const CADENCE_LABEL: Record<string, string> = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    YEARLY: 'Yearly',
    ONCE: 'Once',
};

export function cadenceLabel(cadence: string): string {
    return CADENCE_LABEL[cadence] ?? cadence;
}

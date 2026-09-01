/** Soul-domain fixtures: stillness + gratitude. */

/** Soul/stillness — minutes per day + streak. */
export const mockMind = { minutesPerDay: 10, streak: 4 } as const;

/** Flat gratitude entries, newest first. */
export const mockGratitude = [
    { id: 'gr1', text: 'Enough to share', day: 'Mon' },
    { id: 'gr2', text: 'An evening without doing the math', day: 'Tue' },
    { id: 'gr3', text: 'Rent paid without thinking twice', day: 'Wed' },
    { id: 'gr4', text: 'Coffee with my sister', day: 'Thu' },
] as const;

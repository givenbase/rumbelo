/** Soul-domain fixtures: stillness + gratitude. */

/** Soul/stillness — minutes per day + streak. */
export const mockMind = { minutesPerDay: 10, streak: 4 } as const;

/** Flat gratitude entries, newest first. */
export const mockGratitude = [
  { id: 'gr1', text: 'Genoeg om van te delen', day: 'Ma' },
  { id: 'gr2', text: 'Een avond zonder rekenen', day: 'Di' },
  { id: 'gr3', text: 'Huur betaald zonder eraan te denken', day: 'Wo' },
  { id: 'gr4', text: 'Koffie met mijn zus', day: 'Do' },
] as const;

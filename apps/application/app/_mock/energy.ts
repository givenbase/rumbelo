/** Energy-domain fixtures: sleep, train, food, week meters. */

export const mockEnergy = [
    { metric: 'SLEEP', label: 'Sleep', value: 78, trend: 'UP', icon: '🌙' },
    { metric: 'TRAIN', label: 'Training', value: 62, trend: 'FLAT', icon: '💪' },
    { metric: 'FOOD', label: 'Food', value: 55, trend: 'DOWN', icon: '🥗' },
] as const;

/** Default sleep hours used by the static sleep screen. */
export const SLEEP_HOURS = 8;

/**
 * Sleep-stage breakdown derived from SLEEP_HOURS.
 * delta = slow-wave (deep), rem = dream sleep, light = remainder.
 * Formulas match the design's JS (Kluis Finance App.dc.html:3915-3918).
 */
export const mockSleepStages = (() => {
    const h = SLEEP_HOURS;
    const delta = Math.min(1.7, h * 0.25);
    const rem = Math.max(0, (h - 3) * 0.34);
    const light = Math.max(0, h - delta - rem);
    const hr = (v: number) => `${(Math.round(v * 10) / 10).toString()}h`;
    return [
        {
            name: 'Deep sleep',
            does: 'restores your body',
            band: 'delta · 0.5–4 Hz',
            hours: hr(delta),
            w: (delta / h) * 100,
            color: 'var(--color-jar-lts)',
        },
        {
            name: 'Light sleep',
            does: 'the path there, where movement is learned',
            band: 'theta · 4–8 Hz',
            hours: hr(light),
            w: (light / h) * 100,
            color: 'var(--color-sunken)',
        },
        {
            name: 'REM sleep',
            does: 'sharpens you — mood and memory',
            band: 'REM · theta + sawtooth',
            hours: hr(rem),
            w: (rem / h) * 100,
            color: 'var(--color-jar-play)',
        },
    ] as const;
})();

export const SESSION_COLORS: Record<string, string> = {
    STRENGTH: 'var(--color-jar-ff)',
    RUNNING: 'var(--color-jar-lts)',
    MOBILITY: 'var(--color-jar-edu)',
    YOGA: 'var(--color-portal-soul)',
};

export const mockSessions = [
    { id: 's1', kind: 'STRENGTH', name: 'Upper body', meta: '45 min · yesterday', done: true },
    { id: 's2', kind: 'RUNNING', name: '8 km intervals', meta: '52 min · 2 days ago', done: true },
    { id: 's3', kind: 'STRENGTH', name: 'Lower body', meta: '40 min · 4 days ago', done: false },
    { id: 's4', kind: 'MOBILITY', name: 'Back & stretch', meta: '20 min · 5 days ago', done: true },
] satisfies { id: string; kind: string; name: string; meta: string; done: boolean }[];

/** kg body-weight → protein/calorie targets. Design formulas: dc.html:3871, 3880. */
export const mockFood = { weightKg: 80, protToday: 96, kcalToday: 1_850 } as const;

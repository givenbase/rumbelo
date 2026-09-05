import {
    INCOME_POSTURE_KEYS,
    MoneyCharacter,
    WEALTH_STAGE_KEYS,
    type GrowthLeverPreset,
} from '@rumbelo/contracts';

/**
 * Canonical growth lever catalog — Rumbelo-owned methods (not third-party frameworks).
 * Loaded into backoffice.reference_growth_lever_preset.
 * Tags use posture / stage catalog keys (scalable — not Postgres enums).
 */
export const LEVER_PRESET_SEED: readonly (Omit<
    GrowthLeverPreset,
    'sortOrder' | 'minStageSortOrder'
> & {
    sortOrder?: number;
})[] = [
    {
        key: 'RAISE_RATE',
        name: 'Raise your rate',
        summary:
            'Every €100 more per day is €2,000 extra per month. One conversation can do it.',
        accentColor: 'var(--color-accent)',
        forPostureKeys: [INCOME_POSTURE_KEYS.SKILL_TRADE, INCOME_POSTURE_KEYS.TIME_TRADE],
        forCharacters: [],
        minStageKey: WEALTH_STAGE_KEYS.BUILDING,
    },
    {
        key: 'ADD_SERVICE',
        name: 'Add a service',
        summary:
            'A second product or service has zero fixed costs once the first is running.',
        accentColor: 'var(--color-jar-lts)',
        forPostureKeys: [INCOME_POSTURE_KEYS.SKILL_TRADE, INCOME_POSTURE_KEYS.SYSTEM],
        forCharacters: [],
        minStageKey: WEALTH_STAGE_KEYS.BUILDING,
    },
    {
        key: 'BUILD_PASSIVE',
        name: 'Build asset income',
        summary: 'Something made once that keeps working. Starts small, never zero.',
        accentColor: 'var(--color-jar-ff)',
        forPostureKeys: [INCOME_POSTURE_KEYS.ASSETS, INCOME_POSTURE_KEYS.SYSTEM],
        forCharacters: [MoneyCharacter.SAVER, MoneyCharacter.BALANCED],
        minStageKey: WEALTH_STAGE_KEYS.SECURE,
    },
    {
        key: 'ACTIVATE_NETWORK',
        name: 'Activate your network',
        summary:
            'Revenue from people costs no marketing. Every happy client is a channel.',
        accentColor: 'var(--color-jar-edu)',
        forPostureKeys: [
            INCOME_POSTURE_KEYS.SKILL_TRADE,
            INCOME_POSTURE_KEYS.SYSTEM,
            INCOME_POSTURE_KEYS.TIME_TRADE,
        ],
        forCharacters: [],
        minStageKey: WEALTH_STAGE_KEYS.BUILDING,
    },
    {
        key: 'CUT_TIME_COST',
        name: 'Buy back your hours',
        summary:
            'Automate or delegate one recurring task. Freed hours compound into earning capacity.',
        accentColor: 'var(--color-jar-nec)',
        forPostureKeys: [INCOME_POSTURE_KEYS.TIME_TRADE, INCOME_POSTURE_KEYS.SKILL_TRADE],
        forCharacters: [MoneyCharacter.SPENDER, MoneyCharacter.BALANCED],
        minStageKey: WEALTH_STAGE_KEYS.BUILDING,
    },
    {
        key: 'SCALE_SYSTEM',
        name: 'Scale what already works',
        summary:
            'Document the offer that sells. Repeatability beats one more custom project.',
        accentColor: 'var(--color-accent)',
        forPostureKeys: [INCOME_POSTURE_KEYS.SYSTEM, INCOME_POSTURE_KEYS.SKILL_TRADE],
        forCharacters: [],
        minStageKey: WEALTH_STAGE_KEYS.SECURE,
    },
] as const;

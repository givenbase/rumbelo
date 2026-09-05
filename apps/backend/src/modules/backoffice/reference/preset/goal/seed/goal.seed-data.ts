import { JarKey } from '@rumbelo/contracts';

export const GOAL_PRESET_SEED = [
    {
        key: 'EMERGENCY_FUND',
        name: 'Emergency fund',
        jarKey: JarKey.LONG_TERM_SAVINGS,
        categoryTemplateKey: 'EMERGENCY_FUND',
        icon: '🛟',
    },
    {
        key: 'HOME',
        name: 'A place of my own',
        jarKey: JarKey.LONG_TERM_SAVINGS,
        categoryTemplateKey: 'HOME_DEPOSIT',
        icon: '🏠',
    },
    {
        key: 'CAR',
        name: 'Car fund',
        jarKey: JarKey.LONG_TERM_SAVINGS,
        categoryTemplateKey: 'BIG_PURCHASES',
        icon: '🚗',
    },
    {
        key: 'SABBATICAL',
        name: 'Sabbatical',
        jarKey: JarKey.LONG_TERM_SAVINGS,
        categoryTemplateKey: 'BIG_PURCHASES',
        icon: '✈️',
    },
    {
        key: 'EDUCATION_FUND',
        name: 'Education fund',
        jarKey: JarKey.EDUCATION,
        categoryTemplateKey: 'COURSES',
        icon: '📚',
    },
] as const;

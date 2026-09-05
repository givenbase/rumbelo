import { JarKey } from '@rumbelo/contracts';

/**
 * Canonical jar catalog seed data — Rumbelo-owned defaults.
 * Loaded into backoffice.reference_jar_template by JarTemplateSeeder.
 */
export const JAR_TEMPLATE_SEED = [
    {
        key: JarKey.NECESSITIES,
        name: 'Necessity',
        subtitle: 'Must-pays',
        icon: '🏠',
        defaultPercentage: '55.00',
        isSpendable: true,
    },
    {
        key: JarKey.FINANCIAL_FREEDOM,
        name: 'Financial Freedom',
        subtitle: 'Never spend',
        icon: '🔒',
        defaultPercentage: '10.00',
        isSpendable: false,
    },
    {
        key: JarKey.LONG_TERM_SAVINGS,
        name: 'Long Term Savings',
        subtitle: 'Big things',
        icon: '🎯',
        defaultPercentage: '10.00',
        isSpendable: true,
    },
    {
        key: JarKey.EDUCATION,
        name: 'Education',
        subtitle: 'Grow yourself',
        icon: '📚',
        defaultPercentage: '10.00',
        isSpendable: true,
    },
    {
        key: JarKey.PLAY,
        name: 'Play',
        subtitle: 'Guilt-free',
        icon: '✨',
        defaultPercentage: '10.00',
        isSpendable: true,
    },
    {
        key: JarKey.GIVE,
        name: 'Give / foundation',
        subtitle: 'Pass it on',
        icon: '🤲',
        defaultPercentage: '5.00',
        isSpendable: true,
    },
] as const;

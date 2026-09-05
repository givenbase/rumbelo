import { JarKey, JAR_CAPABILITIES } from '@rumbelo/contracts';

/**
 * Canonical jar catalog seed data — Rumbelo-owned defaults.
 * Loaded into backoffice.reference_money_jar_template by JarTemplateSeeder.
 * Capabilities mirror contracts JAR_CAPABILITIES.
 */
export const JAR_TEMPLATE_SEED = [
    {
        key: JarKey.NECESSITIES,
        name: 'Necessity',
        subtitle: 'Must-pays',
        icon: '🏠',
        defaultPercentage: '55.00',
        capabilities: JAR_CAPABILITIES[JarKey.NECESSITIES],
    },
    {
        key: JarKey.FINANCIAL_FREEDOM,
        name: 'Financial Freedom',
        subtitle: 'Never spend',
        icon: '🔒',
        defaultPercentage: '10.00',
        capabilities: JAR_CAPABILITIES[JarKey.FINANCIAL_FREEDOM],
    },
    {
        key: JarKey.LONG_TERM_SAVINGS,
        name: 'Long Term Savings',
        subtitle: 'Big things',
        icon: '🎯',
        defaultPercentage: '10.00',
        capabilities: JAR_CAPABILITIES[JarKey.LONG_TERM_SAVINGS],
    },
    {
        key: JarKey.EDUCATION,
        name: 'Education',
        subtitle: 'Grow yourself',
        icon: '📚',
        defaultPercentage: '10.00',
        capabilities: JAR_CAPABILITIES[JarKey.EDUCATION],
    },
    {
        key: JarKey.PLAY,
        name: 'Play',
        subtitle: 'Guilt-free',
        icon: '✨',
        defaultPercentage: '10.00',
        capabilities: JAR_CAPABILITIES[JarKey.PLAY],
    },
    {
        key: JarKey.GIVE,
        name: 'Give / foundation',
        subtitle: 'Pass it on',
        icon: '🤲',
        defaultPercentage: '5.00',
        capabilities: JAR_CAPABILITIES[JarKey.GIVE],
    },
] as const;

import { DEFAULT_JAR_SPLIT, JarKey } from '@rumbelo/contracts';

/** Jar catalogue — names, icons, colors. Default % from contracts DEFAULT_JAR_SPLIT. */

export const JAR_META = [
    {
        key: JarKey.NECESSITIES,
        name: 'Necessity',
        subtitle: 'Must-pays',
        icon: '🏠',
        pct: DEFAULT_JAR_SPLIT[JarKey.NECESSITIES],
        color: 'bg-jar-nec',
        text: 'text-jar-nec',
    },
    {
        key: JarKey.FINANCIAL_FREEDOM,
        name: 'Financial Freedom',
        subtitle: 'Never spend',
        icon: '🔒',
        pct: DEFAULT_JAR_SPLIT[JarKey.FINANCIAL_FREEDOM],
        color: 'bg-jar-ff',
        text: 'text-jar-ff',
    },
    {
        key: JarKey.LONG_TERM_SAVINGS,
        name: 'Long Term Savings',
        subtitle: 'Big things',
        icon: '🎯',
        pct: DEFAULT_JAR_SPLIT[JarKey.LONG_TERM_SAVINGS],
        color: 'bg-jar-lts',
        text: 'text-jar-lts',
    },
    {
        key: JarKey.EDUCATION,
        name: 'Education',
        subtitle: 'Grow yourself',
        icon: '📚',
        pct: DEFAULT_JAR_SPLIT[JarKey.EDUCATION],
        color: 'bg-jar-edu',
        text: 'text-jar-edu',
    },
    {
        key: JarKey.PLAY,
        name: 'Play',
        subtitle: 'Guilt-free',
        icon: '✨',
        pct: DEFAULT_JAR_SPLIT[JarKey.PLAY],
        color: 'bg-jar-play',
        text: 'text-jar-play',
    },
    {
        key: JarKey.GIVE,
        name: 'Give / foundation',
        subtitle: 'Pass it on',
        icon: '🤲',
        pct: DEFAULT_JAR_SPLIT[JarKey.GIVE],
        color: 'bg-jar-give',
        text: 'text-jar-give',
    },
] as const;

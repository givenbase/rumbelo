/**
 * Portal overview chrome — titles, routes, colors.
 * Live card values come from each product's dashboard API (see portal-hub clients).
 */
import type { PortalHubProps } from '@/components/features/home/portal-hub';

type PortalShell = Omit<PortalHubProps, 'coach' | 'cards'> & {
    fallbackCoach: PortalHubProps['coach'];
};

export const moneyPortalShell: PortalShell = {
    tint: 'var(--color-jar-give)',
    icon: '◈',
    eyebrow: 'Money · this month',
    title: 'How your money moves.',
    line: 'Four places, one question each. Pick up where you left off.',
    fallbackCoach: {
        dot: 'var(--color-accent)',
        kind: 'START HERE',
        text: 'Add income and fixed costs first — then your jars show what is left to steer.',
        cta: 'Open jars',
        href: '/product/money/jars',
    },
};

export const growthPortalShell: PortalShell = {
    tint: 'var(--color-jar-lts)',
    icon: '↗',
    eyebrow: 'Growth · long term',
    title: 'Where your money stands.',
    line: 'What you aim for, what you earn, what you learn, what you own.',
    fallbackCoach: {
        dot: 'var(--color-accent)',
        kind: 'THE LEVER',
        text: 'Cutting costs has a floor; raising income does not. Income is the faster lever.',
        cta: 'Open income',
        href: '/product/growth/income',
    },
};

export const energyPortalShell: PortalShell = {
    tint: 'var(--color-jar-play)',
    icon: '✳\uFE0E',
    eyebrow: 'Energy · your capacity',
    title: 'The floor under every decision.',
    line: 'Hours, sleep, training, food. What makes the money decisions possible.',
    fallbackCoach: {
        dot: 'var(--color-accent)',
        kind: 'THIS WEEK',
        text: 'Log sleep and training — energy is the floor under every money decision.',
        cta: 'Open your week',
        href: '/product/energy/week',
    },
};

export const soulPortalShell: PortalShell = {
    tint: 'var(--color-portal-soul)',
    icon: '✦',
    eyebrow: 'Soul · the why',
    title: 'The why under the numbers.',
    line: 'Without this, steering is just bookkeeping.',
    fallbackCoach: {
        dot: 'var(--color-accent)',
        kind: 'START SMALL',
        text: 'One minute of stillness or one line of gratitude — both protect the jars.',
        cta: 'Open stillness',
        href: '/product/soul/stillness',
    },
};

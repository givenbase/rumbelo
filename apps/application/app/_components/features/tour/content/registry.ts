import { moneyPath, growthPath, productPath } from '@/app/_lib/routes';

import type { FullTourChapter, HelpSectionCopy, PageHelpContent } from '../types';
import { FIXED_TOUR_STEPS, INCOME_TOUR_STEPS, JARS_TOUR_STEPS, SHELL_TOUR_STEPS } from './chapters';
import { pages } from './copy';

function sectionsFrom(map: Record<string, HelpSectionCopy>): PageHelpContent['sections'] {
    return Object.values(map).map(({ heading, body }) => ({ heading, body }));
}

/**
 * Ordered chapters for the post-onboarding “full tour”.
 * Shell runs on Jars so Period + Help chrome is mounted.
 */
export const FULL_TOUR_CHAPTERS: FullTourChapter[] = [
    { id: 'shell', href: moneyPath('jars'), steps: SHELL_TOUR_STEPS },
    { id: 'jars', href: moneyPath('jars'), steps: JARS_TOUR_STEPS },
    { id: 'fixed', href: moneyPath('fixed-costs'), steps: FIXED_TOUR_STEPS },
    { id: 'income', href: growthPath('income'), steps: INCOME_TOUR_STEPS },
];

type HelpRoute = {
    prefix: string;
    /** When true, only the exact path matches (not children). */
    exact?: boolean;
    content: PageHelpContent;
};

const HELP_BY_PREFIX: HelpRoute[] = [
    {
        prefix: growthPath('income'),
        content: {
            title: pages.income.title,
            sections: sectionsFrom(pages.income.sections),
            tourId: 'income',
            tourSteps: INCOME_TOUR_STEPS,
        },
    },
    {
        prefix: moneyPath('fixed-costs'),
        content: {
            title: pages.fixed.title,
            sections: sectionsFrom(pages.fixed.sections),
            tourId: 'fixed',
            tourSteps: FIXED_TOUR_STEPS,
        },
    },
    {
        prefix: moneyPath('jars'),
        content: {
            title: pages.jars.title,
            sections: sectionsFrom(pages.jars.sections),
            tourId: 'jars',
            tourSteps: JARS_TOUR_STEPS,
        },
    },
    {
        prefix: moneyPath('transactions'),
        content: {
            title: pages.transactions.title,
            sections: sectionsFrom(pages.transactions.sections),
        },
    },
    {
        prefix: moneyPath('debt'),
        content: {
            title: pages.debt.title,
            sections: sectionsFrom(pages.debt.sections),
        },
    },
    {
        prefix: moneyPath(),
        exact: true,
        content: {
            title: pages.overview.title,
            sections: sectionsFrom(pages.overview.sections),
        },
    },
    {
        prefix: growthPath('goals'),
        content: {
            title: pages.goals.title,
            sections: sectionsFrom(pages.goals.sections),
        },
    },
    {
        prefix: productPath('growth'),
        content: {
            title: pages.growth.title,
            sections: sectionsFrom(pages.growth.sections),
        },
    },
];

const FALLBACK: PageHelpContent = {
    title: pages.fallback.title,
    sections: sectionsFrom(pages.fallback.sections),
};

/** Strip locale prefix for comparing chapter hrefs. */
export function pathWithoutLocale(pathname: string): string {
    return pathname.replace(/^\/[a-z]{2}(?=\/)/, '') || pathname;
}

function pathMatches(path: string, entry: HelpRoute): boolean {
    if (entry.exact) return path === entry.prefix;
    return path === entry.prefix || path.startsWith(`${entry.prefix}/`);
}

/** Longest matching prefix wins so `/product/growth/income` beats `/product/growth`. */
export function pageHelpForPathname(pathname: string): PageHelpContent {
    const path = pathWithoutLocale(pathname);
    let best: PageHelpContent | null = null;
    let bestLen = -1;
    for (const entry of HELP_BY_PREFIX) {
        if (!pathMatches(path, entry)) continue;
        if (entry.prefix.length > bestLen) {
            best = entry.content;
            bestLen = entry.prefix.length;
        }
    }
    return best ?? FALLBACK;
}

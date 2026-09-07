/**
 * Tour / Help types.
 * Copy keys live under `content/copy` — later hoist to `@rumbelo/i18n` (`features.tour.*`).
 */

export type PageHelpSection = {
    heading: string;
    body: string;
};

/** Spotlight step — `target` is a CSS selector (prefer `[data-tour="…"]`). */
export type PageTourStep = {
    target: string;
    title: string;
    content: string;
};

/** Stable id for progress tracking (localStorage). */
export type PageTourId = 'shell' | 'income' | 'fixed' | 'jars';

export type PageHelpContent = {
    title: string;
    sections: PageHelpSection[];
    tourId?: PageTourId;
    tourSteps?: PageTourStep[];
};

export type FullTourChapter = {
    id: PageTourId;
    href: string;
    steps: PageTourStep[];
};

export type HelpSectionCopy = {
    heading: string;
    body: string;
};

export type TourStepCopy = {
    title: string;
    content: string;
};

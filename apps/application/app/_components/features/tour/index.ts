/**
 * Help + Joyride tour feature.
 *
 * Layout:
 * - `content/copy/` — English strings keyed for later `@rumtelo/i18n` (`features.tour.*`)
 * - `content/` — path registry + chapter targets
 * - UI: help sheet, offer dialog, provider
 */
export { PageHelpButton } from './help-button';
export { TourOfferDialog } from './offer-dialog';
export { PageTourProvider, usePageTour } from './provider';
export { FULL_TOUR_CHAPTERS, pageHelpForPathname, pathWithoutLocale, chrome } from './content';
export type {
    FullTourChapter,
    PageHelpContent,
    PageHelpSection,
    PageTourId,
    PageTourStep,
} from './types';

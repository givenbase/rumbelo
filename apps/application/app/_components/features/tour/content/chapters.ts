import type { PageTourStep, TourStepCopy } from '../types';
import { pages } from './copy';

function step(target: string, copy: TourStepCopy): PageTourStep {
    return { target, title: copy.title, content: copy.content };
}

export const SHELL_TOUR_STEPS: PageTourStep[] = [
    step('[data-tour="shell-brand"]', pages.shell.steps.brand),
    step('[data-tour="shell-period"]', pages.shell.steps.period),
    step('[data-tour="shell-help"]', pages.shell.steps.help),
];

export const INCOME_TOUR_STEPS: PageTourStep[] = [
    step('[data-tour="income-summary"]', pages.income.steps.summary),
    step('[data-tour="income-jars"]', pages.income.steps.jars),
    step('[data-tour="income-sources"]', pages.income.steps.sources),
];

export const FIXED_TOUR_STEPS: PageTourStep[] = [
    step('[data-tour="fixed-tabs"]', pages.fixed.steps.tabs),
    step('[data-tour="fixed-list"]', pages.fixed.steps.list),
];

export const JARS_TOUR_STEPS: PageTourStep[] = [
    step('[data-tour="jars-tabs"]', pages.jars.steps.tabs),
    step('[data-tour="jars-list"]', pages.jars.steps.list),
];

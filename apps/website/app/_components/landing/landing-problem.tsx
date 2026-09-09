import { PROBLEM, PROBLEM_CARDS } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';
import { CARD, SectionHeading } from './landing-primitives';

/** Name the problem before the product — research-backed, never blaming. */
export function LandingProblem() {
    return (
        <section id="problem" className="border-t border-line bg-bg-app">
            <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                    <SectionHeading
                        eyebrow={PROBLEM.eyebrow}
                        headline={PROBLEM.headline}
                        lead={PROBLEM.lead}
                        headlineClassName="max-w-md"
                    />

                    <div className="grid gap-3.5 sm:grid-cols-2">
                        {PROBLEM_CARDS.map(card => (
                            <div key={card.head} className={`${CARD} grid content-start gap-3 p-5`}>
                                <span className="grid size-10 place-items-center rounded-lg border border-line bg-raised text-accent">
                                    <LandingIcon name={card.icon} size={19} />
                                </span>
                                <span className="font-display text-lg font-semibold tracking-tight text-fg">
                                    {card.head}
                                </span>
                                <span className="text-sm leading-relaxed text-pretty text-fg-muted">
                                    {card.line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-5 shadow-glow sm:flex-row sm:items-center sm:justify-between lg:px-7">
                    <p className="max-w-2xl font-display text-xl leading-snug font-semibold tracking-tight text-balance text-fg lg:text-2xl">
                        {PROBLEM.kicker}
                    </p>
                    <span className="max-w-xs text-xs leading-relaxed text-fg-faint sm:text-right">
                        {PROBLEM.sources}
                    </span>
                </div>
            </div>
        </section>
    );
}

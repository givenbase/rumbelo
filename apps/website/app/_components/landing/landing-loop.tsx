import { LOOP, LOOP_SECTION } from '@/lib/landing-content';

import { CARD, SectionHeading } from './landing-primitives';

/** The product loop, in order — you do the small part, Rumtelo does the arithmetic. */
export function LandingLoop() {
    return (
        <section id="loop" className="border-t border-line bg-bg-app">
            <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
                <SectionHeading
                    eyebrow={LOOP_SECTION.eyebrow}
                    headline={LOOP_SECTION.headline}
                    lead={LOOP_SECTION.lead}
                    headlineClassName="max-w-2xl"
                    className="mb-10"
                />

                <ol className="grid gap-0">
                    {LOOP.map((step, index) => {
                        const isFirst = index === 0;
                        const isLast = index === LOOP.length - 1;
                        return (
                            <li
                                key={step.step}
                                className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 lg:gap-6">
                                {/* Step indicator */}
                                <div className="grid grid-rows-[auto_1fr] justify-items-center gap-1.5">
                                    <span
                                        className={`grid size-11 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold ${
                                            isFirst
                                                ? 'bg-(image:--gradient-accent) text-on-accent shadow-glow'
                                                : 'border border-accent/35 bg-surface text-accent'
                                        }`}>
                                        {step.step}
                                    </span>
                                    {!isLast && <span className="w-px bg-line-strong" />}
                                </div>

                                {/* Card */}
                                <div className={`min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
                                    <div className={`${CARD} grid gap-3.5 p-5 lg:p-6`}>
                                        <span className="flex flex-wrap items-baseline justify-between gap-2.5">
                                            <span className="font-display text-xl font-semibold tracking-tight text-fg lg:text-2xl">
                                                {step.title}
                                            </span>
                                            <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                                {step.tag}
                                            </span>
                                        </span>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <span className="grid min-w-0 gap-1">
                                                <span className="font-mono text-xs font-semibold tracking-widest text-fg-faint uppercase">
                                                    You do
                                                </span>
                                                <span className="text-sm leading-relaxed text-pretty text-fg-secondary">
                                                    {step.you}
                                                </span>
                                            </span>
                                            <span className="grid min-w-0 gap-1">
                                                <span className="font-mono text-xs font-semibold tracking-widest text-accent uppercase">
                                                    Rumtelo does
                                                </span>
                                                <span className="text-sm leading-relaxed text-pretty text-fg-secondary">
                                                    {step.rumtelo}
                                                </span>
                                            </span>
                                        </div>

                                        <span className="rounded-lg bg-accent-soft px-3.5 py-3 font-mono text-xs leading-loose font-medium tracking-normal wrap-break-word text-accent">
                                            {step.math}
                                        </span>
                                        <span className="text-sm leading-relaxed text-pretty text-fg-faint">
                                            {step.why}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

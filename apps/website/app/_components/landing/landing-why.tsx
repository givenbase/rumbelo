import { ROADMAP, WHY } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';
import { CARD, Eyebrow } from './landing-primitives';

/** Why we exist — built for ourselves first — and where it goes next. */
export function LandingWhy() {
    return (
        <section id="why" className="border-y border-line bg-bg-app">
            <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                    <div className="min-w-0">
                        <Eyebrow>{WHY.eyebrow}</Eyebrow>
                        <blockquote className="mt-4">
                            <p className="max-w-2xl font-display text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-fg lg:text-4xl">
                                {WHY.quoteNl}
                            </p>
                            <p className="mt-2 font-mono text-xs font-medium tracking-wide text-fg-faint">
                                {WHY.quoteEn}
                            </p>
                        </blockquote>
                        <p className="mt-6 max-w-prose text-base leading-relaxed text-pretty text-fg-muted lg:text-lg">
                            {WHY.body}
                        </p>
                        <p className="mt-5 font-mono text-xs font-medium tracking-wide text-fg-faint">
                            {WHY.signature}
                        </p>

                        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-6">
                            <span className="font-display text-xl font-semibold tracking-tight text-fg">
                                {WHY.manifesto}
                            </span>
                            <span className="text-sm text-fg-muted">{WHY.audience}</span>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                            Where it goes next
                        </span>
                        <ul className="mt-3 grid gap-3">
                            {ROADMAP.map(item => (
                                <li
                                    key={item.head}
                                    className={`${CARD} flex items-start gap-3.5 p-4`}>
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                                        <LandingIcon name={item.icon} size={17} />
                                    </span>
                                    <span className="grid min-w-0 gap-0.5">
                                        <span className="text-sm font-semibold text-fg-strong">
                                            {item.head}
                                        </span>
                                        <span className="text-xs leading-relaxed text-fg-muted">
                                            {item.line}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-3 text-xs leading-relaxed text-fg-faint">
                            The system is the aspirant’s. The Coach is the mentor. Rumtelo’s job is
                            to guide — and to get out of the way.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

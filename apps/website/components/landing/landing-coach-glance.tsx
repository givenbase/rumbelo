import { COACH_GLANCE_POINTS } from '../../lib/landing-content';

export function LandingCoachGlance() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
            <div className="flex flex-col items-stretch gap-6 md:flex-row md:flex-wrap md:items-center lg:gap-12">
                {/* Text */}
                <div className="min-w-0 flex-1 md:basis-72">
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ ONE GLANCE, EVERY MORNING
                    </span>
                    <h2 className="my-3.5 max-w-sm font-display text-3xl font-semibold tracking-tight lg:text-4xl">
                        Your coach speaks first. Then three numbers.
                    </h2>
                    <p className="mb-5 max-w-prose text-base leading-relaxed text-fg-muted">
                        The overview opens with your coach: one sentence on where you stand and one
                        thing to do. Under it, one number per portal — kept from your income, what
                        your assets pay you, sleep per night. Everything else is one tap deeper, in
                        plain words a sixteen-year-old understands.
                    </p>
                    <div className="grid gap-2.5">
                        {COACH_GLANCE_POINTS.map(point => (
                            <span key={point} className="flex items-baseline gap-2.5">
                                <span className="shrink-0 font-mono text-xs text-accent">✦</span>
                                <span className="text-sm leading-relaxed text-fg-secondary">
                                    {point}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Screenshot placeholder */}
                <div className="w-full min-w-0 flex-1 md:basis-96">
                    <div
                        className="w-full overflow-hidden rounded-2xl border border-line"
                        style={{ boxShadow: 'var(--shadow-lg)', aspectRatio: '16 / 10' }}>
                        <div className="flex h-full items-center justify-center bg-bg-app px-4">
                            <span className="text-center font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                App screenshot · coming soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { SOCIAL_PROOF } from '@/lib/landing-content';

import { SectionHeading } from './landing-primitives';

/** Soft proof — founders use it; no fake testimonials. */
export function LandingProof() {
    return (
        <section id="proof" className="border-t border-line bg-bg-app">
            <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
                <SectionHeading
                    eyebrow={SOCIAL_PROOF.eyebrow}
                    headline={SOCIAL_PROOF.headline}
                    lead={SOCIAL_PROOF.lead}
                    headlineClassName="max-w-xl"
                    className="mb-8"
                />
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                    {SOCIAL_PROOF.points.map(point => (
                        <div
                            key={point.label}
                            className="grid gap-1 rounded-2xl border border-line bg-surface px-4 py-5 shadow-md ring-1 ring-fg/6 ring-inset dark:ring-white/6">
                            <span className="font-display text-2xl font-semibold tracking-tight text-fg">
                                {point.value}
                            </span>
                            <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                {point.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

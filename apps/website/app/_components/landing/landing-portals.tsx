import { PORTALS, PORTALS_SECTION } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';
import { CARD, SectionHeading } from './landing-primitives';

/** Money is the door; the rest of the picture opens here. */
export function LandingPortals() {
    return (
        <section id="portals" className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
            <SectionHeading
                eyebrow={PORTALS_SECTION.eyebrow}
                headline={PORTALS_SECTION.headline}
                lead={PORTALS_SECTION.lead}
                headlineClassName="max-w-2xl"
            />

            {/* The switch — the same strip that sits at the top of the app */}
            <div className="mt-8 inline-flex flex-wrap gap-1 rounded-full border border-line bg-raised p-1">
                {PORTALS.map((portal, index) => (
                    <span
                        key={portal.key}
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold tracking-widest uppercase ${
                            index === 0 ? 'bg-surface text-fg shadow-md' : 'text-fg-muted'
                        }`}>
                        <span
                            className="size-1.5 rounded-full"
                            style={{ background: portal.colorVar }}
                        />
                        {portal.name}
                    </span>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {PORTALS.map(portal => (
                    <article
                        key={portal.key}
                        className={`${CARD} grid min-w-0 content-start gap-4 border-t-[3px] p-5`}
                        style={{ borderTopColor: portal.colorVar }}>
                        <span className="flex items-center justify-between gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised">
                                <LandingIcon name={portal.icon} size={19} color={portal.colorVar} />
                            </span>
                            <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                {portal.dutch}
                            </span>
                        </span>

                        <span className="grid gap-1">
                            <span className="font-display text-2xl font-semibold tracking-tight text-fg">
                                {portal.name}
                            </span>
                            <span
                                className="font-display text-base leading-snug font-medium text-balance"
                                style={{ color: portal.colorVar }}>
                                {portal.hook}
                            </span>
                        </span>

                        <span className="font-mono text-xs font-medium tracking-wide text-fg-muted">
                            {portal.question}
                        </span>

                        <ul className="grid gap-2 border-t border-line pt-4">
                            {portal.features.map(feature => (
                                <li
                                    key={feature}
                                    className="flex items-baseline gap-2 text-sm leading-snug text-fg-secondary">
                                    <span
                                        className="mt-1.5 size-1.5 shrink-0 rounded-full"
                                        style={{ background: portal.colorVar }}
                                        aria-hidden
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

import { RumteloLogo } from '@rumtelo/brand';
import { BRAND_TAGLINE } from '@rumtelo/i18n';

import { FOOT_COLS, FOOTER_BLURB, TRUST_BADGES, TRUST_CARDS } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';

export function LandingFooter() {
    return (
        <footer className="border-t border-line bg-bg-app">
            {/* Trust cards row */}
            <div className="mx-auto max-w-6xl px-4 pt-8 lg:px-6">
                <div className="grid grid-cols-1 gap-3.5 border-b border-line pb-8 sm:grid-cols-2 lg:grid-cols-4">
                    {TRUST_CARDS.map(card => (
                        <div key={card.head} className="flex min-w-0 items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                                <LandingIcon name={card.icon} size={18} />
                            </span>
                            <span className="grid min-w-0 gap-0.5">
                                <span className="text-sm font-semibold text-fg-strong">
                                    {card.head}
                                </span>
                                <span className="text-xs leading-relaxed text-fg-faint">
                                    {card.line}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brand + columns */}
            <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-7 px-4 py-8 lg:gap-14 lg:px-6">
                <div className="grid max-w-prose min-w-0 flex-1 basis-72 gap-3">
                    <div className="flex items-center gap-2">
                        <RumteloLogo variant="wordmark" className="h-6 w-auto max-w-[8.5rem]" />
                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint">
                            {BRAND_TAGLINE}
                        </span>
                    </div>
                    <span className="text-sm leading-relaxed text-fg-faint">
                        {FOOTER_BLURB.attribution}
                    </span>
                    <span className="text-xs leading-relaxed text-fg-faint">
                        {FOOTER_BLURB.disclaimer}
                    </span>
                </div>

                <nav
                    aria-label="Footer"
                    className="flex min-w-0 flex-1 flex-wrap justify-start gap-6 sm:gap-8 lg:justify-end lg:gap-12">
                    {FOOT_COLS.map(col => (
                        <div key={col.head} className="grid min-w-0 content-start gap-2.5">
                            <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                {col.head}
                            </span>
                            {col.links.map(link => (
                                <a
                                    key={link.text}
                                    href={link.href}
                                    className="text-sm text-fg-muted transition-colors hover:text-accent">
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-line">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:px-6">
                    <span className="font-mono text-xs font-medium tracking-normal text-fg-faint">
                        {FOOTER_BLURB.copyright}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {TRUST_BADGES.map(badge => (
                            <span
                                key={badge}
                                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
                                <span className="size-1.5 shrink-0 rounded-full bg-success" />
                                <span className="font-mono text-xs font-medium tracking-wide text-fg-muted sm:tracking-widest">
                                    {badge}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

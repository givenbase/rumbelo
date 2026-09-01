import { FOOT_COLS, TRUST_BADGES, TRUST_CARDS } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-bg-app">
      {/* Trust cards row */}
      <div className="mx-auto max-w-6xl px-4 lg:px-6 pt-8">
        <div
          className="grid gap-3.5 border-b border-line pb-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px,23%,300px),1fr))' }}
        >
          {TRUST_CARDS.map((t) => (
            <div key={t.head} className="flex min-w-0 items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft">
                <LandingIcon name={t.icon} size={18} color="var(--color-accent)" />
              </span>
              <span className="grid min-w-0 gap-0.5">
                <span className="text-sm font-semibold text-fg-strong">{t.head}</span>
                <span className="text-xs leading-relaxed text-fg-faint">{t.line}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand + columns */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-7 lg:gap-14 px-4 lg:px-6 py-8 pb-8">
        {/* Brand blurb */}
        <div className="grid max-w-prose min-w-0 flex-1 basis-72 min-w-0 gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold tracking-tight">Rumbelo</span>
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-fg-faint">
              MONEY WITH INTENTION
            </span>
          </div>
          <span className="text-sm leading-relaxed text-fg-faint">
            Rumbelo B.V. · Amsterdam, the Netherlands. Inspired by the six-jar money method
            popularised by T. Harv Eker, and the asset-versus-liability thinking of Robert Kiyosaki.
            Rumbelo is an independent product and is not affiliated with, endorsed by, or licensed
            from either.
          </span>
          <span className="text-xs leading-relaxed text-fg-faint">
            Rumbelo is a money-insight tool, not a bank and not a licensed financial adviser.
            Suggestions are education, not personal investment advice.
          </span>
        </div>

        {/* Link columns */}
        <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-6 lg:gap-12">
          {FOOT_COLS.map((col) => (
            <div key={col.head} className="grid content-start gap-2.5">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-fg-faint">
                {col.head}
              </span>
              {col.links.map((l) => (
                <a
                  key={l.t}
                  href={l.href}
                  className="text-sm text-fg-muted transition-colors hover:text-accent"
                >
                  {l.t}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 lg:px-6 py-4">
          <span className="font-mono text-xs font-medium tracking-normal text-fg-faint">
            © 2026 Rumbelo B.V. · KvK 00000000 · All rights reserved
          </span>
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-success" />
                <span className="font-mono text-xs font-medium tracking-widest text-fg-muted whitespace-nowrap">
                  {b}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

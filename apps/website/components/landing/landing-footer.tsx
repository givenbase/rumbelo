import { FOOT_COLS, TRUST_BADGES, TRUST_CARDS } from '@/lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-bg-app">
      {/* Trust cards row */}
      <div className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] pt-[30px]">
        <div
          className="grid gap-[14px] border-b border-line pb-[30px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px,23%,300px),1fr))' }}
        >
          {TRUST_CARDS.map((t) => (
            <div key={t.head} className="flex min-w-0 items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-accent-soft">
                <LandingIcon name={t.icon} size={18} color="var(--color-accent)" />
              </span>
              <span className="grid min-w-0 gap-[3px]">
                <span className="text-[13.5px] font-semibold text-fg-strong">{t.head}</span>
                <span className="text-[12px] leading-[1.55] text-fg-faint">{t.line}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand + columns */}
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-[clamp(26px,4vw,56px)] px-[clamp(14px,3vw,22px)] py-[34px] pb-[30px]">
        {/* Brand blurb */}
        <div className="grid max-w-[52ch] flex-[2_1_280px] min-w-0 gap-3">
          <div className="flex items-baseline gap-[9px]">
            <span className="font-display text-[18px] font-bold tracking-tight">Rumbelo</span>
            <span className="font-mono text-[8.5px] font-medium uppercase tracking-[0.2em] text-fg-faint">
              MONEY WITH INTENTION
            </span>
          </div>
          <span className="text-[12.5px] leading-[1.7] text-fg-faint">
            Rumbelo B.V. · Amsterdam, the Netherlands. Inspired by the six-jar money method
            popularised by T. Harv Eker, and the asset-versus-liability thinking of Robert Kiyosaki.
            Rumbelo is an independent product and is not affiliated with, endorsed by, or licensed
            from either.
          </span>
          <span className="text-[12px] leading-[1.7] text-fg-faint">
            Rumbelo is a money-insight tool, not a bank and not a licensed financial adviser.
            Suggestions are education, not personal investment advice.
          </span>
        </div>

        {/* Link columns */}
        <div className="flex min-w-0 flex-[3_1_340px] flex-wrap justify-end gap-[clamp(24px,3vw,48px)]">
          {FOOT_COLS.map((col) => (
            <div key={col.head} className="grid content-start gap-[10px]">
              <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-fg-faint">
                {col.head}
              </span>
              {col.links.map((l) => (
                <a
                  key={l.t}
                  href={l.href}
                  className="text-[13px] text-fg-muted transition-colors hover:text-accent"
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
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-[clamp(14px,3vw,22px)] py-4">
          <span className="font-mono text-[10px] font-medium tracking-[0.06em] text-fg-faint">
            © 2026 Rumbelo B.V. · KvK 00000000 · All rights reserved
          </span>
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map((b) => (
              <span
                key={b}
                className="flex items-center gap-[7px] rounded-full border border-line px-3 py-[6px]"
              >
                <span className="size-[6px] shrink-0 rounded-full bg-success" />
                <span className="font-mono text-[9.5px] font-medium tracking-[0.1em] text-fg-muted whitespace-nowrap">
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

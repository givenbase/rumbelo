import { PILLARS } from '../../lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingPillars() {
  return (
    <section id="pillars" className="border-t border-line bg-bg-app">
      <div className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(40px,6vw,80px)]">
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
          ✦ FOUR PORTALS, ONE SYSTEM
        </span>
        <h2 className="mb-3 mt-[14px] max-w-[26ch] font-display text-[clamp(26px,3.6vw,38px)] font-semibold tracking-tight">
          One switch. One focus at a time.
        </h2>
        <p className="mb-[34px] max-w-[62ch] text-[15.5px] leading-[1.65] text-fg-muted">
          Rumbelo is built as four portals — Money, Growth, Energy, Soul. Each answers a different
          question, and you are always inside exactly one. No wall of charts, no twelve tabs: one
          switch at the top, one question per screen, and a ten-minute session with your coach that
          holds it all together.
        </p>

        <div
          className="grid gap-[14px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(230px,23%,320px),1fr))' }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.name}
              className="grid min-w-0 content-start gap-3 rounded-[16px] border border-line bg-surface p-[22px]"
              style={{
                borderTop: `3px solid ${p.color}`,
                boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)',
              }}
            >
              <span className="grid size-[38px] shrink-0 place-items-center rounded-[11px] border border-line bg-raised">
                <LandingIcon name={p.icon} size={19} color={p.color} />
              </span>
              <span className="font-display text-[20px] font-semibold tracking-tight text-fg">
                {p.name}
              </span>
              <span
                className="font-mono text-[10.5px] font-medium tracking-[0.1em]"
                style={{ color: p.color }}
              >
                {p.metric}
              </span>
              <span className="text-[13.5px] leading-relaxed text-fg-muted">{p.line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

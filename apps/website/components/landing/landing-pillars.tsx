import { PILLARS } from '../../lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingPillars() {
  return (
    <section id="pillars" className="border-t border-line bg-bg-app">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-10 lg:py-20">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
          ✦ FOUR PORTALS, ONE SYSTEM
        </span>
        <h2 className="mb-3 mt-3.5 max-w-md font-display text-3xl lg:text-4xl font-semibold tracking-tight">
          One switch. One focus at a time.
        </h2>
        <p className="mb-8 max-w-prose text-base leading-relaxed text-fg-muted">
          Rumbelo is built as four portals — Money, Growth, Energy, Soul. Each answers a different
          question, and you are always inside exactly one. No wall of charts, no twelve tabs: one
          switch at the top, one question per screen, and a ten-minute session with your coach that
          holds it all together.
        </p>

        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(230px,23%,320px),1fr))' }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.name}
              className="grid min-w-0 content-start gap-3 rounded-2xl border border-line bg-surface p-5"
              style={{
                borderTop: `3px solid ${p.color}`,
                boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)',
              }}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised">
                <LandingIcon name={p.icon} size={19} color={p.color} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-fg">
                {p.name}
              </span>
              <span
                className="font-mono text-xs font-medium tracking-widest"
                style={{ color: p.color }}
              >
                {p.metric}
              </span>
              <span className="text-sm leading-relaxed text-fg-muted">{p.line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

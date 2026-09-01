import { COACH_GLANCE_POINTS } from '../../lib/landing-content';

export function LandingCoachGlance() {
  return (
    <section className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(36px,6vw,72px)]">
      <div className="flex flex-wrap items-center gap-[clamp(24px,4vw,48px)]">
        {/* Text */}
        <div className="min-w-0 flex-[1_1_300px]">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
            ✦ ONE GLANCE, EVERY MORNING
          </span>
          <h2 className="mb-[14px] mt-[14px] max-w-[20ch] font-display text-[clamp(26px,3.6vw,38px)] font-semibold tracking-tight">
            Your coach speaks first. Then three numbers.
          </h2>
          <p className="mb-5 max-w-[46ch] text-[15.5px] leading-[1.65] text-fg-muted">
            The overview opens with your coach: one sentence on where you stand and one thing to do.
            Under it, one number per portal — kept from your income, what your assets pay you, sleep
            per night. Everything else is one tap deeper, in plain words a sixteen-year-old
            understands.
          </p>
          <div className="grid gap-[11px]">
            {COACH_GLANCE_POINTS.map((point) => (
              <span key={point} className="flex items-baseline gap-[10px]">
                <span className="font-mono shrink-0 text-[10px] text-accent">✦</span>
                <span className="text-[13.5px] leading-[1.55] text-fg-secondary">{point}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Screenshot placeholder */}
        <div className="min-w-0 flex-[1_1_420px]">
          <div
            className="overflow-hidden rounded-[22px] border border-line"
            style={{ boxShadow: 'var(--shadow-lg)', aspectRatio: '16 / 10' }}
          >
            <div className="flex h-full items-center justify-center bg-bg-app">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fg-faint">
                App screenshot · coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

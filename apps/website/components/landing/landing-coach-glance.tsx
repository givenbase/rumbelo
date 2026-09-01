import { COACH_GLANCE_POINTS } from '../../lib/landing-content';

export function LandingCoachGlance() {
  return (
    <section className="mx-auto max-w-6xl px-4 lg:px-6 py-10 lg:py-16">
      <div className="flex flex-wrap items-center gap-6 lg:gap-12">
        {/* Text */}
        <div className="min-w-0 min-w-0 flex-1 basis-72">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
            ✦ ONE GLANCE, EVERY MORNING
          </span>
          <h2 className="mb-3.5 mt-3.5 max-w-sm font-display text-3xl lg:text-4xl font-semibold tracking-tight">
            Your coach speaks first. Then three numbers.
          </h2>
          <p className="mb-5 max-w-prose text-base leading-relaxed text-fg-muted">
            The overview opens with your coach: one sentence on where you stand and one thing to do.
            Under it, one number per portal — kept from your income, what your assets pay you, sleep
            per night. Everything else is one tap deeper, in plain words a sixteen-year-old
            understands.
          </p>
          <div className="grid gap-2.5">
            {COACH_GLANCE_POINTS.map((point) => (
              <span key={point} className="flex items-baseline gap-2.5">
                <span className="font-mono shrink-0 text-xs text-accent">✦</span>
                <span className="text-sm leading-relaxed text-fg-secondary">{point}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Screenshot placeholder */}
        <div className="min-w-0 min-w-0 flex-1 basis-96">
          <div
            className="overflow-hidden rounded-2xl border border-line"
            style={{ boxShadow: 'var(--shadow-lg)', aspectRatio: '16 / 10' }}
          >
            <div className="flex h-full items-center justify-center bg-bg-app">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-fg-faint">
                App screenshot · coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

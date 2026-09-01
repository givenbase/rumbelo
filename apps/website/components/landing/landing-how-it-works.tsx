import { JOURNEY } from '../../lib/landing-content';

export function LandingHowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(36px,6vw,72px)]">
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
        ✦ HOW IT REALLY WORKS
      </span>
      <h2 className="mb-3 mt-[14px] max-w-[24ch] font-display text-[clamp(26px,3.6vw,38px)] font-semibold tracking-tight">
        From your first euro to your freedom number.
      </h2>
      <p className="mb-9 max-w-[60ch] text-[15.5px] leading-[1.65] text-fg-muted">
        No secrets and no magic — five steps, each built on a principle wealthy families have used
        for generations. You do the small part; Rumbelo does the arithmetic, every day.
      </p>

      <div className="grid gap-0">
        {JOURNEY.map((j, i) => {
          const isFirst = i === 0;
          const isLast = i === JOURNEY.length - 1;
          return (
            <div
              key={j.n}
              className="grid gap-[clamp(14px,2.5vw,26px)]"
              style={{ gridTemplateColumns: '44px minmax(0,1fr)' }}
            >
              {/* Step indicator */}
              <div className="grid justify-items-center gap-[6px]" style={{ gridTemplateRows: 'auto 1fr' }}>
                <span
                  className="grid size-[44px] shrink-0 place-items-center rounded-full border font-mono text-[12px] font-semibold"
                  style={{
                    background: isFirst ? 'var(--gradient-accent)' : 'var(--color-surface)',
                    color: isFirst ? 'var(--color-on-accent)' : 'var(--color-accent)',
                    borderColor: isFirst ? 'transparent' : 'rgb(67 56 202 / 0.34)',
                  }}
                >
                  {j.n}
                </span>
                {!isLast && (
                  <span className="w-px" style={{ background: 'var(--color-line-strong)' }} />
                )}
              </div>

              {/* Card */}
              <div style={{ paddingBottom: isLast ? '0' : '18px', minWidth: 0 }}>
                <div
                  className="grid gap-[13px] rounded-[18px] border border-line bg-surface p-[clamp(20px,3vw,26px)]"
                  style={{ boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)' }}
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-[10px]">
                    <span className="font-display text-[clamp(19px,2.2vw,23px)] font-semibold tracking-tight">
                      {j.title}
                    </span>
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-fg-faint">
                      {j.tag}
                    </span>
                  </span>

                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px,44%,460px),1fr))' }}
                  >
                    <span className="grid min-w-0 gap-[5px]">
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-fg-faint">
                        YOU DO
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-fg-secondary">{j.you}</span>
                    </span>
                    <span className="grid min-w-0 gap-[5px]">
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
                        RUMBELO DOES
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-fg-secondary">
                        {j.rumbelo}
                      </span>
                    </span>
                  </div>

                  <span
                    className="font-mono overflow-wrap-anywhere rounded-[10px] px-[14px] py-3 text-[11.5px] font-medium leading-[1.8] tracking-[0.02em] text-accent"
                    style={{ background: 'var(--color-accent-soft)' }}
                  >
                    {j.math}
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-fg-faint">{j.why}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

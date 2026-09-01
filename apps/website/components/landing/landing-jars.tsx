import { JARS } from '../../lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingJars() {
  return (
    <section id="jars" className="mx-auto max-w-6xl px-4 lg:px-6 py-10 lg:py-16">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
        ✦ WHAT EACH JAR IS FOR
      </span>
      <h2 className="mb-3 mt-3.5 max-w-sm font-display text-3xl lg:text-4xl font-semibold tracking-tight">
        Six jobs, so no euro has to decide for itself.
      </h2>
      <p className="mb-8 max-w-prose text-base leading-relaxed text-fg-muted">
        Every jar has rules you can read in one line. Rumbelo tells you what belongs in it — and
        what does not.
      </p>

      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px,30%,360px),1fr))' }}
      >
        {JARS.map((j) => (
          <div
            key={j.key}
            className="grid min-w-0 content-start gap-2.5 rounded-2xl border border-line bg-surface p-5"
            style={{ boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)' }}
          >
            <span className="flex flex-wrap items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised">
                <LandingIcon name={j.icon} size={20} color={j.colorVar} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">{j.name}</span>
              <span className="font-mono ml-auto text-xs font-semibold text-accent">
                {j.pct}%
              </span>
            </span>
            <span className="text-sm leading-relaxed text-fg-muted">{j.line}</span>
            <span className="font-mono border-t border-line pt-2.5 text-xs font-medium leading-relaxed tracking-normal text-fg-faint">
              {j.not}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

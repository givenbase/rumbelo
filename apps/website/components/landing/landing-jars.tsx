import { JARS } from '../../lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingJars() {
  return (
    <section id="jars" className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(36px,6vw,72px)]">
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
        ✦ WHAT EACH JAR IS FOR
      </span>
      <h2 className="mb-3 mt-[14px] max-w-[24ch] font-display text-[clamp(26px,3.6vw,38px)] font-semibold tracking-tight">
        Six jobs, so no euro has to decide for itself.
      </h2>
      <p className="mb-8 max-w-[58ch] text-[15.5px] leading-[1.65] text-fg-muted">
        Every jar has rules you can read in one line. Rumbelo tells you what belongs in it — and
        what does not.
      </p>

      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px,30%,360px),1fr))' }}
      >
        {JARS.map((j) => (
          <div
            key={j.key}
            className="grid min-w-0 content-start gap-[10px] rounded-[16px] border border-line bg-surface p-[22px]"
            style={{ boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)' }}
          >
            <span className="flex flex-wrap items-center gap-3">
              <span className="grid size-[38px] shrink-0 place-items-center rounded-[11px] border border-line bg-raised">
                <LandingIcon name={j.icon} size={20} color={j.colorVar} />
              </span>
              <span className="font-display text-[19px] font-semibold tracking-tight">{j.name}</span>
              <span className="font-mono ml-auto text-[10.5px] font-semibold text-accent">
                {j.pct}%
              </span>
            </span>
            <span className="text-[13.5px] leading-relaxed text-fg-muted">{j.line}</span>
            <span className="font-mono border-t border-line pt-[10px] text-[10px] font-medium leading-relaxed tracking-[0.06em] text-fg-faint">
              {j.not}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

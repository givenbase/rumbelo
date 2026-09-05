import { JARS } from '../../lib/landing-content';
import { LandingIcon } from './landing-icon';

export function LandingJars() {
    return (
        <section id="jars" className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
            <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                ✦ WHAT EACH JAR IS FOR
            </span>
            <h2 className="mt-3.5 mb-3 max-w-sm font-display text-3xl font-semibold tracking-tight lg:text-4xl">
                Six jobs, so no euro has to decide for itself.
            </h2>
            <p className="mb-8 max-w-prose text-base leading-relaxed text-fg-muted">
                Every jar has rules you can read in one line. Rumbelo tells you what belongs in it —
                and what does not.
            </p>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {JARS.map(j => (
                    <div
                        key={j.key}
                        className="grid min-w-0 content-start gap-2.5 rounded-2xl border border-line bg-surface p-5"
                        style={{ boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)' }}>
                        <span className="flex flex-wrap items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised">
                                <LandingIcon name={j.icon} size={20} color={j.colorVar} />
                            </span>
                            <span className="font-display text-xl font-semibold tracking-tight">
                                {j.name}
                            </span>
                            <span className="ml-auto font-mono text-xs font-semibold text-accent">
                                {j.pct}%
                            </span>
                        </span>
                        <span className="text-sm leading-relaxed text-fg-muted">{j.line}</span>
                        <span className="border-t border-line pt-2.5 font-mono text-xs leading-relaxed font-medium tracking-normal text-fg-faint">
                            {j.not}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

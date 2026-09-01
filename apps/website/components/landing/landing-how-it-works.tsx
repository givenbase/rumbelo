import { JOURNEY } from '../../lib/landing-content';

export function LandingHowItWorks() {
    return (
        <section id="how" className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
            <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                ✦ HOW IT REALLY WORKS
            </span>
            <h2 className="mt-3.5 mb-3 max-w-sm font-display text-3xl font-semibold tracking-tight lg:text-4xl">
                From your first euro to your freedom number.
            </h2>
            <p className="mb-9 max-w-prose text-base leading-relaxed text-fg-muted">
                No secrets and no magic — five steps, each built on a principle wealthy families
                have used for generations. You do the small part; Rumbelo does the arithmetic, every
                day.
            </p>

            <div className="grid gap-0">
                {JOURNEY.map((j, i) => {
                    const isFirst = i === 0;
                    const isLast = i === JOURNEY.length - 1;
                    return (
                        <div
                            key={j.n}
                            className="grid gap-4 lg:gap-6"
                            style={{ gridTemplateColumns: '44px minmax(0,1fr)' }}>
                            {/* Step indicator */}
                            <div
                                className="grid justify-items-center gap-1.5"
                                style={{ gridTemplateRows: 'auto 1fr' }}>
                                <span
                                    className="grid size-11 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold"
                                    style={{
                                        background: isFirst
                                            ? 'var(--gradient-accent)'
                                            : 'var(--color-surface)',
                                        color: isFirst
                                            ? 'var(--color-on-accent)'
                                            : 'var(--color-accent)',
                                        borderColor: isFirst
                                            ? 'transparent'
                                            : 'rgb(67 56 202 / 0.34)',
                                    }}>
                                    {j.n}
                                </span>
                                {!isLast && (
                                    <span
                                        className="w-px"
                                        style={{ background: 'var(--color-line-strong)' }}
                                    />
                                )}
                            </div>

                            {/* Card */}
                            <div style={{ paddingBottom: isLast ? '0' : '18px', minWidth: 0 }}>
                                <div
                                    className="grid gap-3 rounded-2xl border border-line bg-surface p-5 lg:p-6"
                                    style={{ boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)' }}>
                                    <span className="flex flex-wrap items-baseline justify-between gap-2.5">
                                        <span className="font-display text-xl font-semibold tracking-tight lg:text-2xl">
                                            {j.title}
                                        </span>
                                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                            {j.tag}
                                        </span>
                                    </span>

                                    <div
                                        className="grid gap-3"
                                        style={{
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(clamp(220px,44%,460px),1fr))',
                                        }}>
                                        <span className="grid min-w-0 gap-1">
                                            <span className="font-mono text-xs font-semibold tracking-widest text-fg-faint uppercase">
                                                YOU DO
                                            </span>
                                            <span className="text-sm leading-relaxed text-fg-secondary">
                                                {j.you}
                                            </span>
                                        </span>
                                        <span className="grid min-w-0 gap-1">
                                            <span className="font-mono text-xs font-semibold tracking-widest text-accent uppercase">
                                                RUMBELO DOES
                                            </span>
                                            <span className="text-sm leading-relaxed text-fg-secondary">
                                                {j.rumbelo}
                                            </span>
                                        </span>
                                    </div>

                                    <span
                                        className="rounded-lg px-3.5 py-3 font-mono text-xs leading-loose font-medium tracking-normal wrap-break-word text-accent"
                                        style={{ background: 'var(--color-accent-soft)' }}>
                                        {j.math}
                                    </span>
                                    <span className="text-sm leading-relaxed text-fg-faint">
                                        {j.why}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

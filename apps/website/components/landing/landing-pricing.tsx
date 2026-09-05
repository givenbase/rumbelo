'use client';

import { useState } from 'react';

import { PLANS } from '@/lib/landing-content';
import { appSignUpUrl } from '@/lib/portal-urls';

function fmt(n: number) {
    return '€' + Number(n).toLocaleString('en-IE');
}

export function LandingPricing() {
    const [billing, setBilling] = useState<'month' | 'year'>('month');
    const yearly = billing === 'year';

    return (
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                <div className="min-w-0">
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ PRICING
                    </span>
                    <h2 className="mt-3.5 mb-2.5 max-w-sm font-display text-3xl font-semibold tracking-tight lg:text-4xl">
                        Free where it counts. Paid where it saves you work.
                    </h2>
                    <p className="max-w-prose text-base text-fg-muted">
                        Start on Basic and stay there as long as you like. Nothing you enter is ever
                        locked away.
                    </p>
                </div>

                {/* Billing toggle */}
                <div className="flex shrink-0 gap-1 rounded-full border border-line bg-raised p-1">
                    {(['month', 'year'] as const).map(k => (
                        <button
                            key={k}
                            type="button"
                            onClick={() => setBilling(k)}
                            className="cursor-pointer rounded-full px-4 py-2 font-mono text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-colors"
                            style={{
                                background:
                                    billing === k ? 'var(--gradient-accent)' : 'transparent',
                                color:
                                    billing === k
                                        ? 'var(--color-on-accent)'
                                        : 'var(--color-fg-muted)',
                            }}>
                            {k === 'month' ? 'Monthly' : 'Yearly · 2 months free'}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="grid items-start gap-3.5"
                style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px,30%,360px),1fr))',
                }}>
                {PLANS.map(p => {
                    const rec = p.key === 'plus';
                    const price = p.m === 0 ? 0 : yearly ? p.y : p.m;
                    const per = p.m === 0 ? '' : yearly ? '/year' : '/month';
                    const sub =
                        p.m === 0
                            ? 'no card needed'
                            : yearly
                              ? `€${(p.y / 12).toFixed(2)}/month billed yearly`
                              : 'cancel any month';
                    const cta = p.m === 0 ? 'Start free' : `Choose ${p.name}`;

                    return (
                        <div
                            key={p.key}
                            className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-surface"
                            style={{
                                border: `1px solid ${rec ? 'rgb(67 56 202 / 0.34)' : 'var(--color-line)'}`,
                                boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)',
                            }}>
                            <span
                                className="block h-0.5"
                                style={{
                                    background: rec ? 'var(--gradient-accent)' : 'transparent',
                                }}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 pt-6">
                                <span className="font-display text-2xl font-semibold tracking-tight">
                                    {p.name}
                                </span>
                                <span
                                    className="rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
                                    style={{
                                        background: rec ? 'var(--gradient-accent)' : 'transparent',
                                        color: rec
                                            ? 'var(--color-on-accent)'
                                            : 'var(--color-fg-faint)',
                                        borderColor: rec ? 'transparent' : 'var(--color-line)',
                                    }}>
                                    {p.tag}
                                </span>
                            </div>

                            <div className="px-6 pt-4">
                                <span className="flex flex-wrap items-baseline gap-1.5">
                                    <span className="font-display text-4xl leading-none font-semibold tracking-tight text-accent">
                                        {fmt(price)}
                                    </span>
                                    <span className="font-mono text-xs font-medium text-fg-faint">
                                        {per}
                                    </span>
                                </span>
                                <span className="mt-2 block font-mono text-xs font-medium tracking-wide text-fg-faint">
                                    {sub}
                                </span>
                            </div>

                            <p className="mx-6 my-4 text-sm leading-relaxed text-fg-secondary">
                                {p.line}
                            </p>

                            <div className="mx-0 mb-5 grid gap-2 border-t border-line px-6 pt-4">
                                {p.feats.map(f => (
                                    <span key={f} className="flex min-w-0 items-baseline gap-2">
                                        <span className="shrink-0 font-mono text-xs text-accent">
                                            ✦
                                        </span>
                                        <span className="text-sm leading-normal text-fg-secondary">
                                            {f}
                                        </span>
                                    </span>
                                ))}
                            </div>

                            <a
                                href={appSignUpUrl()}
                                className="mx-6 mt-auto mb-6 cursor-pointer rounded-full border px-0 py-3.5 text-center font-mono text-xs font-semibold tracking-wide uppercase transition-all hover:brightness-105"
                                style={{
                                    background: rec ? 'var(--gradient-accent)' : 'transparent',
                                    color: rec
                                        ? 'var(--color-on-accent)'
                                        : 'var(--color-fg-strong)',
                                    borderColor: rec ? 'transparent' : 'var(--color-line-strong)',
                                }}>
                                {cta}
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

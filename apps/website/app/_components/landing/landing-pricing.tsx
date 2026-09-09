'use client';

import { useState } from 'react';

import { PlanKey } from '@rumtelo/contracts';
import { planIntentFromPlanKey, planIntentQuery } from '@rumtelo/utils';

import { PLANS, PRICING_SECTION } from '@/lib/landing-content';
import { webSignUpPath } from '@/lib/portal-urls';

import { Cta, SectionHeading } from './landing-primitives';

function fmt(value: number) {
    return '€' + Number(value).toLocaleString('en-IE');
}

export function LandingPricing() {
    const [billing, setBilling] = useState<'month' | 'year'>('month');
    const yearly = billing === 'year';

    return (
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                <SectionHeading
                    eyebrow={PRICING_SECTION.eyebrow}
                    headline={PRICING_SECTION.headline}
                    lead={PRICING_SECTION.lead}
                    headlineClassName="max-w-lg"
                    className="min-w-0"
                />

                {/* Billing toggle */}
                <div
                    role="tablist"
                    aria-label="Billing period"
                    className="flex w-full gap-1 rounded-full border border-line bg-raised p-1 sm:w-auto">
                    {(['month', 'year'] as const).map(period => {
                        const active = billing === period;
                        return (
                            <button
                                key={period}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => setBilling(period)}
                                className={`flex-1 rounded-full px-3 py-2 font-mono text-xs font-semibold tracking-widest uppercase transition-colors sm:flex-none sm:px-4 ${
                                    active
                                        ? 'bg-(image:--gradient-accent) text-on-accent'
                                        : 'text-fg-muted hover:text-fg'
                                }`}>
                                {period === 'month' ? (
                                    'Monthly'
                                ) : (
                                    <>
                                        <span className="sm:hidden">Yearly</span>
                                        <span className="hidden sm:inline">
                                            Yearly · 2 months free
                                        </span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {PLANS.map(plan => {
                    const rec = plan.key === PlanKey.PLUS;
                    const free = plan.monthly === 0;
                    const price = free ? 0 : yearly ? plan.yearly : plan.monthly;
                    const per = free ? '' : yearly ? '/year' : '/month';
                    const sub = free
                        ? 'no card needed'
                        : yearly
                          ? `€${(plan.yearly / 12).toFixed(2)}/month billed yearly`
                          : 'cancel any month';
                    const cta = free ? 'Start free' : `Choose ${plan.name}`;

                    return (
                        <div
                            key={plan.key}
                            className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-surface shadow-md ring-1 ring-fg/6 ring-inset dark:ring-white/6 ${
                                rec ? 'border-accent/40 shadow-glow' : 'border-line'
                            }`}>
                            <span
                                className={`block h-1 ${rec ? 'bg-(image:--gradient-accent)' : 'bg-transparent'}`}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 pt-6">
                                <span className="font-display text-2xl font-semibold tracking-tight text-fg">
                                    {plan.name}
                                </span>
                                <span
                                    className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wide whitespace-nowrap uppercase ${
                                        rec
                                            ? 'border-transparent bg-(image:--gradient-accent) text-on-accent'
                                            : 'border-line text-fg-faint'
                                    }`}>
                                    {plan.tag}
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

                            <p className="mx-6 my-4 text-sm leading-relaxed text-pretty text-fg-secondary">
                                {plan.line}
                            </p>

                            <ul className="mx-0 mb-5 grid gap-2 border-t border-line px-6 pt-4">
                                {plan.feats.map(feature => (
                                    <li key={feature} className="flex min-w-0 items-baseline gap-2">
                                        <span
                                            className="shrink-0 font-mono text-xs text-accent"
                                            aria-hidden>
                                            ✦
                                        </span>
                                        <span className="text-sm leading-normal text-fg-secondary">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Cta
                                href={webSignUpPath(
                                    plan.key === PlanKey.BASIC
                                        ? { plan: PlanKey.BASIC }
                                        : planIntentQuery(planIntentFromPlanKey(plan.key, billing))
                                )}
                                variant={rec ? 'primary' : 'ghost'}
                                size="lg"
                                className={`mx-6 mt-auto mb-6 ${rec ? '' : 'text-fg-strong'}`}>
                                {cta}
                            </Cta>
                        </div>
                    );
                })}
            </div>

            <p className="mt-5 text-center font-mono text-xs font-medium tracking-wide text-fg-faint">
                Prices in euro, VAT included. Basic may stay free or become a small fee later —
                nothing you enter is ever locked away.
            </p>
        </section>
    );
}

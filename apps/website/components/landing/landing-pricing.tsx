'use client';

import { useState } from 'react';
import { PLANS } from '@/lib/landing-content';

function fmt(n: number) {
  return '€' + Number(n).toLocaleString('en-IE');
}

export function LandingPricing() {
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const yearly = billing === 'year';

  return (
    <section id="pricing" className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(36px,6vw,72px)]">
      <div className="mb-[30px] flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
            ✦ PRICING
          </span>
          <h2 className="mb-[10px] mt-[14px] max-w-[24ch] font-display text-[clamp(26px,3.6vw,38px)] font-semibold tracking-tight">
            Free where it counts. Paid where it saves you work.
          </h2>
          <p className="max-w-[52ch] text-[15px] text-fg-muted">
            Start on Grip and stay there as long as you like. Nothing you enter is ever locked away.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex shrink-0 gap-1 rounded-full border border-line bg-raised p-1">
          {(['month', 'year'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setBilling(k)}
              className="font-mono cursor-pointer rounded-full px-[15px] py-[9px] text-[10px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors"
              style={{
                background: billing === k ? 'var(--gradient-accent)' : 'transparent',
                color: billing === k ? 'var(--color-on-accent)' : 'var(--color-fg-muted)',
              }}
            >
              {k === 'month' ? 'Monthly' : 'Yearly · 2 months free'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid items-start gap-[14px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px,30%,360px),1fr))' }}
      >
        {PLANS.map((p) => {
          const rec = p.key === 'ritme';
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
              className="flex min-w-0 flex-col overflow-hidden rounded-[18px] bg-surface"
              style={{
                border: `1px solid ${rec ? 'rgb(67 56 202 / 0.34)' : 'var(--color-line)'}`,
                boxShadow: 'inset 0 0 0 1px rgb(14 17 22 / 0.08)',
              }}
            >
              <span
                className="block h-[2px]"
                style={{ background: rec ? 'var(--gradient-accent)' : 'transparent' }}
              />

              <div className="flex flex-wrap items-center justify-between gap-[10px] px-6 pt-6">
                <span className="font-display text-[25px] font-semibold tracking-tight">
                  {p.name}
                </span>
                <span
                  className="font-mono rounded-full border px-[11px] py-[5px] text-[9px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap"
                  style={{
                    background: rec ? 'var(--gradient-accent)' : 'transparent',
                    color: rec ? 'var(--color-on-accent)' : 'var(--color-fg-faint)',
                    borderColor: rec ? 'transparent' : 'var(--color-line)',
                  }}
                >
                  {p.tag}
                </span>
              </div>

              <div className="px-6 pt-4">
                <span className="flex flex-wrap items-baseline gap-[6px]">
                  <span className="font-display text-[40px] font-semibold leading-none tracking-tight text-accent">
                    {fmt(price)}
                  </span>
                  <span className="font-mono text-[11.5px] font-medium text-fg-faint">{per}</span>
                </span>
                <span className="font-mono mt-2 block text-[10px] font-medium tracking-[0.05em] text-fg-faint">
                  {sub}
                </span>
              </div>

              <p className="mx-6 my-[18px] text-[13.5px] leading-relaxed text-fg-secondary">
                {p.line}
              </p>

              <div className="mx-0 mb-5 grid gap-[9px] border-t border-line px-6 pt-4">
                {p.feats.map((f) => (
                  <span key={f} className="flex min-w-0 items-baseline gap-[9px]">
                    <span className="font-mono shrink-0 text-[10px] text-accent">✦</span>
                    <span className="text-[13px] leading-[1.5] text-fg-secondary">{f}</span>
                  </span>
                ))}
              </div>

              <a
                href="#signup"
                className="font-mono mx-6 mb-6 mt-auto cursor-pointer rounded-full border px-0 py-[14px] text-center text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-[filter] hover:brightness-105"
                style={{
                  background: rec ? 'var(--gradient-accent)' : 'transparent',
                  color: rec ? 'var(--color-on-accent)' : 'var(--color-fg-strong)',
                  borderColor: rec ? 'transparent' : 'var(--color-line-strong)',
                }}
              >
                {cta}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

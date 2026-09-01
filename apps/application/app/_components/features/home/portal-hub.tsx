'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@rumbelo/utils';
import { Button } from '@rumbelo/ui';

interface HubCard {
  name: string;
  value: string;
  note: string;
  color: string;
  chart: { kind: 'bars'; bars: number[] } | { kind: 'ring'; pct: number };
  delta?: { mark: '↑' | '↓' | '→'; text: string; positive: boolean };
  locked?: boolean;
  href: string;
}

export interface PortalHubProps {
  tint: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  line: string;
  coach: { dot: string; kind: string; text: string; cta: string; href: string };
  cards: HubCard[];
}

/**
 * The shared portal-overview template (design: "PORTAL OVERZICHT",
 * Kluis Finance App.dc.html:631-687) — used once each by Money, Growth,
 * Energy and Soul's own overview screen.
 */
export function PortalHub({ tint, icon, eyebrow, title, line, coach, cards }: PortalHubProps) {
  return (
    <div className="grid animate-rise gap-5">
      <div>
        <span
          className="flex items-center gap-2 font-mono text-xs font-medium tracking-widest uppercase"
          style={{ color: tint }}
        >
          {icon}
          {eyebrow}
        </span>
        <h1 className="mt-2.5 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          {title}
        </h1>
        <p className="mt-2 max-w-prose text-base text-fg-muted">{line}</p>
      </div>

      <div
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-l-4 border-line bg-surface p-4 shadow-md sm:p-5"
        style={{ borderLeftColor: tint }}
      >
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="flex items-center gap-2">
            <span className="size-1.75 rounded-full" style={{ background: coach.dot }} />
            <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">The coach</span>
            <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: coach.dot }}>
              · {coach.kind}
            </span>
          </span>
          <span className="text-pretty font-display text-base lg:text-lg font-medium leading-snug text-fg">
            {coach.text}
          </span>
        </div>
        <Button as={Link} href={coach.href} size="sm">
          {coach.cta}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="grid content-start gap-2.5 rounded-2xl border border-t-4 border-line bg-surface p-5 shadow-md transition-all hover:-translate-y-px hover:border-accent-hover"
            style={{ borderTopColor: c.color }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold tracking-widest text-fg-faint uppercase">{c.name}</span>
              {c.locked && <span className="text-xs text-fg-faint">🔒</span>}
            </span>
            <span className="flex min-h-13 items-end justify-between gap-3">
              <span className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-fg">{c.value}</span>
              {c.chart.kind === 'bars' ? (
                <span className="flex h-11 items-end gap-0.75">
                  {c.chart.bars.map((h, i) => (
                    <span key={i} className="block w-1.5 rounded-sm" style={{ height: `${h}%`, minHeight: 4, background: c.color }} />
                  ))}
                </span>
              ) : (
                <RingChart pct={c.chart.pct} color={c.color} />
              )}
            </span>
            <span className="text-pretty text-sm leading-relaxed text-fg-muted">{c.note}</span>
            {c.delta && (
              <span className="flex items-center gap-1.5 border-t border-line pt-2.5">
                <span className={cn('text-xs', c.delta.positive ? 'text-success' : 'text-danger')}>{c.delta.mark}</span>
                <span className={cn('font-mono text-xs font-medium tracking-normal', c.delta.positive ? 'text-success' : 'text-danger')}>
                  {c.delta.text}
                </span>
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RingChart({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <span className="relative grid size-11.5 flex-none place-items-center">
      <svg viewBox="0 0 36 36" className="size-11.5 -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-sunken)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${clamped} 100`}
          strokeLinecap="round"
          pathLength={100}
        />
      </svg>
      <span className="absolute font-mono text-xs text-fg-faint">{pct}%</span>
    </span>
  );
}

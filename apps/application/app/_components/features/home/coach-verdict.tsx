'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@rumbelo/utils';
import { Button } from '@rumbelo/ui';

export interface CoachMessage {
  id: string;
  kind: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface CoachRecapItem {
  portal: string;
  value: string;
  what: string;
  tint: string;
  href: string;
}

const KIND_META: Record<string, { label: string; dot: string }> = {
  NUDGE: { label: 'Attention', dot: 'var(--color-warning)' },
  WIN: { label: 'Win', dot: 'var(--color-success)' },
  ON_TRACK: { label: 'On track', dot: 'var(--color-success)' },
  ALERT: { label: 'Alert', dot: 'var(--color-danger)' },
};

/**
 * Dashboard coach card (design: Kluis Finance App.dc.html:346-387) —
 * dot-paginated rotating coach messages with a kind badge, a cross-portal
 * recap strip, and a single CTA that changes per slide.
 *
 * Replaces the old CoachCarousel with English user-facing copy and a type that
 * matches the mockCoach / contract.coach shape directly.
 */
export function CoachVerdict({
  messages,
  recap,
}: {
  messages: CoachMessage[];
  recap: CoachRecapItem[];
}) {
  const [index, setIndex] = useState(0);
  const msg = messages[index] ?? messages[0];
  if (!msg) return null;
  const meta = KIND_META[msg.kind] ?? { label: msg.kind, dot: 'var(--color-accent)' };

  const prev = () => setIndex((i) => (i - 1 + messages.length) % messages.length);
  const next = () => setIndex((i) => (i + 1) % messages.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/40 bg-surface shadow-md">
      {/* Slide body */}
      <div className="grid gap-3.5 px-5 pt-4.5 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
            ✦ The coach
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.75 rounded-full" style={{ background: meta.dot }} />
            <span
              className="font-mono text-xs font-medium tracking-wide uppercase"
              style={{ color: meta.dot }}
            >
              {meta.label}
            </span>
          </span>
        </div>

        <p className="max-w-prose text-pretty font-display text-xl lg:text-2xl font-medium leading-snug text-fg">
          {msg.text}
        </p>

        <div className="flex flex-wrap items-center gap-3.5">
          {/* Dot pagination */}
          <span className="flex items-center gap-1.5">
            {messages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Message ${i + 1}`}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-accent' : 'w-2.5 bg-line-strong',
                )}
              />
            ))}
          </span>

          {/* Prev / count / next */}
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
            >
              ←
            </button>
            <span className="font-mono text-xs font-medium text-fg-faint">
              {index + 1} / {messages.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
            >
              →
            </button>
          </span>

          <span className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-line-strong px-4 py-2.5 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent-hover hover:text-accent"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                  void navigator.share({ title: 'Rumbelo', text: msg.text, url: window.location.href });
                }
              }}
            >
              Share
            </button>
            <Button as={Link} href={msg.ctaHref} size="sm">
              {msg.ctaLabel}
            </Button>
          </span>
        </div>
      </div>

      {/* Cross-portal recap strip */}
      <div className="flex flex-wrap border-t border-line bg-bg-app">
        {recap.map((r) => (
          <Link
            key={r.portal}
            href={r.href}
            className="grid flex-1 gap-1 border-r border-t-2 border-line px-4 py-2.5 transition-colors last:border-r-0 hover:bg-raised"
            style={{ borderTopColor: r.tint }}
          >
            <span
              className="font-mono text-xs font-semibold tracking-widest uppercase"
              style={{ color: r.tint }}
            >
              {r.portal}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono text-xs text-fg">{r.value}</span>
              <span className="text-xs text-fg-faint">{r.what}</span>
            </span>
          </Link>
        ))}
        <Link
          href="/ritual"
          className="ml-auto flex items-center border-l border-line px-4.5 font-mono text-xs font-medium tracking-wide text-fg-faint uppercase transition-colors hover:text-accent"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}

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
  NUDGE: { label: 'Aandacht', dot: 'var(--color-warning)' },
  WIN: { label: 'Winst', dot: 'var(--color-success)' },
  ON_TRACK: { label: 'Op koers', dot: 'var(--color-success)' },
  ALERT: { label: 'Let op', dot: 'var(--color-danger)' },
};

/**
 * Dashboard coach card (design: Kluis Finance App.dc.html:346-387) —
 * dot-paginated rotating coach messages with a kind badge, a cross-portal
 * recap strip, and a single CTA that changes per slide.
 *
 * Replaces the old CoachCarousel with Dutch user-facing copy and a type that
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
          <span className="font-mono text-[10.5px] font-medium tracking-[0.16em] text-accent uppercase">
            ✦ De coach
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.75 rounded-full" style={{ background: meta.dot }} />
            <span className="font-mono text-[10px] font-medium tracking-[0.15em] text-fg-faint uppercase">
              {meta.label}
            </span>
          </span>
        </div>

        <p className="max-w-[52ch] text-pretty font-display text-[clamp(18px,2.4vw,25px)] font-medium leading-[1.3] text-fg">
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
                aria-label={`Bericht ${i + 1}`}
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
              aria-label="Vorige"
              className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
            >
              ←
            </button>
            <span className="font-mono text-[10px] font-medium text-fg-faint">
              {index + 1} / {messages.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Volgende"
              className="grid size-6.5 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent-hover hover:text-accent"
            >
              →
            </button>
          </span>

          <span className="ml-auto">
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
            className="grid flex-1 gap-1 border-r border-line px-4 py-2.5 transition-colors last:border-r-0 hover:bg-raised"
            style={{ borderTopWidth: 2, borderTopColor: r.tint }}
          >
            <span
              className="font-mono text-[8.5px] font-semibold tracking-[0.16em] uppercase"
              style={{ color: r.tint }}
            >
              {r.portal}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono text-[11.5px] text-fg">{r.value}</span>
              <span className="text-xs text-fg-faint">{r.what}</span>
            </span>
          </Link>
        ))}
        <Link
          href="/ritual"
          className="ml-auto flex items-center border-l border-line px-4.5 font-mono text-[9.5px] font-medium tracking-[0.13em] text-fg-faint uppercase transition-colors hover:text-accent"
        >
          Detail
        </Link>
        <button
          type="button"
          className="flex items-center border-l border-line px-4.5 font-mono text-[9.5px] font-medium tracking-[0.13em] text-fg-faint uppercase transition-colors hover:text-accent"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.share) {
              void navigator.share({ title: 'Rumbelo', text: msg.text, url: window.location.href });
            }
          }}
        >
          Delen
        </button>
      </div>
    </div>
  );
}

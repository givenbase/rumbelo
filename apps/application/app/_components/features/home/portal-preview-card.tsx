import Link from 'next/link';
import type { ReactNode } from 'react';
import { AccentCard } from '@rumbelo/ui';

interface PreviewRow {
  label: string;
  value: string;
  color?: string;
}

/**
 * The 3 Growth/Energy/Soul mini-widgets under the dashboard hero (design:
 * Kluis Finance App.dc.html:468-517) — each a top-accent-bar card with a
 * title, an "open" link, a few label/value rows, and a closing line.
 */
export function PortalPreviewCard({
  tint, icon, title, href, openLabel, rows, line,
}: {
  tint: string;
  icon: ReactNode;
  title: string;
  href: string;
  openLabel: string;
  rows: PreviewRow[];
  line: string;
}) {
  return (
    <AccentCard tint={tint} className="flex flex-1 flex-col gap-3.5 rounded-[20px] p-5.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: tint }}>
          {icon}
          {title}
        </span>
        <Link href={href} className="font-mono text-[11px] font-medium text-fg-faint hover:text-accent">
          {openLabel}
        </Link>
      </div>
      <div className="grid">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
            <span className="font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-fg-faint">{r.label}</span>
            <span className="font-display text-[22px] leading-none font-semibold tracking-tight" style={{ color: r.color }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[12.5px] leading-relaxed text-fg-muted">{line}</p>
    </AccentCard>
  );
}

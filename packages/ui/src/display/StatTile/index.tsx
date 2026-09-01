'use client';

import { cn } from '@rumbelo/utils';

import type StatTileProps from './types';

import { Eyebrow } from '../../layout/Eyebrow';

/** Headline figure with tabular numbers. */
export function StatTile({ label, value, hint, tone = 'default' }: StatTileProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <Eyebrow>{label}</Eyebrow>
      <p
        className={cn(
          'mt-2 font-display text-2xl font-semibold tracking-tight tabular-nums',
          tone === 'positive' && 'text-success',
          tone === 'negative' && 'text-danger',
          tone === 'default' && 'text-fg',
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-fg-muted">{hint}</p> : null}
    </div>
  );
}

export type { StatTileProps };

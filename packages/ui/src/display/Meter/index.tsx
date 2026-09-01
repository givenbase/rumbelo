'use client';

import { cn } from '@rumbelo/utils';

import type MeterProps from './types';

import { meterFillClass, meterTrackClass } from './styles';

/** Horizontal progress meter. Turns red past the line rather than clipping silently. */
export function Meter({ value, className, tone = 'accent' }: MeterProps) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className={cn(meterTrackClass, className)}>
      <div className={meterFillClass(tone)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export type { MeterProps };

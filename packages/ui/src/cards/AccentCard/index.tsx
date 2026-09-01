'use client';

import { cn } from '@rumbelo/utils';

import type AccentCardProps from './types';
import accentCardClass from './styles';

/** Top-accent-bar card pattern (jar cards, portal widgets). */
export function AccentCard({ children, tint, className }: AccentCardProps) {
  return (
    <div
      className={cn(accentCardClass, 'border-t-4', className)}
      style={{ borderTopColor: tint }}
    >
      {children}
    </div>
  );
}

export type { AccentCardProps };

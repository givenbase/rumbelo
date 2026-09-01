'use client';

import { cn } from '@rumbelo/utils';

import type BadgeProps from './types';
import badgeVariants from './styles';

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }))}>{children}</span>;
}

export { badgeVariants };
export type { BadgeProps, BadgeTone } from './types';

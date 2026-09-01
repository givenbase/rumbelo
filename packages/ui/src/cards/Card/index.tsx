'use client';

import { cn } from '@rumbelo/utils';

import type CardProps from './types';
import cardClass from './styles';

export function Card({ children, className }: CardProps) {
  return <div className={cn(cardClass, className)}>{children}</div>;
}

export type { CardProps };

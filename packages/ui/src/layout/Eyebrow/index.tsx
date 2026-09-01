'use client';

import type { ReactNode } from 'react';
import { cn } from '@rumbelo/utils';

import eyebrowClass from './styles';

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(eyebrowClass, className)}>{children}</p>;
}

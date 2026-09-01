'use client';

import { cn } from '@rumbelo/utils';

import type HeroNumberProps from './types';

import heroNumberClass from './styles';

/** Gradient-text hero figure. */
export function HeroNumber({ children, className }: HeroNumberProps) {
    return <div className={cn(heroNumberClass, className)}>{children}</div>;
}

export type { HeroNumberProps };

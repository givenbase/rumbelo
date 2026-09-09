'use client';

import type { ReactNode } from 'react';

import { cn } from '@rumtelo/utils';

import eyebrowClass from './styles';

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return <p className={cn(eyebrowClass, className)}>{children}</p>;
}

'use client';

import { cn } from '@rumbelo/utils';

import type SectionProps from './types';

import { Eyebrow } from '../Eyebrow';

export function Section({ eyebrow, title, action, children, className }: SectionProps) {
  return (
    <section className={cn('animate-rise', className)}>
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? <Eyebrow className="mb-1">✦ {eyebrow}</Eyebrow> : null}
            {title ? (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">{title}</h2>
            ) : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export type { SectionProps };

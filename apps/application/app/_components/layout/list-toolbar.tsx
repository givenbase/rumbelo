'use client';

import type { ReactNode } from 'react';
import { Button } from '@rumbelo/ui';

/**
 * Shared list chrome: context/tabs on the left, primary create on the right.
 * Matches the Transacties toolbar pattern (design + muscle memory).
 */
export function ListToolbar({
  children,
  createLabel = '+ Toevoegen',
  onCreate,
  secondary,
}: {
  children?: ReactNode;
  createLabel?: string;
  onCreate: () => void;
  /** Optional actions left of create (e.g. Regels toepassen). */
  secondary?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">{children}</div>
      <div className="flex flex-wrap items-center gap-2">
        {secondary}
        <Button size="sm" onClick={onCreate}>
          {createLabel}
        </Button>
      </div>
    </div>
  );
}

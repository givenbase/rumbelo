'use client';

import type EmptyStateProps from './types';

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-line bg-surface px-6 py-12 text-center">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 font-display text-lg font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-fg-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export type { EmptyStateProps };

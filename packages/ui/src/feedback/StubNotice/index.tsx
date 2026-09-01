'use client';

import type StubNoticeProps from './types';

export function StubNotice({ what }: StubNoticeProps) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-raised/50 p-4 text-sm text-fg-muted">
      <span className="font-semibold text-fg-secondary">Scaffold.</span> {what}
    </div>
  );
}

export type { StubNoticeProps };

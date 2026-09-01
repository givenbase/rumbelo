'use client';

import Link from 'next/link';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { CREATE_HREF, type CreateKind } from '@/app/_lib/create-routes';

const QUICK_ITEMS: { label: string; kind: CreateKind }[] = [
  { label: 'Uitgave', kind: 'tx' },
  { label: 'Vaste last', kind: 'fixed' },
  { label: 'Schuld', kind: 'debt' },
  { label: 'Doel', kind: 'goal' },
  { label: 'Inkomen', kind: 'income' },
  { label: 'Training', kind: 'session' },
  { label: 'Bezitting', kind: 'asset' },
  { label: 'Verplaatsen', kind: 'move' },
];

export function QuickAddFab() {
  const { quickOpen, toggleQuick, setQuickOpen } = useAppShell();

  return (
    <>
      {quickOpen && (
        <div
          data-quick
          className="fixed right-4 bottom-36 z-45 grid w-[min(340px,calc(100vw-24px))] gap-1 rounded-2xl border border-line-strong bg-surface p-3.5 shadow-xl animate-rise md:right-6 md:bottom-28"
        >
          <p className="mb-1 font-mono text-[9px] font-semibold tracking-[0.16em] text-fg-faint uppercase">
            Snel toevoegen
          </p>
          {QUICK_ITEMS.map((item) => (
            <Link
              key={item.kind}
              href={CREATE_HREF[item.kind]}
              onClick={() => setQuickOpen(false)}
              className="rounded-lg px-3 py-2.5 text-left text-sm text-fg transition-colors hover:bg-raised"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div data-fab className="fixed right-4 bottom-23 z-45 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
        <button
          type="button"
          data-fabbtn
          onClick={toggleQuick}
          className="flex items-center gap-2.5 rounded-full border-0 bg-gradient-to-br from-accent to-accent-hover px-4 py-3.25 text-on-accent shadow-glow transition hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.985]"
        >
          <span className="grid size-6.5 place-items-center rounded-lg bg-on-accent/20 text-[17px] leading-none">
            {quickOpen ? '×' : '+'}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {quickOpen ? 'Sluiten' : 'Snel toevoegen'}
          </span>
          <span className="rounded-md bg-on-accent/15 px-1.75 py-1 font-mono text-[10px] font-medium tracking-wide">
            ⌘K
          </span>
        </button>
      </div>
    </>
  );
}

/** @deprecated use QuickAddFab */
export const QuickAdd = QuickAddFab;

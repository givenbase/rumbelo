'use client';

import { useEffect, useState } from 'react';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';
import { JAR_META } from '@/app/_mock';
import { Button } from '@rumbelo/ui';

interface InboxTransaction {
  readonly id: string;
  readonly description: string;
  readonly counterparty: string | null;
  readonly amount: number;
  readonly bookedOn: string;
}

export type InboxJarOption = {
  id: string;
  key: string;
  name: string;
  subtitle?: string | null;
};

function suggestJarKey(amount: number): string {
  if (amount > 0) return 'NECESSITIES';
  if (Math.abs(amount) < 2_000) return 'PLAY';
  return 'NECESSITIES';
}

function metaForKey(key: string) {
  return JAR_META.find((j) => j.key === key) ?? JAR_META[0]!;
}

const toVar = (bgClass: string) => bgClass.replace('bg-', 'var(--color-') + ')';

function resolveInitialJarId(
  jars: readonly InboxJarOption[],
  suggestedJarId: string | undefined,
  amount: number,
): string {
  if (suggestedJarId && jars.some((j) => j.id === suggestedJarId)) return suggestedJarId;
  const byKey = jars.find((j) => j.key === suggestJarKey(amount));
  return byKey?.id ?? jars[0]?.id ?? '';
}

export function InboxSortCard({
  transaction: t,
  jars,
  suggestedJarId,
  onConfirm,
  onChange,
}: {
  transaction: InboxTransaction;
  jars: readonly InboxJarOption[];
  suggestedJarId?: string;
  onConfirm?: (transactionId: string, jarId: string, createRule?: boolean) => Promise<void>;
  onChange?: (transaction: InboxTransaction, jarId: string) => void;
}) {
  const [jarId, setJarId] = useState(() => resolveInitialJarId(jars, suggestedJarId, t.amount));
  const [picking, setPicking] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState<'sort' | 'rule' | null>(null);

  useEffect(() => {
    if (jarId && jars.some((j) => j.id === jarId)) return;
    const next = resolveInitialJarId(jars, suggestedJarId, t.amount);
    if (next) setJarId(next);
  }, [jars, suggestedJarId, t.amount, jarId]);

  const selected = jars.find((j) => j.id === jarId) ?? jars[0];
  const meta = metaForKey(selected?.key ?? suggestJarKey(t.amount));
  const confident =
    Boolean(suggestedJarId) ||
    suggestJarKey(t.amount) === 'NECESSITIES' ||
    Math.abs(t.amount) < 2_000;

  if (done) return null;

  async function confirm(createRule = false) {
    if (!jarId) return;
    if (!onConfirm) {
      setDone(true);
      return;
    }
    setPending(createRule ? 'rule' : 'sort');
    try {
      await onConfirm(t.id, jarId, createRule);
      setDone(true);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 shadow-md animate-rise">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15.5px] font-semibold text-fg">{t.description}</p>
          <p className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-fg-muted">
            {t.counterparty ?? 'Onbekende tegenpartij'} · {t.bookedOn}
          </p>
        </div>
        <span className={cn('shrink-0 font-mono text-[17px]', t.amount < 0 ? 'text-fg' : 'text-success')}>
          {formatMoney(t.amount, { signed: true })}
        </span>
      </div>

      <div className="grid gap-2.5">
        <button
          type="button"
          onClick={() => setPicking((v) => !v)}
          className="flex flex-wrap items-center gap-2.5 rounded-xl border border-line bg-raised px-3.5 py-3 text-left transition-colors hover:border-line-strong"
        >
          <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-fg-muted">
            Dit lijkt op
          </span>
          <span className="size-2 shrink-0 rounded-sm" style={{ background: toVar(meta.color) }} />
          <span className="text-[13.5px] text-fg">{selected?.name ?? meta.name}</span>
          {selected?.subtitle ? (
            <span className="text-[13px] text-fg-muted">· {selected.subtitle}</span>
          ) : null}
          <span
            className={cn(
              'ml-auto whitespace-nowrap font-mono text-[10px]',
              confident ? 'text-fg-faint' : 'text-warning',
            )}
          >
            {confident ? 'redelijk zeker' : 'niet zeker — check dit'}
          </span>
        </button>

        {picking && jars.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {jars.map((jar) => {
              const jarMeta = metaForKey(jar.key);
              const active = jar.id === jarId;
              return (
                <button
                  key={jar.id}
                  type="button"
                  onClick={() => {
                    setJarId(jar.id);
                    setPicking(false);
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors',
                    active
                      ? 'border-accent/40 bg-accent-soft text-accent'
                      : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
                  )}
                >
                  <span
                    className="size-1.5 rounded-sm"
                    style={{ background: toVar(jarMeta.color) }}
                  />
                  {jar.name}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => void confirm(false)} disabled={pending != null || !jarId}>
          {pending === 'sort' ? 'Bezig…' : 'Klopt'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => void confirm(true)}
          disabled={pending != null || !onConfirm || !jarId}
        >
          {pending === 'rule' ? 'Bezig…' : 'Altijd zo'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending != null || !jarId}
          onClick={() => onChange?.(t, jarId)}
        >
          Anders
        </Button>
      </div>
    </div>
  );
}

export function TabPills({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 rounded-full border font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200',
            active === tab.id
              ? 'border-accent/40 bg-accent-soft text-accent'
              : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
          )}
        >
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <span className="rounded-full bg-warning/15 px-2 py-0.5 font-mono text-[9.5px] text-warning">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

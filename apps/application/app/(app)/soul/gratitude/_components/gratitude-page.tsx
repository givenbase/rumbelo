'use client';

import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useLiveQuery } from '@rumbelo/hooks';
import { currentWeekKey } from '@rumbelo/utils';
import { mockGratitude } from '@/app/_mock';
import { isLiveData } from '@/app/_lib/preview';
import { PageContent } from '@/components/layout/page-content';
import { Button, Eyebrow, Input, Section } from '@rumbelo/ui';

export function GratitudePageClient() {
  const api = useApi();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { householdId } = useAuth();
  const live = isLiveData(householdId);
  const weekKey = currentWeekKey();

  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const listQuery = useLiveQuery(
    api.soul.gratitude.list.queryOptions({ input: { householdId: householdId!, week: weekKey } }),
    mockGratitude as never,
    live,
  );

  const createMutation = useMutation({
    mutationFn: async (newText: string) => {
      if (!householdId) throw new Error('No household');
      return client.soul.gratitude.create({ householdId, week: weekKey, text: newText });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: api.soul.gratitude.list.key(),
      });
      setText('');
      inputRef.current?.focus();
    },
  });

  const entries = (listQuery.data ?? mockGratitude) as ReadonlyArray<{
    id: string;
    text: string;
    day?: string;
    createdAt?: string;
  }>;

  const empty = entries.length === 0;

  function formatDay(entry: { day?: string; createdAt?: string }): string {
    if (entry.day) return entry.day;
    if (entry.createdAt) {
      const d = new Date(entry.createdAt);
      return d.toLocaleDateString('nl-NL', { weekday: 'short' });
    }
    return '';
  }

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (live) {
      createMutation.mutate(trimmed);
    } else {
      // Mock-mode: no-op (form reset only)
      setText('');
    }
  }

  return (
    <PageContent width="narrow" className="grid animate-rise gap-6">
      <Section eyebrow="Dankbaarheid" title="Één ding per dag.">
        <p className="text-[15px] text-fg-muted">
          Niet omdat het je saldo verandert, maar omdat het verandert hoe je ernaar kijkt.
        </p>
      </Section>

      {/* ── Add row ── */}
      <div className="flex flex-wrap gap-2.5">
        <Input
          ref={inputRef}
          className="min-w-65 flex-1"
          placeholder="Waar ben je dankbaar voor?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
          disabled={createMutation.isPending}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!text.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? '…' : 'Toevoegen'}
        </Button>
      </div>

      {/* ── Entries list ── */}
      {empty ? (
        <p className="text-[14px] text-fg-muted">
          Nog niets opgeschreven. Het weekritueel vraagt hier vanzelf naar.
        </p>
      ) : (
        <div className="grid gap-2.5">
          {entries.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5"
              style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-portal-soul)' }}
            >
              <span className="min-w-0 flex-1 text-[14.5px] leading-snug text-fg">
                {g.text}
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-fg-muted whitespace-nowrap">
                {formatDay(g)}
              </span>
              <button
                type="button"
                aria-label="Verwijder"
                className="shrink-0 text-[15px] leading-none text-fg-faint transition-colors hover:text-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-line pt-3">
        <Eyebrow>Deze week</Eyebrow>
        <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
          Eén regel per week tijdens het ritueel. Niet meer dan dat — het is een check-in, geen dagboek.
        </p>
      </div>
    </PageContent>
  );
}

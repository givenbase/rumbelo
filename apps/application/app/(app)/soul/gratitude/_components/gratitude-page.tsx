'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { useLiveQuery } from '@rumbelo/hooks';
import { Button, Eyebrow, Input, Section } from '@rumbelo/ui';
import { currentWeekKey } from '@rumbelo/utils';

import { isLiveData } from '@/app/_lib/preview';
import { mockGratitude } from '@/app/_mock';
import { useAuth } from '@/components/features/shell/auth-provider';
import { PageContent } from '@/components/layout/page-content';

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
        api.soul.gratitude.list.queryOptions({
            input: { householdId: householdId!, week: weekKey },
        }),
        mockGratitude as never,
        live
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
            return d.toLocaleDateString('en-US', { weekday: 'short' });
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
            <Section eyebrow="Gratitude" title="One thing per day.">
                <p className="text-base text-fg-muted">
                    Not because it changes your balance, but because it changes how you see it.
                </p>
            </Section>

            {/* ── Add row ── */}
            <div className="flex flex-wrap gap-2.5">
                <Input
                    ref={inputRef}
                    className="min-w-65 flex-1"
                    placeholder="What are you grateful for?"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                    disabled={createMutation.isPending}
                />
                <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={!text.trim() || createMutation.isPending}>
                    {createMutation.isPending ? '…' : 'Add'}
                </Button>
            </div>

            {/* ── Entries list ── */}
            {empty ? (
                <p className="text-sm text-fg-muted">
                    Nothing written yet. The weekly ritual will ask you here.
                </p>
            ) : (
                <div className="grid gap-2.5">
                    {entries.map(g => (
                        <div
                            key={g.id}
                            className="flex items-center gap-3 rounded-xl border border-l-4 border-line bg-surface px-4 py-3.5"
                            style={{ borderLeftColor: 'var(--color-portal-soul)' }}>
                            <span className="min-w-0 flex-1 text-sm leading-snug text-fg">
                                {g.text}
                            </span>
                            <span className="font-mono text-xs font-medium tracking-wide whitespace-nowrap text-fg-muted uppercase">
                                {formatDay(g)}
                            </span>
                            <button
                                type="button"
                                aria-label="Delete"
                                className="shrink-0 text-base leading-none text-fg-faint transition-colors hover:text-danger">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-line pt-3">
                <Eyebrow>This week</Eyebrow>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    One line per week during the ritual. No more than that — it is a check-in, not a
                    journal.
                </p>
            </div>
        </PageContent>
    );
}

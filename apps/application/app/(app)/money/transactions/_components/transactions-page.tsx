'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';
import { mockJars, mockTransactions } from '@/app/_mock';
import { CREATE_HREF, updateHref } from '@/app/_lib/create-routes';
import { isLiveData } from '@/app/_lib/preview';
import { useLiveQuery } from '@rumbelo/hooks';
import { Button, Card, EmptyState } from '@rumbelo/ui';
import { InboxSortCard } from '@/components/features/money/inbox-sort-card';
import { ListToolbar } from '@/components/layout/list-toolbar';

type Tab = 'INBOX' | 'ALL' | 'RULES';

const MATCHER_LABEL: Record<string, string> = {
  CONTAINS: 'contains',
  EQUALS: 'is',
  STARTS_WITH: 'starts with',
  REGEX: 'regex',
};

const FIELD_LABEL: Record<string, string> = {
  DESCRIPTION: 'description',
  COUNTERPARTY: 'counterparty',
  AMOUNT: 'amount',
};

export function TransactionsPageClient() {
  const api = useApi();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { householdId } = useAuth();
  const { showToast } = useAppShell();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('INBOX');
  const live = isLiveData(householdId);

  const inboxQuery = useLiveQuery(
    api.money.transactions.inbox.queryOptions({ input: { householdId: householdId! } }),
    mockTransactions.filter((t) => t.status === 'INBOX') as never,
    live,
  );

  const listQuery = useLiveQuery(
    api.money.transactions.list.queryOptions({ input: { householdId: householdId!, limit: 50 } }),
    { items: [...mockTransactions] as never, nextCursor: null },
    live,
  );

  const jarsQuery = useLiveQuery(
    api.money.jars.list.queryOptions({ input: { householdId: householdId! } }),
    mockJars as never,
    live,
  );

  const rulesQuery = useLiveQuery(
    api.money.rules.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );

  const inbox = inboxQuery.data ?? [];
  const jars = jarsQuery.data ?? mockJars;
  const jarById = new Map(jars.map((j) => [j.id, j]));
  const rules = rulesQuery.data ?? [];
  const all = (live ? (listQuery.data?.items ?? []) : [...mockTransactions])
    .slice()
    .sort((a, b) => b.bookedOn.localeCompare(a.bookedOn));

  const sortMutation = useMutation({
    mutationFn: async ({
      transactionId,
      jarId,
      createRule,
    }: {
      transactionId: string;
      jarId: string;
      createRule?: boolean;
    }) => {
      if (!householdId) throw new Error('No household');
      return client.money.transactions.sort({
        householdId,
        transactionId,
        jarId,
        createRule: createRule ?? false,
      });
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: api.money.transactions.inbox.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.transactions.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
      if (vars.createRule) {
        void queryClient.invalidateQueries({ queryKey: api.money.rules.list.key() });
        showToast('Sorted and rule saved', 'success');
      } else {
        showToast('Transaction sorted', 'success');
      }
    },
    onError: () => showToast('Sort failed', 'error'),
  });

  const replayMutation = useMutation({
    mutationFn: async () => {
      if (!householdId) throw new Error('No household');
      return client.money.rules.replay({ householdId });
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: api.money.transactions.inbox.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.transactions.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.rules.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
      showToast(
        result.sorted > 0
          ? `${result.sorted} transaction${result.sorted === 1 ? '' : 's'} sorted by rules`
          : 'No matches — inbox unchanged',
        result.sorted > 0 ? 'success' : 'info',
      );
    },
    onError: () => showToast('Apply rules failed', 'error'),
  });

  const removeRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!householdId) throw new Error('No household');
      return client.money.rules.remove({ householdId, id });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.rules.list.key() });
      showToast('Rule deleted', 'success');
    },
    onError: () => showToast('Delete failed', 'error'),
  });

  function resolveJarId(fallbackKey: string): string {
    const match = jars.find((j) => j.key === fallbackKey);
    return match?.id ?? jars[0]?.id ?? fallbackKey;
  }

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ TRANSACTIONS
        </span>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          Only what changes. Fixed costs are elsewhere.
        </h1>
        <p className="mt-2 max-w-prose text-base text-pretty text-fg-muted">
          What your bank sends over lands here first — you say which jar it came from. Connecting a
          bank is a setting.
        </p>
      </div>

      <ListToolbar
        onCreate={() => router.push(CREATE_HREF.tx)}
        secondary={
          live && (tab === 'INBOX' || tab === 'RULES') && rules.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={replayMutation.isPending}
              onClick={() => void replayMutation.mutateAsync()}
            >
              {replayMutation.isPending ? 'Working…' : 'Apply rules'}
            </Button>
          ) : null
        }
      >
        {(
          [
            ['INBOX', 'To sort'],
            ['ALL', 'All expenses'],
            ['RULES', 'Rules'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-full border font-mono text-xs font-medium tracking-wide uppercase px-4 py-2 transition-all duration-200',
              tab === id
                ? 'border-accent/40 bg-accent-soft text-accent'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {label}
            {id === 'INBOX' && inbox.length > 0 && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 font-mono text-xs text-warning">
                {inbox.length}
              </span>
            )}
            {id === 'RULES' && rules.length > 0 && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
                {rules.length}
              </span>
            )}
          </button>
        ))}
      </ListToolbar>

      {tab === 'INBOX' &&
        (inbox.length === 0 ? (
          <EmptyState
            icon="✓"
            title="Nothing left to sort."
            body="Every payment has a jar. Come back tomorrow — or connect a bank below."
          />
        ) : (
          <div className="grid gap-3">
            {inbox.map((t) => {
              const suggestedKey = t.amount > 0 ? 'NECESSITIES' : 'PLAY';
              return (
                <InboxSortCard
                  key={t.id}
                  transaction={t}
                  jars={jars}
                  suggestedJarId={resolveJarId(suggestedKey)}
                  onConfirm={
                    live
                      ? async (transactionId, jarId, createRule) => {
                          await sortMutation.mutateAsync({
                            transactionId,
                            jarId,
                            createRule,
                          });
                        }
                      : undefined
                  }
                  onChange={(tx) => {
                    router.push(updateHref('tx', tx.id));
                  }}
                />
              );
            })}
          </div>
        ))}

      {tab === 'ALL' && (
        <div className="grid gap-3">
          <p className="text-sm text-fg-muted">
            Tap a row to edit or delete it.
          </p>
          <Card className="overflow-hidden p-0">
            <div className="grid gap-px">
              {all.length === 0 ? (
                <p className="px-5 py-4 text-sm text-fg-muted">No expenses in this period yet.</p>
              ) : (
                all.map((t) => {
                  const jarId =
                    'jarId' in t && typeof t.jarId === 'string'
                      ? t.jarId
                      : 'jarKey' in t && typeof t.jarKey === 'string'
                        ? (jars.find((j) => j.key === t.jarKey)?.id ?? '')
                        : '';
                  const jar = jarId ? jarById.get(jarId) : undefined;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => router.push(updateHref('tx', t.id))}
                      className="grid w-full gap-1 border-b border-line px-5 py-3.5 text-left last:border-b-0 hover:bg-raised"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="min-w-0 flex-1 text-sm text-fg">{t.description}</span>
                        <span
                          className={cn(
                            'font-mono text-sm',
                            t.amount < 0 ? 'text-fg' : 'text-success',
                          )}
                        >
                          {formatMoney(t.amount, { signed: true })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 font-mono text-xs tracking-wide uppercase text-fg-faint">
                        <span>{t.bookedOn}</span>
                        <span>·</span>
                        <span>{t.status === 'INBOX' ? 'Inbox' : (jar?.name ?? 'No jar')}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === 'RULES' &&
        (!live ? (
          <EmptyState
            icon="◇"
            title="Sign in to manage rules."
            body="Rules automatically sort inbox transactions into the right jar."
          />
        ) : rules.length === 0 ? (
          <EmptyState
            icon="◇"
            title="No rules yet."
            body="Choose “Always this” on an inbox item to teach a rule. Manage them here afterwards."
          />
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-fg-muted">
              First match wins, by priority. Dead rules (0 hits) can safely be deleted.
            </p>
            <Card className="overflow-hidden p-0">
              <div className="grid gap-px">
                {rules.map((rule) => {
                  const jar = jarById.get(rule.jarId);
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-fg">
                          If {FIELD_LABEL[rule.field] ?? rule.field}{' '}
                          {MATCHER_LABEL[rule.matcher] ?? rule.matcher}{' '}
                          <span className="font-mono text-sm">“{rule.value}”</span>
                        </p>
                        <p className="mt-1 font-mono text-xs tracking-normal uppercase text-fg-faint">
                          → {jar?.name ?? 'Jar'} · prio {rule.priority} · {rule.hitCount} hits
                          {!rule.active ? ' · off' : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:bg-danger/10 hover:text-danger"
                        disabled={removeRuleMutation.isPending}
                        onClick={() => {
                          if (!window.confirm('Delete this sort rule?')) return;
                          void removeRuleMutation.mutateAsync(rule.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
}

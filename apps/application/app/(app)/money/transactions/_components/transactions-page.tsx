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

type Tab = 'SORTEREN' | 'ALLES' | 'REGELS';

const MATCHER_LABEL: Record<string, string> = {
  CONTAINS: 'bevat',
  EQUALS: 'is',
  STARTS_WITH: 'begint met',
  REGEX: 'regex',
};

const FIELD_LABEL: Record<string, string> = {
  DESCRIPTION: 'omschrijving',
  COUNTERPARTY: 'tegenpartij',
  AMOUNT: 'bedrag',
};

export function TransactionsPageClient() {
  const api = useApi();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { householdId } = useAuth();
  const { showToast } = useAppShell();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('SORTEREN');
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
        showToast('Gesorteerd en regel opgeslagen', 'success');
      } else {
        showToast('Transactie gesorteerd', 'success');
      }
    },
    onError: () => showToast('Sorteren mislukt', 'error'),
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
          ? `${result.sorted} transactie${result.sorted === 1 ? '' : 's'} gesorteerd via regels`
          : 'Geen matches — inbox ongewijzigd',
        result.sorted > 0 ? 'success' : 'info',
      );
    },
    onError: () => showToast('Regels toepassen mislukt', 'error'),
  });

  const removeRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!householdId) throw new Error('No household');
      return client.money.rules.remove({ householdId, id });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.rules.list.key() });
      showToast('Regel verwijderd', 'success');
    },
    onError: () => showToast('Verwijderen mislukt', 'error'),
  });

  function resolveJarId(fallbackKey: string): string {
    const match = jars.find((j) => j.key === fallbackKey);
    return match?.id ?? jars[0]?.id ?? fallbackKey;
  }

  return (
    <div className="grid animate-rise gap-8">
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ TRANSACTIES
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          Alleen wat wisselt. Vaste lasten staan elders.
        </h1>
        <p className="mt-2 max-w-[62ch] text-[15px] text-pretty text-fg-muted">
          Wat je bank doorstuurt komt hier eerst binnen — jij zegt uit welke pot het kwam.
        </p>
      </div>

      <ListToolbar
        onCreate={() => router.push(CREATE_HREF.tx)}
        secondary={
          live && (tab === 'SORTEREN' || tab === 'REGELS') && rules.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={replayMutation.isPending}
              onClick={() => void replayMutation.mutateAsync()}
            >
              {replayMutation.isPending ? 'Bezig…' : 'Regels toepassen'}
            </Button>
          ) : null
        }
      >
        {(
          [
            ['SORTEREN', 'Te sorteren'],
            ['ALLES', 'Alle uitgaven'],
            ['REGELS', 'Regels'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-full border font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200',
              tab === id
                ? 'border-accent/40 bg-accent-soft text-accent'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {label}
            {id === 'SORTEREN' && inbox.length > 0 && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 font-mono text-[9.5px] text-warning">
                {inbox.length}
              </span>
            )}
            {id === 'REGELS' && rules.length > 0 && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9.5px] text-accent">
                {rules.length}
              </span>
            )}
          </button>
        ))}
      </ListToolbar>

      {tab === 'SORTEREN' &&
        (inbox.length === 0 ? (
          <EmptyState
            icon="✓"
            title="Niets meer te sorteren."
            body="Elke betaling heeft een pot. Kom morgen terug — of koppel hieronder een bank."
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

      {tab === 'ALLES' && (
        <div className="grid gap-3">
          <p className="text-[13.5px] text-fg-muted">
            Tik op een regel om hem aan te passen of te verwijderen.
          </p>
          <Card className="overflow-hidden p-0">
            <div className="grid gap-px">
              {all.length === 0 ? (
                <p className="px-5 py-4 text-sm text-fg-muted">Nog geen uitgaven in deze periode.</p>
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
                        <span className="min-w-0 flex-1 text-[14px] text-fg">{t.description}</span>
                        <span
                          className={cn(
                            'font-mono text-[14px]',
                            t.amount < 0 ? 'text-fg' : 'text-success',
                          )}
                        >
                          {formatMoney(t.amount, { signed: true })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 font-mono text-[10px] tracking-[0.08em] uppercase text-fg-faint">
                        <span>{t.bookedOn}</span>
                        <span>·</span>
                        <span>{t.status === 'INBOX' ? 'Inbox' : (jar?.name ?? 'Geen pot')}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === 'REGELS' &&
        (!live ? (
          <EmptyState
            icon="◇"
            title="Log in om regels te beheren."
            body="Regels sorteren inbox-transacties automatisch naar de juiste pot."
          />
        ) : rules.length === 0 ? (
          <EmptyState
            icon="◇"
            title="Nog geen regels."
            body="Kies “Altijd zo” bij een inbox-item om een regel te leren. Daarna kun je ze hier beheren."
          />
        ) : (
          <div className="grid gap-3">
            <p className="text-[13.5px] text-fg-muted">
              Eerste match wint, op prioriteit. Dead rules (0 hits) kun je gerust weggooien.
            </p>
            <Card className="overflow-hidden p-0">
              <div className="grid gap-px">
                {rules.map((rule) => {
                  const jar = jarById.get(rule.jarId);
                  return (
                    <div
                      key={rule.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-5 py-3.5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] text-fg">
                          Als {FIELD_LABEL[rule.field] ?? rule.field}{' '}
                          {MATCHER_LABEL[rule.matcher] ?? rule.matcher}{' '}
                          <span className="font-mono text-[13px]">“{rule.value}”</span>
                        </p>
                        <p className="mt-1 font-mono text-[10px] tracking-[0.06em] uppercase text-fg-faint">
                          → {jar?.name ?? 'Pot'} · prio {rule.priority} · {rule.hitCount} hits
                          {!rule.active ? ' · uit' : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:bg-danger/10 hover:text-danger"
                        disabled={removeRuleMutation.isPending}
                        onClick={() => {
                          if (!window.confirm('Deze sorteerregel verwijderen?')) return;
                          void removeRuleMutation.mutateAsync(rule.id);
                        }}
                      >
                        Verwijder
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

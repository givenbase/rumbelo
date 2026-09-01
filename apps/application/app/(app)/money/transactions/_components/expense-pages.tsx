'use client';

import { ExpenseForm } from '@/components/features/forms/expense-form';
import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useApi } from '@rumbelo/contracts/react';
import { useLiveQuery } from '@rumbelo/hooks';

export function ExpenseCreatePage({ embedded = false }: { embedded?: boolean }) {
  return <ExpenseForm mode="create" embedded={embedded} />;
}

export function ExpenseUpdatePage({
  id,
  embedded = false,
}: {
  id: string;
  embedded?: boolean;
}) {
  const api = useApi();
  const { householdId } = useAuth();
  const live = isLiveData(householdId);

  const listQuery = useLiveQuery(
    api.money.transactions.list.queryOptions({
      input: { householdId: householdId!, limit: 100 },
    }),
    { items: [], nextCursor: null },
    live,
  );
  const inboxQuery = useLiveQuery(
    api.money.transactions.inbox.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );

  const fromList = listQuery.data?.items?.find((t) => t.id === id);
  const fromInbox = (inboxQuery.data ?? []).find((t) => t.id === id);
  const tx = fromList ?? fromInbox;

  if (live && (listQuery.isLoading || inboxQuery.isLoading) && !tx) {
    return <p className="text-sm text-fg-muted">Loading…</p>;
  }
  if (!tx) {
    return <p className="text-sm text-fg-muted">Transaction not found.</p>;
  }

  return (
    <ExpenseForm
      mode="edit"
      entityId={tx.id}
      embedded={embedded}
      defaultValues={{
        description: tx.description,
        amount: centsToEurosInput(Math.abs(tx.amount)),
        jarId: tx.jarId ?? '',
      }}
    />
  );
}

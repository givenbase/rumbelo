'use client';

import { DebtForm } from '@/components/features/forms/debt-form';
import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useApi } from '@rumbelo/contracts/react';
import { useLiveQuery } from '@rumbelo/hooks';

export function DebtCreatePage({ embedded = false }: { embedded?: boolean }) {
  return <DebtForm mode="create" embedded={embedded} />;
}

export function DebtUpdatePage({
  id,
  embedded = false,
}: {
  id: string;
  embedded?: boolean;
}) {
  const api = useApi();
  const { householdId } = useAuth();
  const live = isLiveData(householdId);

  const query = useLiveQuery(
    api.money.debts.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );
  const row = (query.data ?? []).find((d) => d.id === id);

  if (live && query.isLoading && !row) {
    return <p className="text-sm text-fg-muted">Laden…</p>;
  }
  if (!row) {
    return <p className="text-sm text-fg-muted">Schuld niet gevonden.</p>;
  }

  return (
    <DebtForm
      mode="edit"
      entityId={row.id}
      embedded={embedded}
      defaultValues={{
        name: row.name,
        balance: centsToEurosInput(row.balance),
        interestRate: String(row.interestRate),
        minimumPayment: centsToEurosInput(row.minimumPayment),
        kind: row.kind,
      }}
    />
  );
}

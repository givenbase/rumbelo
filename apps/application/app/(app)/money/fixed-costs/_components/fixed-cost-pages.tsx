'use client';

import { FixedCostForm } from '@/components/features/forms/fixed-cost-form';
import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useApi } from '@rumbelo/contracts/react';
import { useLiveQuery } from '@rumbelo/hooks';

export function FixedCostCreatePage({ embedded = false }: { embedded?: boolean }) {
  return <FixedCostForm mode="create" embedded={embedded} />;
}

export function FixedCostUpdatePage({
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
    api.money.fixedCosts.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );
  const row = (query.data ?? []).find((f) => f.id === id);

  if (live && query.isLoading && !row) {
    return <p className="text-sm text-fg-muted">Laden…</p>;
  }
  if (!row) {
    return <p className="text-sm text-fg-muted">Vaste last niet gevonden.</p>;
  }

  return (
    <FixedCostForm
      mode="edit"
      entityId={row.id}
      embedded={embedded}
      defaultValues={{
        name: row.name,
        amount: centsToEurosInput(Math.abs(row.amount)),
        jarId: row.jarId,
        dueDay: row.dueDay != null ? String(row.dueDay) : '',
      }}
    />
  );
}

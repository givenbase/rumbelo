'use client';

import { GoalForm } from '@/components/features/forms/goal-form';
import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useApi } from '@rumbelo/contracts/react';
import { useLiveQuery } from '@rumbelo/hooks';

export function GoalCreatePage({ embedded = false }: { embedded?: boolean }) {
  return <GoalForm mode="create" embedded={embedded} />;
}

export function GoalUpdatePage({
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
    api.money.goals.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );
  const row = (query.data ?? []).find((g) => g.id === id);

  if (live && query.isLoading && !row) {
    return <p className="text-sm text-fg-muted">Loading…</p>;
  }
  if (!row) {
    return <p className="text-sm text-fg-muted">Goal not found.</p>;
  }

  return (
    <GoalForm
      mode="edit"
      entityId={row.id}
      embedded={embedded}
      defaultValues={{
        name: row.name,
        target: centsToEurosInput(row.target),
        monthlyContribution: centsToEurosInput(row.monthlyContribution),
        jarId: row.jarId ?? '',
        why: row.why ?? '',
      }}
    />
  );
}

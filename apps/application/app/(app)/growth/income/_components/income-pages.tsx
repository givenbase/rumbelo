'use client';

import { useApi } from '@rumbelo/contracts/react';

import { useLiveQuery } from '@rumbelo/hooks';

import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { IncomeForm } from '@/components/features/forms/income-form';
import { useAuth } from '@/components/features/shell/auth-provider';

export function IncomeCreatePage({ embedded = false }: { embedded?: boolean }) {
    return <IncomeForm mode="create" embedded={embedded} />;
}

export function IncomeUpdatePage({ id, embedded = false }: { id: string; embedded?: boolean }) {
    const api = useApi();
    const { householdId } = useAuth();
    const live = isLiveData(householdId);

    const query = useLiveQuery(
        api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );
    const row = (query.data ?? []).find(s => s.id === id);

    if (live && query.isLoading && !row) {
        return <p className="text-sm text-fg-muted">Loading…</p>;
    }
    if (!row) {
        return <p className="text-sm text-fg-muted">Income source not found.</p>;
    }

    return (
        <IncomeForm
            mode="edit"
            entityId={row.id}
            embedded={embedded}
            defaultValues={{
                name: row.name,
                amount: centsToEurosInput(row.amount),
                kind: row.kind,
            }}
        />
    );
}

'use client';

import { useApi } from '@/app/_lib/api-hooks';

import { useLiveQuery } from '@rumbelo/hooks';

import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { mockFixedCosts, mockJars } from '@/app/_mock';
import { FixedCostForm } from '@/components/features/forms/fixed-cost-form';
import { useAuth } from '@/components/features/shell/auth-provider';

const mockFixedCostRows = mockFixedCosts.map(f => ({
    id: f.id,
    name: f.name,
    amount: f.amount,
    dueDay: f.dueDay,
    jarId: mockJars.find(j => j.key === f.jarKey)?.id ?? '',
}));

export function FixedCostCreatePage({ embedded = false }: { embedded?: boolean }) {
    return <FixedCostForm mode="create" embedded={embedded} />;
}

export function FixedCostUpdatePage({ id, embedded = false }: { id: string; embedded?: boolean }) {
    const api = useApi();
    const { householdId } = useAuth();
    const live = isLiveData(householdId);

    const query = useLiveQuery(
        api.money.fixedCosts.list.queryOptions({ input: { householdId: householdId! } }),
        mockFixedCostRows as never,
        live
    );
    const row = (query.data ?? mockFixedCostRows).find(f => f.id === id);

    if (live && query.isLoading && !row) {
        return <p className="text-sm text-fg-muted">Loading…</p>;
    }
    if (!row) {
        return <p className="text-sm text-fg-muted">Fixed cost not found.</p>;
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
                dueDay: row.dueDay !== null ? String(row.dueDay) : '',
            }}
        />
    );
}

'use client';

import { useApi } from '@/app/_lib/api-hooks';

import { useLiveQuery } from '@rumbelo/hooks';

import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { mockJars, mockTransactions } from '@/app/_mock';
import { ExpenseForm } from '@/components/features/forms/expense-form';
import { useAuth } from '@/components/features/shell/auth-provider';

const mockTxRows = mockTransactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    jarId: t.jarKey ? (mockJars.find(j => j.key === t.jarKey)?.id ?? null) : null,
    status: t.status,
}));

const mockInbox = mockTxRows.filter(t => t.status === 'INBOX');
const mockList = { items: mockTxRows, nextCursor: null };

export function ExpenseCreatePage({
    embedded = false,
    defaultJarId,
}: {
    embedded?: boolean;
    defaultJarId?: string;
}) {
    return (
        <ExpenseForm
            mode="create"
            embedded={embedded}
            defaultValues={defaultJarId ? { jarId: defaultJarId } : undefined}
        />
    );
}

export function ExpenseUpdatePage({ id, embedded = false }: { id: string; embedded?: boolean }) {
    const api = useApi();
    const { householdId } = useAuth();
    const live = isLiveData(householdId);

    const listQuery = useLiveQuery(
        api.money.transactions.list.queryOptions({
            input: { householdId: householdId!, limit: 100 },
        }),
        mockList as never,
        live
    );
    const inboxQuery = useLiveQuery(
        api.money.transactions.inbox.queryOptions({ input: { householdId: householdId! } }),
        mockInbox as never,
        live
    );

    const fromList = listQuery.data?.items?.find(t => t.id === id);
    const fromInbox = (inboxQuery.data ?? []).find(t => t.id === id);
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

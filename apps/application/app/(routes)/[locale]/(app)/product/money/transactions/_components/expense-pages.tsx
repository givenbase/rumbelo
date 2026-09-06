'use client';

import { useApi } from '@/app/_lib/api-hooks';

import { useLiveQuery } from '@rumbelo/hooks';

import type { Transaction } from '@rumbelo/contracts';

import { centsToEurosInput } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { ExpenseForm } from '@/components/features/forms/expense-form';
import { useAuth } from '@/components/features/shell/auth-provider';

const EMPTY_TRANSACTIONS: Transaction[] = [];
const EMPTY_TRANSACTION_PAGE = { items: EMPTY_TRANSACTIONS, nextCursor: null };

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
        EMPTY_TRANSACTION_PAGE,
        live
    );
    const inboxQuery = useLiveQuery(
        api.money.transactions.inbox.queryOptions({ input: { householdId: householdId! } }),
        EMPTY_TRANSACTIONS,
        live
    );

    const fromList = listQuery.data?.items?.find(transaction => transaction.id === id);
    const fromInbox = (inboxQuery.data ?? []).find(transaction => transaction.id === id);
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
                counterparty: tx.counterparty,
                note: tx.note ?? '',
                categoryId: tx.categoryId,
                amount: centsToEurosInput(Math.abs(tx.amount)),
                jarId: tx.jarId ?? '',
            }}
        />
    );
}

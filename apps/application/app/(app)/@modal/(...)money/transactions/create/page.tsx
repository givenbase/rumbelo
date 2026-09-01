'use client';

import { TxCreateModalShell } from '@/components/layout/create-route-modals';

/** Quick Add + cross-route: expense create from outside Spending list. */
export default function Page() {
    return <TxCreateModalShell closeHref="/money/transactions" />;
}

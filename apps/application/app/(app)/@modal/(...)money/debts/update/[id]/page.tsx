'use client';

import { use } from 'react';

import { DebtUpdateModalShell } from '@/components/layout/create-route-modals';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <DebtUpdateModalShell closeHref="/money/debts" id={id} />;
}

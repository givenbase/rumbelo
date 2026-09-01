'use client';

import { useSearchParams } from 'next/navigation';

import { TxCreateModalShell } from '@/components/layout/create-route-modals';

/** Intercepts /money/transactions/create when opened from Jars (jar card “Add a spend”). */
export default function Page() {
    const searchParams = useSearchParams();
    const jarId = searchParams.get('jarId') ?? undefined;

    return <TxCreateModalShell closeHref="/money/jars" defaultJarId={jarId} />;
}

'use client';

import { useSearchParams } from 'next/navigation';

import type { TxDirection } from '@/app/_lib/create-routes';
import { TxCreateModalShell } from '@/components/layout/create-route-modals';

function parseDirection(value: string | null): TxDirection {
    return value === 'in' ? 'in' : 'out';
}

export default function Page() {
    const searchParams = useSearchParams();
    const jarId = searchParams.get('jarId') ?? undefined;
    const direction = parseDirection(searchParams.get('direction'));

    return (
        <TxCreateModalShell
            closeHref="/product/money/transactions"
            defaultJarId={jarId}
            direction={direction}
        />
    );
}

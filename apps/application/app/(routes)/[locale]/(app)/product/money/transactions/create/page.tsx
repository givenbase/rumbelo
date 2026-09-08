'use client';

import { useSearchParams } from 'next/navigation';

import type { TxDirection } from '@/app/_lib/create-routes';
import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { ExpenseCreatePage } from '../_components/expense-pages';

function parseDirection(value: string | null): TxDirection {
    return value === 'in' ? 'in' : 'out';
}

export default function Page() {
    const searchParams = useSearchParams();
    const jarId = searchParams.get('jarId') ?? undefined;
    const direction = parseDirection(searchParams.get('direction'));
    const meta = formRoute('txCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <ExpenseCreatePage embedded defaultJarId={jarId} direction={direction} />
        </FormRoutePageShell>
    );
}

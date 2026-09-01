'use client';

import { use } from 'react';

import { IncomeUpdateModalShell } from '@/components/layout/create-route-modals';

/** Intercepts /growth/income/update/[id] from Fixed costs (In tab). */
export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <IncomeUpdateModalShell closeHref="/money/fixed-costs" id={id} />;
}

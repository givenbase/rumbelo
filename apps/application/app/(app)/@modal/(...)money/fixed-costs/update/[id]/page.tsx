'use client';

import { use } from 'react';

import { FixedCostUpdateModalShell } from '@/components/layout/create-route-modals';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <FixedCostUpdateModalShell closeHref="/money/fixed-costs" id={id} />;
}

'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { FixedCostCreatePage } from '../../_components/fixed-cost-pages';

export default function Page() {
    return (
        <RouteModalShell
            closeHref="/money/fixed-costs"
            title="New fixed cost"
            description="What leaves a jar every month?">
            <FixedCostCreatePage embedded />
        </RouteModalShell>
    );
}

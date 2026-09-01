'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { GoalCreatePage } from '../../_components/goal-pages';

export default function Page() {
    return (
        <RouteModalShell
            closeHref="/growth/goals"
            title="New goal"
            description="Give savings a destination.">
            <GoalCreatePage embedded />
        </RouteModalShell>
    );
}

'use client';

import { use } from 'react';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { GoalUpdatePage } from '../../../_components/goal-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/growth/goals" title="Edit goal">
      <GoalUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

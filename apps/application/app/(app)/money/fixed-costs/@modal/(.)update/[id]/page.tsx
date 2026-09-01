'use client';

import { use } from 'react';
import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { FixedCostUpdatePage } from '../../../_components/fixed-cost-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/money/fixed-costs" title="Vaste last bewerken">
      <FixedCostUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

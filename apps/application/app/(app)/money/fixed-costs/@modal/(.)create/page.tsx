'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { FixedCostCreatePage } from '../../_components/fixed-cost-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/fixed-costs" title="Nieuwe vaste last" description="Wat trekt er maandelijks uit een pot?">
      <FixedCostCreatePage embedded />
    </RouteModalShell>
  );
}

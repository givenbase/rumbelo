'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { DebtCreatePage } from '../../_components/debt-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/debts" title="New debt" description="Put the debt on the board so you can pay it off.">
      <DebtCreatePage embedded />
    </RouteModalShell>
  );
}

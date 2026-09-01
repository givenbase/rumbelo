'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { DebtCreatePage } from '../../_components/debt-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/debts" title="Nieuwe schuld" description="Zet de schuld op de kaart zodat je hem kunt aflossen.">
      <DebtCreatePage embedded />
    </RouteModalShell>
  );
}

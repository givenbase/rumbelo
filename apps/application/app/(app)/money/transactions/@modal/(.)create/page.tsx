'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { ExpenseCreatePage } from '../../_components/expense-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/transactions" title="Nieuwe uitgave" description="Noteer wat eruit ging en kies de pot.">
      <ExpenseCreatePage embedded />
    </RouteModalShell>
  );
}

'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { ExpenseCreatePage } from '../../_components/expense-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/transactions" title="New expense" description="Note what went out and choose the jar.">
      <ExpenseCreatePage embedded />
    </RouteModalShell>
  );
}

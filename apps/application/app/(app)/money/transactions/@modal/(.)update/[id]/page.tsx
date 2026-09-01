'use client';

import { use } from 'react';
import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { ExpenseUpdatePage } from '../../../_components/expense-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/money/transactions" title="Uitgave bewerken" description="Pas bedrag, omschrijving of pot aan.">
      <ExpenseUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

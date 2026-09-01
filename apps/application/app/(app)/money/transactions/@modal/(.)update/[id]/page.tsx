'use client';

import { use } from 'react';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { ExpenseUpdatePage } from '../../../_components/expense-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/money/transactions" title="Edit expense" description="Update amount, description or jar.">
      <ExpenseUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

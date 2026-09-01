'use client';

import { use } from 'react';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { DebtUpdatePage } from '../../../_components/debt-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/money/debts" title="Edit debt">
      <DebtUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

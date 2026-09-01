'use client';

import { use } from 'react';
import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { IncomeUpdatePage } from '../../../_components/income-pages';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RouteModalShell closeHref="/growth/income" title="Edit income">
      <IncomeUpdatePage id={id} embedded />
    </RouteModalShell>
  );
}

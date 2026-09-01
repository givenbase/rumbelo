'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';

import { IncomeCreatePage } from '../../_components/income-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/growth/income" title="New income" description="Add an income source that feeds your jars.">
      <IncomeCreatePage embedded />
    </RouteModalShell>
  );
}

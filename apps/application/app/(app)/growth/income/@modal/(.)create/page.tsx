'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { IncomeCreatePage } from '../../_components/income-pages';

export default function Page() {
  return (
    <RouteModalShell closeHref="/growth/income" title="Nieuw inkomen" description="Voeg een inkomstenbron toe die de potten voedt.">
      <IncomeCreatePage embedded />
    </RouteModalShell>
  );
}

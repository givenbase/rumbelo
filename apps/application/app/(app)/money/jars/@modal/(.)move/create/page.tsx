'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/jars" title="Verplaatsen" description="Verplaats geld tussen potten.">
      <SheetStubForm kind="move" mode="create" embedded />
    </RouteModalShell>
  );
}

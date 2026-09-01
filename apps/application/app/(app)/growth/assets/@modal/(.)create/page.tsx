'use client';

import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';
import { RouteModalShell } from '@/components/layout/route-modal-shell';

export default function Page() {
  return (
    <RouteModalShell closeHref="/growth/board" title="New asset">
      <SheetStubForm kind="asset" mode="create" embedded />
    </RouteModalShell>
  );
}

'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export default function Page() {
  return (
    <RouteModalShell closeHref="/growth/board" title="New asset">
      <SheetStubForm kind="asset" mode="create" embedded />
    </RouteModalShell>
  );
}

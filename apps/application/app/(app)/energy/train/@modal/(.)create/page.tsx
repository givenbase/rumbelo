'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export default function Page() {
  return (
    <RouteModalShell closeHref="/energy/train" title="New training">
      <SheetStubForm kind="session" mode="create" embedded />
    </RouteModalShell>
  );
}

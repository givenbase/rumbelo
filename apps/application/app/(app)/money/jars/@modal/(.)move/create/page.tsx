'use client';

import { RouteModalShell } from '@/components/layout/route-modal-shell';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export default function Page() {
  return (
    <RouteModalShell closeHref="/money/jars" title="Move money" description="Move money between jars.">
      <SheetStubForm kind="move" mode="create" embedded />
    </RouteModalShell>
  );
}

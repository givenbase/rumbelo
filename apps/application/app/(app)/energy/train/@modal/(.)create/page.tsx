'use client';

import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';
import { RouteModalShell } from '@/components/layout/route-modal-shell';

export default function Page() {
    return (
        <RouteModalShell closeHref="/energy/train" title="New training">
            <SheetStubForm kind="session" mode="create" embedded />
        </RouteModalShell>
    );
}

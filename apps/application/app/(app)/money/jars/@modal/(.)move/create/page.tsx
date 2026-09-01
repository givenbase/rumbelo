'use client';

import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';
import { RouteModalShell } from '@/components/layout/route-modal-shell';

export default function Page() {
    return (
        <RouteModalShell
            closeHref="/money/jars"
            title="Move money"
            description="Move money between jars.">
            <SheetStubForm kind="move" mode="create" embedded />
        </RouteModalShell>
    );
}

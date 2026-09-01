import { Suspense } from 'react';

import { AppShell } from '@/components/layout/shell';

export default function AppLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <Suspense fallback={null}>
            <AppShell>
                {children}
                {modal}
            </AppShell>
        </Suspense>
    );
}

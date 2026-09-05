import { Suspense } from 'react';

import { VerifyPanel } from './_components/verify-panel';

export const metadata = { title: 'Verify' };

export default function VerifyPage() {
    return (
        <Suspense fallback={null}>
            <VerifyPanel />
        </Suspense>
    );
}

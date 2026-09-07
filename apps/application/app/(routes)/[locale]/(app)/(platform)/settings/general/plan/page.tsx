import { Suspense } from 'react';

import { PlanSettings } from '../../_components/settings-panels';

export default function PlanSettingsPage() {
    return (
        <Suspense fallback={null}>
            <PlanSettings />
        </Suspense>
    );
}

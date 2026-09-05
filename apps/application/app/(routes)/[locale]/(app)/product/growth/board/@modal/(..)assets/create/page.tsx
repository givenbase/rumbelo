'use client';

import { AssetCreateModalShell } from '@/components/layout/create-route-modals';

/** Intercepts /growth/assets/create when opened from Net worth board. */
export default function Page() {
    return <AssetCreateModalShell closeHref="/product/growth/board" />;
}

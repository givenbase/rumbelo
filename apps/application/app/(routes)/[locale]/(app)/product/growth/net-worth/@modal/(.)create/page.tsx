'use client';

import { AssetCreateModalShell } from '@/components/layout/create-route-modals';

/** Intercepts /growth/net-worth/create when opened from Net worth. */
export default function Page() {
    return <AssetCreateModalShell closeHref="/product/growth/net-worth" />;
}

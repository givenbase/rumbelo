import { soulPortalHub } from '@/app/_lib/portal-hubs';
import { PortalHub } from '@/components/features/home/portal-hub';

export const metadata = { title: 'Soul · overview' };

export default function SoulPage() {
    return <PortalHub {...soulPortalHub} />;
}

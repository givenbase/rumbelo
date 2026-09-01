import { energyPortalHub } from '@/app/_lib/portal-hubs';
import { PortalHub } from '@/components/features/home/portal-hub';

export const metadata = { title: 'Energy · overview' };

export default function EnergyPage() {
    return <PortalHub {...energyPortalHub} />;
}

import { moneyPortalHub } from '@/app/_lib/portal-hubs';
import { PortalHub } from '@/components/features/home/portal-hub';

export const metadata = { title: 'Money' };

export default function MoneyPage() {
    return <PortalHub {...moneyPortalHub} />;
}

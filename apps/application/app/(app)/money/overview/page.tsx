import { moneyPortalHub } from '@/app/_lib/portal-hubs';
import { PortalHub } from '@/components/features/home/portal-hub';

export const metadata = { title: 'Money · overview' };

export default function MoneyOverviewPage() {
  return <PortalHub {...moneyPortalHub} />;
}

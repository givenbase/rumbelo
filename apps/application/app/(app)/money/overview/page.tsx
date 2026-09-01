import { PortalHub } from '@/components/features/home/portal-hub';
import { moneyPortalHub } from '@/app/_lib/portal-hubs';

export const metadata = { title: 'Money · overview' };

export default function MoneyOverviewPage() {
  return <PortalHub {...moneyPortalHub} />;
}

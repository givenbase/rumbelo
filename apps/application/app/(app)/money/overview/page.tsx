import { PortalHub } from '@/components/features/home/portal-hub';
import { moneyPortalHub } from '@/app/_lib/portal-hubs';

export const metadata = { title: 'Geld · overzicht' };

export default function MoneyOverviewPage() {
  return <PortalHub {...moneyPortalHub} />;
}

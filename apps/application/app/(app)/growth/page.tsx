import { PortalHub } from '@/components/features/home/portal-hub';
import { growthPortalHub } from '@/app/_lib/portal-hubs';

export const metadata = { title: 'Growth · overview' };

export default function GrowthPage() {
  return <PortalHub {...growthPortalHub} />;
}

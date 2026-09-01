import { PortalHub } from '@/components/features/home/portal-hub';
import { growthPortalHub } from '@/app/_lib/portal-hubs';

export const metadata = { title: 'Groei · overzicht' };

export default function GrowthPage() {
  return <PortalHub {...growthPortalHub} />;
}

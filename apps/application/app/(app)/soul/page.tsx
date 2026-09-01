import { PortalHub } from '@/components/features/home/portal-hub';
import { soulPortalHub } from '@/app/_lib/portal-hubs';

export const metadata = { title: 'Ziel · overzicht' };

export default function SoulPage() {
  return <PortalHub {...soulPortalHub} />;
}

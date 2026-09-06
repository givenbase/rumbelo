import { CAPABILITIES } from '@/app/_lib/plan';
import { RequireCapability } from '@/components/features/shell/require-capability';

export default function ChakraLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireCapability capabilityKey={CAPABILITIES.soulChakra}>{children}</RequireCapability>
    );
}

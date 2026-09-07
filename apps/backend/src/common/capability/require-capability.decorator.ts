import { SetMetadata } from '@nestjs/common';
import type { CapabilityKey } from '@rumbelo/contracts';

export const REQUIRE_CAPABILITY_KEY = 'requireCapability';

/**
 * Declarative plan gate — mirrors frontend RequireCapability.
 * Apply on controller class or method; CapabilityInterceptor enforces.
 */
export const RequireCapability = (...keys: CapabilityKey[]) =>
    SetMetadata(REQUIRE_CAPABILITY_KEY, keys);

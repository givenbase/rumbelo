import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';

/**
 * User Module — the PERSON half of the auth plane.
 *
 *   managed/   Better Auth writes: user, session, provider, verification, two-factor
 *   account/   Rumbelo writes: legal names, DOB, prefs (`account`, `account-settings`)
 *
 * Managed entities are read-only mirrors discovered by MikroORM convention;
 * they have no module or controller of their own.
 */
@Module({
    imports: [AccountModule],
    exports: [AccountModule],
})
export class UserModule {}

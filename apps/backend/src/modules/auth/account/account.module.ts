import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AccountSettingsModule } from './account-settings';
import { Account } from './account.entity';

/**
 * Account Module
 *
 * Rumbelo-owned person data (not better-auth machinery, not household board).
 * Board money settings stay under platform/household.
 */
@Module({
    imports: [MikroOrmModule.forFeature([Account]), AccountSettingsModule],
    exports: [AccountSettingsModule],
})
export class AccountModule {}

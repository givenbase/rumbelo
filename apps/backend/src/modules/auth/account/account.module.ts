import { Module } from '@nestjs/common';

import { AccountSettingsModule } from './account-settings/account-settings.module';

/**
 * Account module — Rumbelo-owned person data (profile prefs that are not auth
 * machinery). Board money settings stay under platform/household.
 */
@Module({
    imports: [AccountSettingsModule],
    exports: [AccountSettingsModule],
})
export class AccountModule {}

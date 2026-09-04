import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AccountSettingsController } from './account-settings.controller';
import { AccountSettings } from './account-settings.entity';
import { AccountSettingsService } from './account-settings.service';

/**
 * Account Settings Module
 *
 * Registers AccountSettings with MikroORM and exports AccountSettingsService
 * for onboarding and other callers that need person-scoped prefs.
 */
@Module({
    imports: [MikroOrmModule.forFeature([AccountSettings])],
    controllers: [AccountSettingsController],
    providers: [AccountSettingsService],
    exports: [AccountSettingsService],
})
export class AccountSettingsModule {}

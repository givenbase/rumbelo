import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AuthMember } from '../managed/member/auth-member.entity';
import { HouseholdBillingModule } from '../household-billing/household-billing.module';
import { HouseholdBilling } from '../household-billing/household-billing.entity';
import { HouseholdSettingsController } from './household-settings.controller';
import { HouseholdSettings } from './household-settings.entity';
import { HouseholdSettingsService } from './household-settings.service';

/**
 * Household Settings Module
 *
 * Registers HouseholdSettings with MikroORM and exports HouseholdSettingsService
 * for onboarding, dashboard and other callers that need board prefs.
 * Plan tier is composed from {@link HouseholdBillingModule}.
 */
@Module({
    imports: [
        MikroOrmModule.forFeature([HouseholdSettings, HouseholdBilling, AuthMember]),
        HouseholdBillingModule,
    ],
    controllers: [HouseholdSettingsController],
    providers: [HouseholdSettingsService],
    exports: [HouseholdSettingsService, HouseholdBillingModule],
})
export class HouseholdSettingsModule {}

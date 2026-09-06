import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthNestModule } from '@thallesp/nestjs-better-auth';

import { EmailModule } from '../../backoffice/communication/email';
import { JarTemplateModule } from '../../backoffice/product/money/template/jar/jar.module';
import { AccountSettingsModule } from '../user/account/account-settings/account-settings.module';
import { HouseholdSettingsModule } from './household-settings/household-settings.module';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';

/**
 * Household Module — the GROUP half of the auth plane.
 *
 *   managed/             Better Auth writes: household, member, invitation
 *   household-settings/  Rumbelo writes: board prefs (currency, plan, rituals)
 *   household.*          orchestration over Better Auth's organization API
 */
@Module({
    imports: [
        BetterAuthNestModule,
        HouseholdSettingsModule,
        AccountSettingsModule,
        JarTemplateModule,
        EmailModule,
    ],
    controllers: [HouseholdController],
    providers: [HouseholdService],
    exports: [HouseholdService, HouseholdSettingsModule],
})
export class HouseholdModule {}

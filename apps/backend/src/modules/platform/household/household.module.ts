import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { AccountSettingsModule } from '../../auth/account/account-settings/account-settings.module';
import { JarTemplateModule } from '../../backoffice/reference/jar-template/jar-template.module';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';

@Module({
    imports: [BetterAuthModule, AccountSettingsModule, JarTemplateModule],
    controllers: [HouseholdController],
    providers: [HouseholdService],
    exports: [HouseholdService],
})
export class HouseholdModule {}

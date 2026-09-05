import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { AccountSettingsModule } from '../../../auth/account/account-settings/account-settings.module';
import { EmailModule } from '../../../backoffice/communication/email';
import { JarTemplateModule } from '../../../backoffice/reference/template/jar/jar.module';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';

@Module({
    imports: [BetterAuthModule, AccountSettingsModule, JarTemplateModule, EmailModule],
    controllers: [HouseholdController],
    providers: [HouseholdService],
    exports: [HouseholdService],
})
export class HouseholdModule {}

import { Module } from '@nestjs/common';

import { HouseholdSettingsModule } from '../../../auth/household/household-settings/household-settings.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
    imports: [HouseholdSettingsModule],
    controllers: [BillingController, StripeWebhookController],
    providers: [BillingService],
    exports: [BillingService],
})
export class BillingModule {}

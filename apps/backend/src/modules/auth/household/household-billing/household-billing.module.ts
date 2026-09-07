import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { HouseholdBilling } from './household-billing.entity';
import { HouseholdBillingService } from './household-billing.service';

/**
 * Household Billing Module — commercial subscription state (plan + Stripe ids).
 */
@Module({
    imports: [MikroOrmModule.forFeature([HouseholdBilling])],
    providers: [HouseholdBillingService],
    exports: [HouseholdBillingService],
})
export class HouseholdBillingModule {}

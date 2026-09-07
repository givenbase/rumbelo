import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HouseholdBillingModule } from '../../modules/auth/household/household-billing/household-billing.module';
import { CapabilityInterceptor } from './capability.interceptor';
import { PlanAccessService } from './plan-access.service';

@Global()
@Module({
    imports: [HouseholdBillingModule],
    providers: [
        PlanAccessService,
        CapabilityInterceptor,
        { provide: APP_INTERCEPTOR, useClass: CapabilityInterceptor },
    ],
    exports: [PlanAccessService],
})
export class CapabilityAccessModule {}

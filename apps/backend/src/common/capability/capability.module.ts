import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HouseholdSettingsModule } from '../../modules/auth/household/household-settings/household-settings.module';
import { CapabilityInterceptor } from './capability.interceptor';
import { PlanAccessService } from './plan-access.service';

@Global()
@Module({
    imports: [HouseholdSettingsModule],
    providers: [
        PlanAccessService,
        CapabilityInterceptor,
        { provide: APP_INTERCEPTOR, useClass: CapabilityInterceptor },
    ],
    exports: [PlanAccessService],
})
export class CapabilityAccessModule {}

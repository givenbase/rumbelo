import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { HouseholdController } from './household.controller.js';
import { HouseholdService } from './household.service.js';

@Module({
  imports: [BetterAuthModule],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [HouseholdService],
})
export class HouseholdModule {}

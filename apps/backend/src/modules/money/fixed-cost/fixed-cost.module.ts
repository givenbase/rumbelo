import { Module } from '@nestjs/common';
import { FixedCostController } from './fixed-cost.controller.js';
import { FixedCostService } from './fixed-cost.service.js';

@Module({
  controllers: [FixedCostController],
  providers: [FixedCostService],
  exports: [FixedCostService],
})
export class FixedCostModule {}

import { Module } from '@nestjs/common';

import { CoachModule } from '../../coach/coach.module.js';
import { HouseholdModule } from '../../household/household.module.js';
import { JarModule } from '../jar/jar.module.js';
import { TransactionModule } from '../transaction/transaction.module.js';
import { TurnModule } from '../turn/turn.module.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

/** Depends on the aggregates it composes rather than reaching into their tables. */
@Module({
  imports: [JarModule, TurnModule, CoachModule, TransactionModule, HouseholdModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

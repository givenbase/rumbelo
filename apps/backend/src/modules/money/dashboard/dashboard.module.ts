import { Module } from '@nestjs/common';

import { CoachModule } from '../../platform/coach/coach.module.js';
import { HouseholdModule } from '../../platform/household/household.module.js';
import { TransactionModule } from '../ledger/transaction/transaction.module.js';
import { JarModule } from '../plan/jar/jar.module.js';
import { TurnModule } from '../rhythm/turn/turn.module.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

/** Depends on the aggregates it composes rather than reaching into their tables. */
@Module({
    imports: [JarModule, TurnModule, CoachModule, TransactionModule, HouseholdModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}

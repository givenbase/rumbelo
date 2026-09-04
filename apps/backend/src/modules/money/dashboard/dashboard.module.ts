import { Module } from '@nestjs/common';

import { CoachModule } from '../../platform/coach/coach.module';
import { HouseholdModule } from '../../platform/household/household.module';
import { TransactionModule } from '../ledger/transaction/transaction.module';
import { JarModule } from '../plan/jar/jar.module';
import { TurnModule } from '../rhythm/turn/turn.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

/** Depends on the aggregates it composes rather than reaching into their tables. */
@Module({
    imports: [JarModule, TurnModule, CoachModule, TransactionModule, HouseholdModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}

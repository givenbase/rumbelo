import { Module } from '@nestjs/common';

import { DashboardModule } from './dashboard/dashboard.module.js';
import { LedgerModule } from './ledger/ledger.module.js';
import { PlanModule } from './plan/plan.module.js';
import { RhythmModule } from './rhythm/rhythm.module.js';
import { TargetsModule } from './targets/targets.module.js';

/**
 * Product: Geld. Children are grouped by sub-domain:
 *
 *   plan/     the split setup — jars, income, fixed costs
 *   ledger/   the bank reality — accounts, transactions, sorting rules
 *   targets/  what the household steers toward — goals up, debts down
 *   rhythm/   the cadence — monthly turn, weekly ritual
 *   dashboard/ the composition layer reading across all of the above
 */
@Module({
    imports: [PlanModule, LedgerModule, TargetsModule, RhythmModule, DashboardModule],
    exports: [PlanModule, LedgerModule, TargetsModule, RhythmModule, DashboardModule],
})
export class MoneyModule {}

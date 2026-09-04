import { Module } from '@nestjs/common';

import { DebtModule } from './debt/debt.module';
import { GoalModule } from './goal/goal.module';

/** What the household is steering toward: savings goals up, debts down. */
@Module({
    imports: [GoalModule, DebtModule],
    exports: [GoalModule, DebtModule],
})
export class TargetsModule {}

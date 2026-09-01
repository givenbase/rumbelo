import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DebtModule } from './debt/debt.module.js';
import { FixedCostModule } from './fixed-cost/fixed-cost.module.js';
import { GoalModule } from './goal/goal.module.js';
import { IncomeModule } from './income/income.module.js';
import { JarModule } from './jar/jar.module.js';
import { RitualModule } from './ritual/ritual.module.js';
import { RuleModule } from './rule/rule.module.js';
import { TransactionModule } from './transaction/transaction.module.js';
import { TurnModule } from './turn/turn.module.js';

/**
 * Product: Geld. The children below are exactly the Geld navigation in the
 * application — jars, income, fixed costs, accounts, transactions, sorting rules,
 * goals, debts, the monthly turn, the weekly ritual, and the dashboard that
 * composes them.
 */
@Module({
  imports: [
    JarModule,
    IncomeModule,
    FixedCostModule,
    AccountModule,
    TransactionModule,
    RuleModule,
    GoalModule,
    DebtModule,
    TurnModule,
    RitualModule,
    DashboardModule,
  ],
  exports: [
    JarModule, IncomeModule, FixedCostModule, AccountModule, TransactionModule,
    RuleModule, GoalModule, DebtModule, TurnModule, RitualModule, DashboardModule,
  ],
})
export class MoneyModule {}

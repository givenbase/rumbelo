import { GoalStatus } from '@rumtelo/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { currentPeriod } from '../../../../../common/utils/period.util';
import { CoachService } from '../../../platform/coach/coach.service';
import { JarService } from '../../money/plan/jar/jar.service';
import { GoalService } from '../../money/targets/goal/goal.service';

/**
 * Growth portal hub composition. Goals and income live under money aggregates;
 * learn queue and net-worth holdings are not entities yet — return honest empties.
 */
@Injectable()
export class GrowthDashboardService {
    constructor(
        @Inject(GoalService) private readonly goals: GoalService,
        @Inject(JarService) private readonly jars: JarService,
        @Inject(CoachService) private readonly coach: CoachService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async get() {
        const [goalRows, incomeMonthly, coach] = await Promise.all([
            this.goals.list(),
            this.jars.monthlyNetIncome(),
            this.coach.feed(currentPeriod()),
        ]);

        const active = goalRows.filter(goal => goal.status === GoalStatus.ACTIVE);
        const goalsProgressPct =
            active.length === 0
                ? 0
                : Math.round(
                      active.reduce((sum, goal) => {
                          if (goal.target <= 0) return sum;
                          return sum + Math.min(100, (goal.saved / goal.target) * 100);
                      }, 0) / active.length
                  );

        return {
            goalsActive: active.length,
            goalsTotal: goalRows.length,
            goalsProgressPct,
            incomeMonthly,
            learnQueued: 0,
            netWorth: null,
            coach,
        };
    }
}

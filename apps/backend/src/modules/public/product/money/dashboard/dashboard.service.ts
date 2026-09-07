import { Inject, Injectable } from '@nestjs/common';

import { sum } from '../../../../../common/utils/money.util';
import { daysInPeriod } from '../../../../../common/utils/period.util';
import { CoachService } from '../../../platform/coach/coach.service';
import { HouseholdSettingsService } from '../../../../auth/household/household-settings/household-settings.service';
import { TransactionService } from '../ledger/transaction/transaction.service';
import { FixedCostService } from '../plan/fixed-cost/fixed-cost.service';
import { JarService } from '../plan/jar/jar.service';
import { DebtService } from '../targets/debt/debt.service';
import { MonthScoreService } from '../month-score/month-score.service';

/**
 * Composition root for the dashboard. The design puts jars, coach, month score and four
 * headline figures on one screen; fetching those separately would create a request
 * waterfall on the most-visited route in the product, so they are assembled here.
 */
@Injectable()
export class DashboardService {
    constructor(
        @Inject(JarService) private readonly jars: JarService,
        @Inject(MonthScoreService) private readonly monthScores: MonthScoreService,
        @Inject(CoachService) private readonly coach: CoachService,
        @Inject(TransactionService) private readonly transactions: TransactionService,
        @Inject(HouseholdSettingsService)
        private readonly householdSettings: HouseholdSettingsService,
        @Inject(FixedCostService) private readonly fixedCosts: FixedCostService,
        @Inject(DebtService) private readonly debts: DebtService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async get(householdId: string, period: string) {
        const [jars, monthScore, coach, inboxCount, income, settings, byJar, debtPlan] =
            await Promise.all([
                this.jars.balances(period),
                this.monthScores.current(period),
                this.coach.feed(period),
                this.transactions.countInbox(),
                this.jars.monthlyNetIncome(),
                this.householdSettings.get(householdId),
                this.fixedCosts.byJar(),
                this.debts.plan(),
            ]);

        const allocatedTotal = sum(jars.map(jar => jar.allocated));
        const spentTotal = sum(jars.map(jar => jar.spent));
        const play = jars.find(jar => jar.key === 'PLAY');
        const jarsOnTrack = jars.filter(jar => !jar.overspent).length;
        const fixedCostsMonthly = sum(byJar.map(group => group.total));

        // Safe to spend / play left use available (after fixed commitments).
        const daysLeft = Math.max(1, daysInPeriod(period) - new Date().getUTCDate());
        const spendableRemaining = sum(
            jars
                .filter(jar => jar.capabilities?.countsTowardSafeToSpend)
                .map(jar => Math.max(0, jar.available))
        );

        return {
            period,
            periodLabel: formatPeriod(period),
            allocatedTotal,
            incomeTotal: income,
            spentTotal,
            avgLeftOver: sum(jars.map(jar => jar.available)),
            safePerDay: Math.floor(spendableRemaining / daysLeft),
            playLeft: play?.available ?? 0,
            inboxCount,
            jarsOnTrack,
            jarsTotal: jars.length,
            fixedCostsMonthly,
            debtFreeOn: debtPlan.debtFreeOn,
            debtMonthsRemaining: debtPlan.monthsRemaining,
            jars,
            coach,
            monthScore,
            why: settings.why ?? null,
        };
    }
}

/**
 * Month names come from Intl rather than a hardcoded table: the product ships
 * NL and EN, and a lookup array would need maintaining per locale.
 * TODO: take the locale from HouseholdSettings instead of defaulting to nl-NL.
 */
function formatPeriod(period: string, locale = 'nl-NL'): string {
    const [year, month] = period.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, 1))
    );
}

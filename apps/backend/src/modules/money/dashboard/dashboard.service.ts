import { Injectable } from '@nestjs/common';

import { sum } from '../../../common/utils/money.util';
import { daysInPeriod } from '../../../common/utils/period.util';
import { CoachService } from '../../platform/coach/coach.service';
import { HouseholdService } from '../../platform/household/household.service';
import { TransactionService } from '../ledger/transaction/transaction.service';
import { JarService } from '../plan/jar/jar.service';
import { TurnService } from '../rhythm/turn/turn.service';

/**
 * Composition root for the dashboard. The design puts jars, coach, turn and four
 * headline figures on one screen; fetching those separately would create a request
 * waterfall on the most-visited route in the product, so they are assembled here.
 */
@Injectable()
export class DashboardService {
    constructor(
        private readonly jars: JarService,
        private readonly turns: TurnService,
        private readonly coach: CoachService,
        private readonly transactions: TransactionService,
        private readonly households: HouseholdService
    ) {}

    async get(householdId: string, period: string) {
        const [jars, turn, coach, inboxCount, income, settings] = await Promise.all([
            this.jars.balances(period),
            this.turns.current(period),
            this.coach.feed(period),
            this.transactions.countInbox(),
            this.jars.monthlyNetIncome(),
            this.households.settings(householdId),
        ]);

        const allocatedTotal = sum(jars.map(j => j.allocated));
        const spentTotal = sum(jars.map(j => j.spent));
        const play = jars.find(j => j.key === 'PLAY');

        // What is safe to spend today without pushing any spendable jar over its line.
        const daysLeft = Math.max(1, daysInPeriod(period) - new Date().getUTCDate());
        const spendableRemaining = sum(
            jars.filter(j => j.spendable).map(j => Math.max(0, j.remaining))
        );

        return {
            period,
            periodLabel: formatPeriod(period),
            allocatedTotal,
            incomeTotal: income,
            spentTotal,
            avgLeftOver: allocatedTotal - spentTotal,
            safePerDay: Math.floor(spendableRemaining / daysLeft),
            playLeft: play?.remaining ?? 0,
            inboxCount,
            jars,
            coach,
            turn,
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

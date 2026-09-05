import { Inject, Injectable } from '@nestjs/common';

import { sum } from '../../../../../common/utils/money.util';
import { daysInPeriod } from '../../../../../common/utils/period.util';
import { CoachService } from '../../../platform/coach/coach.service';
import { HouseholdService } from '../../../platform/household/household.service';
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
        @Inject(JarService) private readonly jars: JarService,
        @Inject(TurnService) private readonly turns: TurnService,
        @Inject(CoachService) private readonly coach: CoachService,
        @Inject(TransactionService) private readonly transactions: TransactionService,
        @Inject(HouseholdService) private readonly households: HouseholdService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async get(householdId: string, period: string) {
        const [jars, turn, coach, inboxCount, income, settings] = await Promise.all([
            this.jars.balances(period),
            this.turns.current(period),
            this.coach.feed(period),
            this.transactions.countInbox(),
            this.jars.monthlyNetIncome(),
            this.households.settings(householdId),
        ]);

        const allocatedTotal = sum(jars.map(jar => jar.allocated));
        const spentTotal = sum(jars.map(jar => jar.spent));
        const play = jars.find(jar => jar.key === 'PLAY');

        // What is safe to spend today without pushing any spendable jar over its line.
        const daysLeft = Math.max(1, daysInPeriod(period) - new Date().getUTCDate());
        const spendableRemaining = sum(
            jars.filter(jar => jar.spendable).map(jar => Math.max(0, jar.remaining))
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

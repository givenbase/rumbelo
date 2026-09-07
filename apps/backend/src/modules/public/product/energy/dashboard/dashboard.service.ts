import { EnergyMetric } from '@rumbelo/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { currentPeriod, currentWeek } from '../../../../../common/utils/period.util';
import { CoachService } from '../../../platform/coach/coach.service';
import { LogService } from '../log/log.service';
import { EnergyWeekCheckService } from '../week-check/week-check.service';

/**
 * Energy portal hub composition from logs + week-check shell.
 * Scores stay on the normalised 0–100 scale — not hours or grams.
 */
@Injectable()
export class EnergyDashboardService {
    constructor(
        @Inject(LogService) private readonly logs: LogService,
        @Inject(EnergyWeekCheckService) private readonly weekChecks: EnergyWeekCheckService,
        @Inject(CoachService) private readonly coach: CoachService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async get() {
        const week = currentWeek();
        const [summary, allLogs, weekCheck, coach] = await Promise.all([
            this.logs.summary(),
            this.logs.logs(),
            this.weekChecks.current(week),
            this.coach.feed(currentPeriod()),
        ]);

        const byMetric = (metric: EnergyMetric) =>
            summary.find(row => row.metric === metric) ?? null;

        const sleep = byMetric(EnergyMetric.SLEEP);
        const food = byMetric(EnergyMetric.FOOD);
        const weekDates = isoWeekDateSet(week);

        const trainSessionsThisWeek = allLogs.filter(
            log => log.metric === EnergyMetric.TRAIN && weekDates.has(log.on)
        ).length;

        return {
            weekCheckCompleted: weekCheck.completedAt !== null,
            sleepScore7d: sleep && sleep.average7d > 0 ? sleep.average7d : null,
            trainSessionsThisWeek,
            foodScore7d: food && food.average7d > 0 ? food.average7d : null,
            coach,
        };
    }
}

/** Dates (YYYY-MM-DD, UTC) belonging to an ISO week key YYYY-Www. */
function isoWeekDateSet(weekKey: string): Set<string> {
    const match = /^(\d{4})-W(\d{2})$/.exec(weekKey);
    if (!match) return new Set();
    const year = Number(match[1]);
    const week = Number(match[2]);
    // ISO week 1 Thursday algorithm → Monday of that week
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const weekday = jan4.getUTCDay() || 7;
    const monday = new Date(jan4);
    monday.setUTCDate(jan4.getUTCDate() - weekday + 1 + (week - 1) * 7);
    const dates = new Set<string>();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(monday);
        date.setUTCDate(monday.getUTCDate() + dayOffset);
        dates.add(date.toISOString().slice(0, 10));
    }
    return dates;
}

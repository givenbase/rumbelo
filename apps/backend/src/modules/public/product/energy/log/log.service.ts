import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../common/household/household-scoped.repository';
import {
    currentHouseholdId,
    currentUserId,
} from '../../../../../common/household/household.context';
import { EnergyMetric, EnergyTrend } from '@rumbelo/contracts';

import { EnergyLog } from './energy-log.entity';

@Injectable()
export class LogService {
    private readonly repo: HouseholdScopedRepository<EnergyLog>;
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, EnergyLog);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async create(input: {
        householdId: string;
        on: string;
        metric: keyof typeof EnergyMetric;
        value: number;
        note?: string | null;
    }) {
        const userId = currentUserId();
        let row = await this.repo.findOne({
            userId,
            loggedOn: input.on,
            metric: input.metric as EnergyMetric,
        });
        if (row) {
            row.value = String(input.value);
            row.note = input.note ?? null;
        } else {
            row = this.em.create(EnergyLog, {
                householdId: currentHouseholdId(),
                userId,
                loggedOn: input.on,
                metric: input.metric,
                value: String(input.value),
                note: input.note ?? null,
            } as never);
            this.em.persist(row);
        }
        await this.em.flush();
        return {
            id: row.id,
            householdId: row.householdId,
            userId: row.userId,
            on: row.loggedOn,
            metric: row.metric,
            value: Number(row.value),
            note: row.note,
        };
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async logs() {
        const rows = await this.repo.find({}, { orderBy: { loggedOn: 'DESC' }, limit: 200 });
        return rows.map(l => ({
            id: l.id,
            householdId: l.householdId,
            userId: l.userId,
            on: l.loggedOn,
            metric: l.metric,
            value: Number(l.value),
            note: l.note,
        }));
    }

    /**
     * Rolling averages per metric. spendCorrelation is left null until there is
     * enough paired data — a correlation from six points would be noise presented
     * as insight, which is exactly what this product promises not to do.
     */
    async summary() {
        const rows = await this.repo.find({}, { orderBy: { loggedOn: 'DESC' }, limit: 400 });
        return Object.values(EnergyMetric).map(metric => {
            const forMetric = rows.filter(r => r.metric === metric);
            const avg = (n: number) => {
                const slice = forMetric.slice(0, n);
                return slice.length
                    ? slice.reduce((s, r) => s + Number(r.value), 0) / slice.length
                    : 0;
            };
            const a7 = avg(7);
            const a28 = avg(28);
            return {
                metric,
                average7d: Number(a7.toFixed(2)),
                average28d: Number(a28.toFixed(2)),
                trend:
                    a7 > a28 + 2
                        ? EnergyTrend.UP
                        : a7 < a28 - 2
                          ? EnergyTrend.DOWN
                          : EnergyTrend.FLAT,
                spendCorrelation: null,
            };
        });
    }
}

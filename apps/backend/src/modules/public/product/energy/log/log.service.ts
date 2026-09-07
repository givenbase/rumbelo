import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { CAPABILITIES, EnergyMetric, EnergyTrend } from '@rumbelo/contracts';

import { PlanAccessService } from '../../../../../common/capability';
import { HouseholdScopedRepository } from '../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../common/household/household.context';
import { AccountService } from '../../../../auth/user/account/account.service';

import { EnergyLog } from './energy-log.entity';

const METRIC_CAPABILITY = {
    [EnergyMetric.SLEEP]: CAPABILITIES.energySleep,
    [EnergyMetric.TRAIN]: CAPABILITIES.energyTrain,
    [EnergyMetric.FOOD]: CAPABILITIES.energyFood,
    [EnergyMetric.MIND]: CAPABILITIES.soulMind,
} as const;

@Injectable()
export class LogService {
    private readonly repo: HouseholdScopedRepository<EnergyLog>;
    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(PlanAccessService) private readonly planAccess: PlanAccessService,
        @Inject(AccountService) private readonly accounts: AccountService
    ) {
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
        const metric = input.metric as EnergyMetric;
        const capabilityKey = METRIC_CAPABILITY[metric];
        if (capabilityKey) {
            await this.planAccess.assertCapability(capabilityKey);
        }

        const { account } = await this.accounts.ensureCurrentAccount();
        const accountId = account.id;
        let row = await this.repo.findOne({
            account: accountId,
            loggedOn: input.on,
            metric,
        });
        if (row) {
            row.value = String(input.value);
            row.note = input.note ?? null;
        } else {
            row = this.em.create(EnergyLog, {
                household: currentHouseholdId(),
                account: accountId,
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
            householdId: row.household,
            accountId: row.account,
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
        return rows.map(log => ({
            id: log.id,
            householdId: log.household,
            accountId: log.account,
            on: log.loggedOn,
            metric: log.metric,
            value: Number(log.value),
            note: log.note,
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
            const forMetric = rows.filter(row => row.metric === metric);
            const avg = (value: number) => {
                const slice = forMetric.slice(0, value);
                return slice.length
                    ? slice.reduce((total, row) => total + Number(row.value), 0) / slice.length
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

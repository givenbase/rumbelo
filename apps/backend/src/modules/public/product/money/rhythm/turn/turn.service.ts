import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { sum } from '../../../../../../common/utils/money.util';
import { daysInPeriod } from '../../../../../../common/utils/period.util';
import { JarService } from '../../plan/jar/jar.service';
import { PeriodTurn } from './period-turn.entity';
import { TurnEvent } from './turn-event.entity';

/** Level thresholds are cumulative score. Labels follow the product's steering language. */
export const LEVELS = [
    { index: 1, label: 'Beginner', threshold: 0, unlocks: ['Zes potten', 'Inbox'] },
    { index: 2, label: 'Navigator', threshold: 120, unlocks: ['Weekritueel'] },
    { index: 3, label: 'Stuurman', threshold: 320, unlocks: ['Doelen', 'Schulden'] },
    { index: 4, label: 'Kapitein', threshold: 640, unlocks: ['Energie-laag'] },
    { index: 5, label: 'Kompas', threshold: 1080, unlocks: ['Coach', 'Export'] },
];

@Injectable()
export class TurnService {
    private readonly turns: HouseholdScopedRepository<PeriodTurn>;
    private readonly events: HouseholdScopedRepository<TurnEvent>;

    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(JarService) private readonly jars: JarService
    ) {
        this.turns = new HouseholdScopedRepository(em, PeriodTurn);
        this.events = new HouseholdScopedRepository(em, TurnEvent);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async current(period: string) {
        const turn = await this.turns.findOne({ period });
        const events = await this.events.find({ period }, { orderBy: { day: 'DESC' } });
        const score = turn?.score ?? 0;
        const level = levelFor(score);

        return {
            householdId: currentHouseholdId(),
            period,
            score,
            maxScore: turn?.maxScore ?? 100,
            daysLeft: Math.max(0, daysInPeriod(period) - new Date().getUTCDate()),
            isClosed: turn?.isClosed ?? false,
            level: level.index,
            levelLabel: level.label,
            events: events.map(event => ({
                id: event.id,
                householdId: event.householdId,
                period: event.period,
                kind: event.kind,
                day: event.day,
                text: event.text,
                points: event.points,
            })),
        };
    }

    levels() {
        return LEVELS;
    }

    async recap(period: string) {
        const turn = await this.turns.findOne({ period });
        return this.buildRecap(period, turn);
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Idempotent: closing an already-closed turn returns the existing recap. */
    async close(period: string) {
        let turn = await this.turns.findOne({ period });
        if (turn?.isClosed) {
            return this.buildRecap(period, turn);
        }

        const recap = await this.buildRecap(period, turn);

        if (!turn) {
            turn = this.em.create(PeriodTurn, {
                householdId: currentHouseholdId(),
                period,
            } as never);
            this.em.persist(turn);
        }

        turn.score = recap.score;
        turn.maxScore = 100;
        turn.isClosed = true;
        turn.closedAt = new Date();
        turn.level = levelFor(recap.score).index;

        await this.em.flush();
        return recap;
    }

    // Private

    private async buildRecap(period: string, turn?: PeriodTurn | null) {
        const jarRows = await this.jars.balances(period);
        const income = await this.jars.monthlyNetIncome();
        const allocated = sum(jarRows.map(jar => jar.allocated));
        const spent = sum(jarRows.map(jar => jar.spent));
        const leftOver = allocated - spent;

        const isSpendable = jarRows.filter(jar => jar.isSpendable);
        const held = isSpendable.filter(jar => !jar.overspent).length;
        const score =
            turn?.score ?? (isSpendable.length ? Math.round((held / isSpendable.length) * 100) : 0);

        const best = jarRows.reduce((left, right) => (left.remaining >= right.remaining ? left : right), jarRows[0]!);
        const worst =
            jarRows.find(jar => jar.overspent) ??
            jarRows.reduce((left, right) => (left.remaining <= right.remaining ? left : right), jarRows[0]!);

        const headline =
            leftOver >= 0
                ? `${formatEuro(leftOver)} over deze periode`
                : 'Eén of meer potten zijn overschreden';

        return {
            period,
            income,
            allocated,
            spent,
            leftOver,
            score,
            bestJar: best?.name ?? null,
            worstJar: worst?.overspent ? worst.name : null,
            headline,
        };
    }
}

export function levelFor(score: number) {
    return [...LEVELS].reverse().find(level => score >= level.threshold) ?? LEVELS[0]!;
}

function formatEuro(cents: number) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cents / 100);
}

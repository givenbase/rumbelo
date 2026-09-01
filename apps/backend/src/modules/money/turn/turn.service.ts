import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentHouseholdId } from '../../../common/tenancy/tenant.context.js';
import { daysInPeriod } from '../../../common/utils/period.util.js';
import { sum } from '../../../common/utils/money.util.js';
import { JarService } from '../jar/jar.service.js';
import { PeriodTurn, TurnEvent } from './entities/index.js';

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
  private readonly turns: ScopedRepository<PeriodTurn>;
  private readonly events: ScopedRepository<TurnEvent>;

  constructor(
    private readonly em: EntityManager,
    private readonly jars: JarService,
  ) {
    this.turns = new ScopedRepository(em, PeriodTurn);
    this.events = new ScopedRepository(em, TurnEvent);
  }

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
      closed: turn?.closed ?? false,
      level: level.index,
      levelLabel: level.label,
      events: events.map((e) => ({
        id: e.id, householdId: e.householdId, period: e.period,
        kind: e.kind, day: e.day, text: e.text, points: e.points,
      })),
    };
  }

  levels() { return LEVELS; }

  async recap(period: string) {
    const turn = await this.turns.findOne({ period });
    return this.buildRecap(period, turn);
  }

  /** Idempotent: closing an already-closed turn returns the existing recap. */
  async close(period: string) {
    let turn = await this.turns.findOne({ period });
    if (turn?.closed) {
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
    turn.closed = true;
    turn.closedAt = new Date();
    turn.level = levelFor(recap.score).index;

    await this.em.flush();
    return recap;
  }

  private async buildRecap(period: string, turn?: PeriodTurn | null) {
    const jarRows = await this.jars.balances(period);
    const income = await this.jars.monthlyNetIncome();
    const allocated = sum(jarRows.map((j) => j.allocated));
    const spent = sum(jarRows.map((j) => j.spent));
    const leftOver = allocated - spent;

    const spendable = jarRows.filter((j) => j.spendable);
    const held = spendable.filter((j) => !j.overspent).length;
    const score =
      turn?.score ??
      (spendable.length ? Math.round((held / spendable.length) * 100) : 0);

    const best = jarRows.reduce((a, b) => (a.remaining >= b.remaining ? a : b), jarRows[0]!);
    const worst = jarRows.find((j) => j.overspent) ?? jarRows.reduce((a, b) => (a.remaining <= b.remaining ? a : b), jarRows[0]!);

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
  return [...LEVELS].reverse().find((l) => score >= l.threshold) ?? LEVELS[0]!;
}

function formatEuro(cents: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    cents / 100,
  );
}

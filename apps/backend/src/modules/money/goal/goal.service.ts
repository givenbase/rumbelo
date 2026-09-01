import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentHouseholdId } from '../../../common/tenancy/tenant.context.js';
import { Jar } from '../jar/entities/index.js';
import { Goal, GoalStatus } from './entities/index.js';

@Injectable()
export class GoalService {
  private readonly repo: ScopedRepository<Goal>;
  constructor(private readonly em: EntityManager) {
    this.repo = new ScopedRepository(em, Goal);
  }

  async list() {
    const rows = await this.repo.find({ status: GoalStatus.ACTIVE });
    return rows.map(toDto);
  }

  async create(input: {
    jarId?: string | null;
    name: string;
    icon?: string | null;
    target: number;
    monthlyContribution?: number;
    targetDate?: string | null;
    status?: string;
    why?: string | null;
  }) {
    const entity = this.em.create(Goal, {
      householdId: currentHouseholdId(),
      jar: input.jarId ? this.em.getReference(Jar, input.jarId) : null,
      name: input.name,
      icon: input.icon ?? null,
      target: input.target,
      saved: 0,
      monthlyContribution: input.monthlyContribution ?? 0,
      targetDate: input.targetDate ?? null,
      status: (input.status as GoalStatus) ?? GoalStatus.ACTIVE,
      why: input.why ?? null,
    } as never);
    await this.em.persistAndFlush(entity);
    return toDto(entity);
  }

  async update(
    id: string,
    patch: Partial<{
      jarId: string | null;
      name: string;
      icon: string | null;
      target: number;
      saved: number;
      monthlyContribution: number;
      targetDate: string | null;
      status: string;
      why: string | null;
    }>,
  ) {
    const entity = await this.repo.findOneOrFail({ id });
    if (patch.jarId !== undefined) {
      entity.jar = patch.jarId ? this.em.getReference(Jar, patch.jarId) : null;
    }
    if (patch.name !== undefined) entity.name = patch.name;
    if (patch.icon !== undefined) entity.icon = patch.icon;
    if (patch.target !== undefined) entity.target = patch.target;
    if (patch.saved !== undefined) entity.saved = patch.saved;
    if (patch.monthlyContribution !== undefined) {
      entity.monthlyContribution = patch.monthlyContribution;
    }
    if (patch.targetDate !== undefined) entity.targetDate = patch.targetDate;
    if (patch.status !== undefined) entity.status = patch.status as GoalStatus;
    if (patch.why !== undefined) entity.why = patch.why;
    await this.em.flush();
    return toDto(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOneOrFail({ id });
    await this.em.removeAndFlush(entity);
    return { ok: true as const };
  }

  /** Straight-line projection at the current contribution rate. */
  async projections() {
    const rows = await this.repo.find({ status: GoalStatus.ACTIVE });
    return rows.map((g) => {
      const remaining = Number(g.target) - Number(g.saved);
      const monthly = Number(g.monthlyContribution);
      const months = monthly > 0 ? Math.ceil(remaining / monthly) : null;

      const projectedDate = months === null ? null : addMonths(new Date(), months);
      const onTrack =
        g.targetDate === null || projectedDate === null
          ? monthly > 0
          : projectedDate <= g.targetDate;

      // What the monthly contribution would need to be to hit a stated deadline.
      const shortfall =
        g.targetDate && monthly >= 0
          ? Math.max(0, Math.ceil(remaining / Math.max(1, monthsUntil(g.targetDate))) - monthly)
          : 0;

      return {
        goalId: g.id, projectedDate, monthsRemaining: months, onTrack, shortfallPerMonth: shortfall,
      };
    });
  }
}

function addMonths(from: Date, months: number): string {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + months, 1));
  return d.toISOString().slice(0, 10);
}

function monthsUntil(isoDate: string): number {
  const target = new Date(isoDate);
  const now = new Date();
  return Math.max(
    1,
    (target.getUTCFullYear() - now.getUTCFullYear()) * 12 + (target.getUTCMonth() - now.getUTCMonth()),
  );
}

export function toDto(g: Goal) {
  return {
    id: g.id, householdId: g.householdId, jarId: g.jar?.id ?? null, name: g.name, icon: g.icon,
    target: Number(g.target), saved: Number(g.saved),
    monthlyContribution: Number(g.monthlyContribution),
    targetDate: g.targetDate, status: g.status, why: g.why,
  };
}

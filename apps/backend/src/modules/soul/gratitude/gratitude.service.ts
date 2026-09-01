import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentUserId } from '../../../common/tenancy/tenant.context.js';
import { Gratitude } from './entities/index.js';

@Injectable()
export class GratitudeService {
  private readonly repo: ScopedRepository<Gratitude>;
  constructor(private readonly em: EntityManager) {
    this.repo = new ScopedRepository(em, Gratitude);
  }

  async forWeek(week: string) {
    const rows = await this.repo.find({ week }, { orderBy: { createdAt: 'DESC' } });
    return rows.map((g) => ({
      id: g.id, householdId: g.householdId, userId: g.userId,
      week: g.week, text: g.text, createdAt: g.createdAt.toISOString(),
    }));
  }

  async create(input: { householdId: string; week: string; text: string }) {
    const row = this.em.create(Gratitude, {
      householdId: input.householdId,
      userId: currentUserId(),
      week: input.week,
      text: input.text,
    } as never);
    await this.em.persistAndFlush(row);
    return {
      id: row.id,
      householdId: row.householdId,
      userId: row.userId,
      week: row.week,
      text: row.text,
      createdAt: row.createdAt.toISOString(),
    };
  }
}

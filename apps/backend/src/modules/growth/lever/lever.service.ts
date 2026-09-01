import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { IncomeLever } from './entities/index.js';

/** Things that move earning power. A Growth surface, not a budget line. */
@Injectable()
export class LeverService {
  private readonly repo: ScopedRepository<IncomeLever>;
  constructor(private readonly em: EntityManager) {
    this.repo = new ScopedRepository(em, IncomeLever);
  }

  async list() {
    const rows = await this.repo.find();
    return rows.map((l) => ({
      id: l.id, householdId: l.householdId, label: l.label, note: l.note,
      potentialMonthly: Number(l.potentialMonthly), done: l.done,
    }));
  }
}

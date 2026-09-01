import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentHouseholdId } from '../../../common/tenancy/tenant.context.js';
import { AccountKind, BankAccount } from './entities/index.js';

@Injectable()
export class AccountService {
    private readonly repo: ScopedRepository<BankAccount>;
    constructor(private readonly em: EntityManager) {
        this.repo = new ScopedRepository(em, BankAccount);
    }

    async list() {
        const rows = await this.repo.find();
        return rows.map(toDto);
    }

    async create(input: { name: string; iban?: string | null; kind: string; balance: number }) {
        const account = this.em.create(BankAccount, {
            householdId: currentHouseholdId(),
            name: input.name,
            iban: input.iban ?? null,
            kind: input.kind as AccountKind,
            balance: input.balance,
        } as never);
        await this.em.persistAndFlush(account);
        return toDto(account);
    }
}

export function toDto(a: BankAccount) {
    return {
        id: a.id,
        householdId: a.householdId,
        name: a.name,
        iban: a.iban,
        kind: a.kind,
        balance: Number(a.balance),
        connectionId: a.connectionId,
        lastSyncedAt: a.lastSyncedAt?.toISOString() ?? null,
    };
}

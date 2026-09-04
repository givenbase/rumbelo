import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../common/household/household.context';
import { AccountKind, BankAccount } from './bank-account.entity';

@Injectable()
export class AccountService {
    private readonly repo: HouseholdScopedRepository<BankAccount>;
    constructor(private readonly em: EntityManager) {
        this.repo = new HouseholdScopedRepository(em, BankAccount);
    }

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

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

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async list() {
        const rows = await this.repo.find();
        return rows.map(toDto);
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

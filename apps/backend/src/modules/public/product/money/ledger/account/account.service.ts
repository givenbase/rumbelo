import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import { HouseholdScopedRepository } from '../../../../../../common/household/household-scoped.repository';
import { currentHouseholdId } from '../../../../../../common/household/household.context';
import { AccountKind } from '@rumbelo/contracts';

import { BankAccount } from './bank-account.entity';

@Injectable()
export class AccountService {
    private readonly repo: HouseholdScopedRepository<BankAccount>;
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {
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
        await this.em.persist(account).flush();
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

export function toDto(account: BankAccount) {
    return {
        id: account.id,
        householdId: account.householdId,
        name: account.name,
        iban: account.iban,
        kind: account.kind,
        balance: Number(account.balance),
        connectionId: account.connectionId,
        lastSyncedAt: account.lastSyncedAt?.toISOString() ?? null,
    };
}

import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

import { ScopedRepository } from '../../../common/tenancy/scoped.repository.js';
import { currentHouseholdId } from '../../../common/tenancy/tenant.context.js';
import { BankAccount } from '../account/entities/index.js';
import { Category, Jar } from '../jar/entities/index.js';
import { RuleService } from '../rule/rule.service.js';
import { parseStatementCsv } from './csv/csv-parser.js';
import { Transaction, TransactionSource, TransactionStatus } from './entities/index.js';

@Injectable()
export class TransactionService {
    private readonly transactions: ScopedRepository<Transaction>;

    constructor(
        private readonly em: EntityManager,
        private readonly rules: RuleService
    ) {
        this.transactions = new ScopedRepository(em, Transaction);
    }

    async inbox() {
        const rows = await this.transactions.find(
            { status: TransactionStatus.INBOX },
            { orderBy: { bookedOn: 'DESC' }, limit: 200 }
        );
        return rows.map(toDto);
    }

    async list(filter: { status?: string | null; jarId?: string | null; limit: number }) {
        const where: Record<string, unknown> = {};
        if (filter.status) where.status = filter.status;
        if (filter.jarId) where.jar = filter.jarId;

        const rows = await this.transactions.find(where, {
            orderBy: { bookedOn: 'DESC' },
            limit: filter.limit + 1,
        });
        const hasMore = rows.length > filter.limit;
        const page = hasMore ? rows.slice(0, filter.limit) : rows;
        return { items: page.map(toDto), nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null };
    }

    async create(input: {
        accountId?: string | null;
        jarId?: string | null;
        categoryId?: string | null;
        amount: number;
        bookedOn: string;
        description: string;
        counterparty?: string | null;
        note?: string | null;
    }) {
        const entity = this.em.create(Transaction, {
            householdId: currentHouseholdId(),
            account: input.accountId ? this.em.getReference(BankAccount, input.accountId) : null,
            jar: input.jarId ? this.em.getReference(Jar, input.jarId) : null,
            category: input.categoryId ? this.em.getReference(Category, input.categoryId) : null,
            amount: input.amount,
            bookedOn: input.bookedOn,
            description: input.description,
            counterparty: input.counterparty ?? null,
            note: input.note ?? null,
            status: input.jarId ? TransactionStatus.SORTED : TransactionStatus.INBOX,
            source: TransactionSource.MANUAL,
            dedupeKey: dedupeKey(
                input.accountId ?? null,
                input.bookedOn,
                input.amount,
                input.description
            ),
        } as never);
        await this.em.persistAndFlush(entity);
        return toDto(entity);
    }

    async sort(
        transactionId: string,
        jarId: string,
        categoryId?: string | null,
        createRule = false
    ) {
        const entity = await this.transactions.findOneOrFail({ id: transactionId });
        entity.jar = this.em.getReference(Jar, jarId);
        entity.category = categoryId ? this.em.getReference(Category, categoryId) : null;
        entity.status = TransactionStatus.SORTED;

        if (createRule) {
            const value = (entity.counterparty?.trim() || entity.description).trim();
            const field = entity.counterparty?.trim() ? 'COUNTERPARTY' : 'DESCRIPTION';
            const rule = await this.rules.create({
                field,
                matcher: 'CONTAINS',
                value,
                jarId,
                categoryId: categoryId ?? null,
                priority: 100,
                active: true,
            });
            entity.appliedRuleId = rule.id;
        }

        await this.em.flush();
        return toDto(entity);
    }

    async bulkSort(ids: string[], jarId: string, categoryId?: string | null) {
        const rows = await this.transactions.find({ id: { $in: ids } });
        for (const row of rows) {
            row.jar = this.em.getReference(Jar, jarId);
            row.category = categoryId ? this.em.getReference(Category, categoryId) : null;
            row.status = TransactionStatus.SORTED;
        }
        await this.em.flush();
        return { updated: rows.length };
    }

    async update(
        id: string,
        patch: Partial<Pick<Transaction, 'description' | 'amount' | 'note' | 'status'>>
    ) {
        const entity = await this.transactions.findOneOrFail({ id });
        Object.assign(entity, patch);
        await this.em.flush();
        return toDto(entity);
    }

    async remove(id: string) {
        const entity = await this.transactions.findOneOrFail({ id });
        await this.em.removeAndFlush(entity);
    }

    async countInbox() {
        return this.transactions.count({ status: TransactionStatus.INBOX });
    }

    /**
     * CSV is the always-on import path; bank sync is the optional one. Import is
     * idempotent via dedupeKey, so re-uploading the same statement is safe.
     */
    async importCsv(accountId: string, content: string, dryRun: boolean) {
        const parsed = parseStatementCsv(content);
        const keys = parsed.map(r => dedupeKey(accountId, r.bookedOn, r.amount, r.description));

        const existing = keys.length
            ? await this.transactions.find({ dedupeKey: { $in: keys } })
            : [];
        const seen = new Set(existing.map(e => e.dedupeKey));
        const freshCount = keys.filter(k => !seen.has(k)).length;

        if (!dryRun) {
            parsed.forEach((row, i) => {
                if (seen.has(keys[i]!)) return;
                this.em.create(Transaction, {
                    householdId: currentHouseholdId(),
                    account: this.em.getReference(BankAccount, accountId),
                    amount: row.amount,
                    bookedOn: row.bookedOn,
                    description: row.description,
                    counterparty: row.counterparty,
                    status: TransactionStatus.INBOX,
                    source: TransactionSource.CSV,
                    dedupeKey: keys[i]!,
                } as never);
            });
            await this.em.flush();
        }

        return {
            detected: parsed.length,
            duplicates: parsed.length - freshCount,
            willImport: freshCount,
            sample: [],
        };
    }
}

export function toDto(t: Transaction) {
    return {
        id: t.id,
        householdId: t.householdId,
        accountId: t.account?.id ?? null,
        jarId: t.jar?.id ?? null,
        categoryId: t.category?.id ?? null,
        amount: Number(t.amount),
        bookedOn: t.bookedOn,
        description: t.description,
        counterparty: t.counterparty,
        status: t.status,
        source: t.source,
        appliedRuleId: t.appliedRuleId,
        note: t.note,
        createdAt: t.createdAt.toISOString(),
    };
}

/** Stable across re-imports so the same statement never duplicates rows. */
function dedupeKey(
    accountId: string | null,
    bookedOn: string,
    amount: number,
    description: string
) {
    return createHash('sha256')
        .update(
            [accountId ?? '', bookedOn, String(amount), description.trim().toLowerCase()].join('|')
        )
        .digest('hex')
        .slice(0, 64);
}

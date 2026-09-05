import { z } from 'zod';

import { AccountKind, TransactionSource, TransactionStatus } from '../../../../enums';
import { HouseholdId, Id, IsoDate, Money, Pagination, PeriodKey } from '../../../../common/schemas';

export { AccountKind, TransactionSource, TransactionStatus } from '../../../../enums';

/**
 * INBOX  — arrived, not yet given a jar. The only state that demands user attention.
 * SORTED — has a jar (and usually a category).
 * IGNORED— deliberately excluded from budget maths (internal transfers, corrections).
 */
export const Transaction = z.object({
    id: Id,
    householdId: HouseholdId,
    accountId: Id.nullable(),
    jarId: Id.nullable(),
    categoryId: Id.nullable(),
    /** Negative = money out, positive = money in. Minor units. */
    amount: Money,
    bookedOn: IsoDate,
    description: z.string().max(280),
    counterparty: z.string().max(160).nullable(),
    status: z.enum(TransactionStatus),
    source: z.enum(TransactionSource),
    /** Set when a rule auto-sorted this, so the user can see and undo the automation. */
    appliedRuleId: Id.nullable(),
    note: z.string().max(500).nullable(),
    createdAt: z.iso.datetime(),
});
export type Transaction = z.infer<typeof Transaction>;

export const ListTransactions = Pagination.extend({
    householdId: HouseholdId,
    period: PeriodKey.nullish(),
    status: z.enum(TransactionStatus).nullish(),
    jarId: Id.nullish(),
    search: z.string().max(120).nullish(),
});

export const CreateTransaction = z.object({
    householdId: HouseholdId,
    accountId: Id.nullish(),
    jarId: Id.nullish(),
    categoryId: Id.nullish(),
    amount: Money,
    bookedOn: IsoDate,
    description: z.string().min(1).max(280),
    counterparty: z.string().max(160).nullish(),
    note: z.string().max(500).nullish(),
});

/** Sorting one inbox item; optionally teach a rule from it in the same call. */
export const SortTransaction = z.object({
    householdId: HouseholdId,
    transactionId: Id,
    jarId: Id,
    categoryId: Id.nullish(),
    createRule: z.boolean().default(false),
});

export const Account = z.object({
    id: Id,
    householdId: HouseholdId,
    name: z.string().min(1).max(120),
    iban: z.string().max(34).nullable(),
    kind: z.enum(AccountKind),
    balance: Money,
    /** Null for manual accounts; set when linked through the bank-sync port. */
    connectionId: Id.nullable(),
    lastSyncedAt: z.iso.datetime().nullable(),
});
export type Account = z.infer<typeof Account>;

export const ImportCsv = z.object({
    householdId: HouseholdId,
    accountId: Id,
    /** Raw CSV text. Parsing/mapping happens server-side so the format lives in one place. */
    content: z.string().min(1),
    dryRun: z.boolean().default(true),
});

export const ImportPreview = z.object({
    detected: z.int(),
    duplicates: z.int(),
    willImport: z.int(),
    sample: z.array(z.string()),
});

export const ImportCsvResult = z.object({
    imported: z.int(),
    skipped: z.int(),
    errors: z.array(z.string()),
});

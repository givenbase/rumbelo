import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity';
import { Category } from '../../plan/jar/category.entity';
import { Jar } from '../../plan/jar/jar.entity';
import { BankAccount } from '../account/bank-account.entity';

/**
 * INBOX   — arrived, no jar yet. The only state that demands user attention.
 * SORTED  — has a jar, and usually a category.
 * IGNORED — deliberately outside budget maths (internal transfers, corrections).
 */
export enum TransactionStatus {
    INBOX = 'INBOX',
    SORTED = 'SORTED',
    IGNORED = 'IGNORED',
}
export enum TransactionSource {
    MANUAL = 'MANUAL',
    CSV = 'CSV',
    BANK = 'BANK',
    RECURRING = 'RECURRING',
}

@Entity({ tableName: 'transaction', schema: 'money' })
// The dashboard reads by period and the inbox reads by status; cover both.
@Index({ properties: ['householdId', 'bookedOn'] })
@Index({ properties: ['householdId', 'status'] })
export class Transaction extends HouseholdEntity {
    @ManyToOne(() => BankAccount, { nullable: true })
    account: BankAccount | null = null;

    @ManyToOne(() => Jar, { nullable: true })
    jar: Jar | null = null;

    @ManyToOne(() => Category, { nullable: true })
    category: Category | null = null;

    /** Negative = money out, positive = money in. Integer minor units, never floats. */
    @Property({ type: 'bigint' })
    amount!: number;

    @Property({ type: 'date' })
    bookedOn!: string;

    @Property({ length: 280 })
    description!: string;

    @Property({ length: 160, nullable: true })
    counterparty: string | null = null;

    @Enum(() => TransactionStatus)
    status: TransactionStatus = TransactionStatus.INBOX;

    @Enum(() => TransactionSource)
    source: TransactionSource = TransactionSource.MANUAL;

    /** Set when a rule auto-sorted this, keeping the automation visible and undoable. */
    @Property({ type: 'uuid', nullable: true })
    appliedRuleId: string | null = null;

    /**
     * Stable hash of (account, date, amount, description) making imports idempotent:
     * re-importing the same statement must never duplicate rows.
     */
    @Property({ length: 64, nullable: true })
    @Index()
    dedupeKey: string | null = null;

    @Property({ type: 'text', nullable: true })
    note: string | null = null;
}

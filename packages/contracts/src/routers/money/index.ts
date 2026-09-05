import { oc } from '@orpc/contract';
import { z } from 'zod';

import {
    DebtKind,
    FlowDirection,
    IncomeKind,
    JarKey,
    PayoffStrategy,
    RitualStage,
} from '../../enums';
import * as S from '../../schemas/index';

const ok = z.object({ ok: z.literal(true) });

/**
 * Product: Geld. Children map one-to-one onto the Geld navigation in the
 * application and onto apps/backend/src/modules/public/product/money.
 */
export const contract = {
    jars: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.Jar)),
        balances: oc
            .input(S.HouseholdScoped.extend({ period: S.PeriodKey.nullish() }))
            .output(z.array(S.JarBalance)),
        update: oc
            .input(S.Jar.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Jar),
        updateSplit: oc.input(S.UpdateJarSplit).output(z.array(S.Jar)),
        createCategory: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    jarId: S.Id,
                    name: z.string().min(1).max(80),
                    budgeted: S.Money,
                })
            )
            .output(S.Category),
        updateCategory: oc
            .input(S.Category.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Category),
        deleteCategory: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
    },

    income: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.IncomeSource)),
        create: oc.input(S.IncomeSource.omit({ id: true })).output(S.IncomeSource),
        update: oc
            .input(S.IncomeSource.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.IncomeSource),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
        /** Turns an income event into per-jar allocations atomically. */
        applySplit: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    incomeSourceId: S.Id,
                    amount: S.Money,
                    bookedOn: S.IsoDate,
                })
            )
            .output(z.object({ allocations: z.array(z.object({ jarId: S.Id, amount: S.Money })) })),
    },

    fixedCosts: {
        list: oc
            .input(S.HouseholdScoped.extend({ direction: z.enum(FlowDirection).nullish() }))
            .output(z.array(S.FixedCost)),
        byJar: oc.input(S.HouseholdScoped).output(z.array(S.FixedCostsByJar)),
        create: oc.input(S.FixedCost.omit({ id: true })).output(S.FixedCost),
        update: oc
            .input(S.FixedCost.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.FixedCost),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
    },

    accounts: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.Account)),
        create: oc
            .input(S.Account.omit({ id: true, connectionId: true, lastSyncedAt: true }))
            .output(S.Account),
    },

    transactions: {
        list: oc.input(S.ListTransactions).output(S.paginated(S.Transaction)),
        inbox: oc.input(S.HouseholdScoped).output(z.array(S.Transaction)),
        create: oc.input(S.CreateTransaction).output(S.Transaction),
        update: oc
            .input(S.Transaction.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Transaction),
        sort: oc.input(S.SortTransaction).output(S.Transaction),
        bulkSort: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    transactionIds: z.array(S.Id).min(1),
                    jarId: S.Id,
                    categoryId: S.Id.nullish(),
                })
            )
            .output(z.object({ updated: z.int() })),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
        importCsv: oc.input(S.ImportCsv).output(S.ImportPreview),
    },

    rules: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.Rule)),
        create: oc.input(S.Rule.omit({ id: true, hitCount: true })).output(S.Rule),
        update: oc
            .input(S.Rule.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Rule),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
        /** Re-runs active rules over unsorted history — the "clean my inbox" button. */
        replay: oc.input(S.HouseholdScoped).output(z.object({ sorted: z.int() })),
    },

    goals: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.Goal)),
        create: oc.input(S.Goal.omit({ id: true, saved: true })).output(S.Goal),
        update: oc
            .input(S.Goal.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Goal),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
        projections: oc.input(S.HouseholdScoped).output(z.array(S.GoalProjection)),
    },

    debts: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.Debt)),
        create: oc.input(S.Debt.omit({ id: true })).output(S.Debt),
        update: oc
            .input(S.Debt.partial().extend({ id: S.Id, householdId: S.HouseholdId }))
            .output(S.Debt),
        remove: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(ok),
        plan: oc
            .input(
                S.HouseholdScoped.extend({
                    strategy: z.enum(PayoffStrategy).nullish(),
                })
            )
            .output(S.DebtPlan),
    },

    turn: {
        current: oc
            .input(S.HouseholdScoped.extend({ period: S.PeriodKey.nullish() }))
            .output(S.Turn),
        levels: oc.input(S.HouseholdScoped).output(z.array(S.Level)),
        recap: oc.input(S.HouseholdScoped.extend({ period: S.PeriodKey })).output(S.PeriodRecap),
        /** Idempotent: closing an already-closed turn returns the existing recap. */
        close: oc.input(S.HouseholdScoped.extend({ period: S.PeriodKey })).output(S.PeriodRecap),
    },

    ritual: {
        current: oc
            .input(S.HouseholdScoped.extend({ week: S.WeekKey.nullish() }))
            .output(S.WeeklyRitual),
        advance: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    week: S.WeekKey,
                    stage: z.enum(RitualStage),
                    allocations: z.array(S.SurplusAllocation).nullish(),
                    intention: z.string().max(280).nullish(),
                })
            )
            .output(S.WeeklyRitual),
        history: oc.input(S.HouseholdScoped).output(z.array(S.WeeklyRitual)),
    },

    dashboard: {
        get: oc
            .input(S.HouseholdScoped.extend({ period: S.PeriodKey.nullish() }))
            .output(S.Dashboard),
    },

    /** Backoffice reference catalogs — read-only suggestions for create forms. */
    catalogs: {
        categoryTemplates: {
            list: oc
                .input(S.HouseholdScoped.extend({ jarKey: z.enum(JarKey).nullish() }))
                .output(z.array(S.CategoryTemplate)),
        },
        fixedCostPresets: {
            list: oc
                .input(
                    S.HouseholdScoped.extend({
                        jarKey: z.enum(JarKey).nullish(),
                        categoryTemplateKey: z.string().max(64).nullish(),
                        audienceTag: z.string().max(32).nullish(),
                    })
                )
                .output(z.array(S.FixedCostPreset)),
        },
        debtPresets: {
            list: oc
                .input(S.HouseholdScoped.extend({ kind: z.enum(DebtKind).nullish() }))
                .output(z.array(S.DebtPreset)),
        },
        incomeSourcePresets: {
            list: oc
                .input(S.HouseholdScoped.extend({ kind: z.enum(IncomeKind).nullish() }))
                .output(z.array(S.IncomeSourcePreset)),
        },
        goalPresets: {
            list: oc
                .input(S.HouseholdScoped.extend({ jarKey: z.enum(JarKey).nullish() }))
                .output(z.array(S.GoalPreset)),
        },
        merchantPresets: {
            list: oc
                .input(
                    S.HouseholdScoped.extend({
                        jarKey: z.enum(JarKey).nullish(),
                        categoryTemplateKey: z.string().max(64).nullish(),
                        mcc: z.string().length(4).nullish(),
                    })
                )
                .output(z.array(S.MerchantPreset)),
        },
    },
};

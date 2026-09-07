import { oc } from '@orpc/contract';
import { z } from 'zod';

import {
    DebtKind,
    FlowDirection,
    IncomeKind,
    JarKey,
    PayoffStrategy,
    WeekCheckStage,
} from '../../../enums';
import * as schemas from '../../../schemas';

const ok = z.object({ ok: z.literal(true) });

/**
 * Product: Geld. Children map one-to-one onto the Geld navigation in the
 * application and onto apps/backend/src/modules/public/product/money.
 */
export const contract = {
    jars: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Jar)),
        balances: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey.nullish() }))
            .output(z.array(schemas.JarBalance)),
        update: oc
            .input(
                schemas.Jar.partial().extend({ id: schemas.Id, householdId: schemas.HouseholdId })
            )
            .output(schemas.Jar),
        updateSplit: oc.input(schemas.UpdateJarSplit).output(z.array(schemas.Jar)),
        createCategory: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    jarId: schemas.Id,
                    name: z.string().min(1).max(80),
                    budgeted: schemas.Money,
                })
            )
            .output(schemas.Category),
        updateCategory: oc
            .input(
                schemas.Category.partial().extend({
                    id: schemas.Id,
                    householdId: schemas.HouseholdId,
                })
            )
            .output(schemas.Category),
        deleteCategory: oc
            .input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id }))
            .output(ok),
    },

    income: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.IncomeSource)),
        create: oc
            .input(schemas.IncomeSource.omit({ id: true, periods: true }))
            .output(schemas.IncomeSource),
        update: oc
            .input(
                schemas.IncomeSource.partial().omit({ periods: true }).extend({
                    id: schemas.Id,
                    householdId: schemas.HouseholdId,
                    /** When amount changes: date the new amount takes effect (default today). */
                    amountEffectiveFrom: schemas.IsoDate.nullish(),
                })
            )
            .output(schemas.IncomeSource),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
        /** Turns an income event into per-jar allocations atomically. */
        applySplit: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    incomeSourceId: schemas.Id,
                    amount: schemas.Money,
                    bookedOn: schemas.IsoDate,
                })
            )
            .output(
                z.object({
                    allocations: z.array(z.object({ jarId: schemas.Id, amount: schemas.Money })),
                })
            ),
    },

    fixedCosts: {
        list: oc
            .input(schemas.HouseholdScoped.extend({ direction: z.enum(FlowDirection).nullish() }))
            .output(z.array(schemas.FixedCost)),
        byJar: oc.input(schemas.HouseholdScoped).output(z.array(schemas.FixedCostsByJar)),
        create: oc.input(schemas.FixedCost.omit({ id: true })).output(schemas.FixedCost),
        update: oc
            .input(
                schemas.FixedCost.partial().extend({
                    id: schemas.Id,
                    householdId: schemas.HouseholdId,
                })
            )
            .output(schemas.FixedCost),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
    },

    accounts: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Account)),
        create: oc
            .input(schemas.Account.omit({ id: true, connectionId: true, lastSyncedAt: true }))
            .output(schemas.Account),
    },

    transactions: {
        list: oc.input(schemas.ListTransactions).output(schemas.paginated(schemas.Transaction)),
        inbox: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Transaction)),
        create: oc.input(schemas.CreateTransaction).output(schemas.Transaction),
        update: oc
            .input(
                schemas.Transaction.partial().extend({
                    id: schemas.Id,
                    householdId: schemas.HouseholdId,
                })
            )
            .output(schemas.Transaction),
        sort: oc.input(schemas.SortTransaction).output(schemas.Transaction),
        bulkSort: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    transactionIds: z.array(schemas.Id).min(1),
                    jarId: schemas.Id,
                    categoryId: schemas.Id.nullish(),
                })
            )
            .output(z.object({ updated: z.int() })),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
        importCsv: oc.input(schemas.ImportCsv).output(schemas.ImportPreview),
    },

    rules: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Rule)),
        create: oc.input(schemas.Rule.omit({ id: true, hitCount: true })).output(schemas.Rule),
        update: oc
            .input(
                schemas.Rule.partial().extend({ id: schemas.Id, householdId: schemas.HouseholdId })
            )
            .output(schemas.Rule),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
        /** Re-runs isActive rules over unsorted history — the "clean my inbox" button. */
        replay: oc.input(schemas.HouseholdScoped).output(z.object({ sorted: z.int() })),
    },

    goals: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Goal)),
        create: oc
            .input(schemas.Goal.omit({ id: true, saved: true, fulfilledOn: true }))
            .output(schemas.Goal),
        update: oc
            .input(
                schemas.Goal.partial().extend({ id: schemas.Id, householdId: schemas.HouseholdId })
            )
            .output(schemas.Goal),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
        projections: oc.input(schemas.HouseholdScoped).output(z.array(schemas.GoalProjection)),
    },

    debts: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Debt)),
        create: oc.input(schemas.Debt.omit({ id: true })).output(schemas.Debt),
        update: oc
            .input(
                schemas.Debt.partial().extend({ id: schemas.Id, householdId: schemas.HouseholdId })
            )
            .output(schemas.Debt),
        remove: oc.input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id })).output(ok),
        plan: oc
            .input(
                schemas.HouseholdScoped.extend({
                    strategy: z.enum(PayoffStrategy).nullish(),
                })
            )
            .output(schemas.DebtPlan),
    },

    monthScore: {
        current: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey.nullish() }))
            .output(schemas.MonthScore),
        levels: oc.input(schemas.HouseholdScoped).output(z.array(schemas.Level)),
        recap: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey }))
            .output(schemas.PeriodRecap),
        /** Idempotent: closing an already-closed month score returns the existing recap. */
        close: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey }))
            .output(schemas.PeriodRecap),
    },

    weekCheck: {
        current: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey.nullish() }))
            .output(schemas.WeekCheck),
        advance: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    week: schemas.WeekKey,
                    stage: z.enum(WeekCheckStage),
                    allocations: z.array(schemas.WeekCheckAllocation).nullish(),
                    intention: z.string().max(280).nullish(),
                })
            )
            .output(schemas.WeekCheck),
        history: oc.input(schemas.HouseholdScoped).output(z.array(schemas.WeekCheck)),
    },

    dashboard: {
        get: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey.nullish() }))
            .output(schemas.Dashboard),
    },

    /** Backoffice company catalogs — read-only suggestions for create forms. */
    catalogs: {
        categoryTemplates: {
            list: oc
                .input(schemas.HouseholdScoped.extend({ jarKey: z.enum(JarKey).nullish() }))
                .output(z.array(schemas.CategoryTemplate)),
        },
        fixedCostPresets: {
            list: oc
                .input(
                    schemas.HouseholdScoped.extend({
                        jarKey: z.enum(JarKey).nullish(),
                        categoryTemplateKey: z.string().max(64).nullish(),
                        audienceTag: z.string().max(32).nullish(),
                    })
                )
                .output(z.array(schemas.FixedCostPreset)),
        },
        debtPresets: {
            list: oc
                .input(schemas.HouseholdScoped.extend({ kind: z.enum(DebtKind).nullish() }))
                .output(z.array(schemas.DebtPreset)),
        },
        incomeSourcePresets: {
            list: oc
                .input(schemas.HouseholdScoped.extend({ kind: z.enum(IncomeKind).nullish() }))
                .output(z.array(schemas.IncomeSourcePreset)),
        },
        goalPresets: {
            list: oc
                .input(schemas.HouseholdScoped.extend({ jarKey: z.enum(JarKey).nullish() }))
                .output(z.array(schemas.GoalPreset)),
        },
        merchantPresets: {
            list: oc
                .input(
                    schemas.HouseholdScoped.extend({
                        jarKey: z.enum(JarKey).nullish(),
                        categoryTemplateKey: z.string().max(64).nullish(),
                        mcc: z.string().length(4).nullish(),
                    })
                )
                .output(z.array(schemas.MerchantPreset)),
        },
    },
};

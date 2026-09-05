import { z } from 'zod';

import {
    Currency,
    HouseholdKind,
    HouseholdRole,
    IncomeRhythm,
    Locale,
    MoneyCharacter,
    PayoffStrategy,
    PlanKey,
} from '../../../enums';
import { HouseholdId, Id, UserId } from '../../../common/schemas';

export { HouseholdKind, HouseholdRole, IncomeRhythm, MoneyCharacter } from '../../../enums';

/**
 * Household is the isolation boundary. Every financial row carries householdId and
 * is filtered by it in one place — see apps/backend/src/common/household.
 * Backed by better-auth's organization plugin so invites/roles come for free.
 */
export const Household = z.object({
    id: HouseholdId,
    name: z.string().min(1).max(120),
    slug: z.string().min(1).max(120),
    /** Accounting currency for the board — shared by every member. */
    currency: z.enum(Currency),
    /** Day of month the budget period rolls over. 1 for most, 25 for salary-day budgeters. */
    periodStartDay: z.int().min(1).max(28),
    createdAt: z.iso.datetime(),
});
export type Household = z.infer<typeof Household>;

export const HouseholdMember = z.object({
    id: Id,
    householdId: HouseholdId,
    userId: UserId,
    role: z.enum(HouseholdRole),
    name: z.string(),
    email: z.email(),
    image: z.url().nullable(),
});

/** Shared money-board prefs (period, income picture, debt order). */
export const HouseholdMoneySettings = z.object({
    /** Budget rollover day. 1 for most, 25 for salary-day budgeters. */
    periodStartDay: z.int().min(1).max(28),
    /** Stable vs variable household income picture. */
    incomeRhythm: z.enum(IncomeRhythm),
    /** Avalanche / snowball — one order for the shared debt list. */
    payoffStrategy: z.enum(PayoffStrategy),
});
export type HouseholdMoneySettings = z.infer<typeof HouseholdMoneySettings>;

/** Weekly ritual reminder — null day/at disables the nudge. */
export const HouseholdRitualSettings = z.object({
    /** ISO weekday, 1 = Monday. */
    reminderDay: z.int().min(1).max(7).nullable(),
    /** Local time HH:mm. */
    reminderAt: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        .nullable(),
});
export type HouseholdRitualSettings = z.infer<typeof HouseholdRitualSettings>;

/** Product feature toggles for the board. */
export const HouseholdFeatureSettings = z.object({
    isBankSyncEnabled: z.boolean(),
    isCoachEnabled: z.boolean(),
});
export type HouseholdFeatureSettings = z.infer<typeof HouseholdFeatureSettings>;

/**
 * Extensible household Q&A (onboarding / coach prompts).
 * Keys are stable question ids; values are primitives.
 */
export const HouseholdAnswers = z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()])
);
export type HouseholdAnswers = z.infer<typeof HouseholdAnswers>;

/**
 * Money-board prefs for the household. Language, appearance, and money character
 * live on AccountSettings — they can differ per person in the same household.
 *
 * Grouped: general identity → product → money / ritual / features bags → answers.
 * `onboardedAt` is set when `household.onboard` finishes (board + jars seeded).
 */
export const HouseholdSettings = z.object({
    householdId: HouseholdId,
    /** Surfaced on the dashboard as the "why" line. */
    why: z.string().max(500).nullable().optional(),
    kind: z.enum(HouseholdKind),
    currency: z.enum(Currency),
    /** Product tier for the board — Basic / Plus / Max. */
    planKey: z.enum(PlanKey),
    money: HouseholdMoneySettings,
    ritual: HouseholdRitualSettings,
    features: HouseholdFeatureSettings,
    answers: HouseholdAnswers,
    /** When household board setup completed; null = incomplete. */
    onboardedAt: z.iso.datetime().nullable(),
});
export type HouseholdSettings = z.infer<typeof HouseholdSettings>;

/** Partial nested patch for updateSettings (deep-merge on the server). */
export const HouseholdSettingsPatch = z.object({
    householdId: HouseholdId,
    why: z.string().max(500).nullable().optional(),
    kind: z.enum(HouseholdKind).optional(),
    currency: z.enum(Currency).optional(),
    planKey: z.enum(PlanKey).optional(),
    money: HouseholdMoneySettings.partial().optional(),
    ritual: HouseholdRitualSettings.partial().optional(),
    features: HouseholdFeatureSettings.partial().optional(),
    answers: HouseholdAnswers.optional(),
});
export type HouseholdSettingsPatch = z.infer<typeof HouseholdSettingsPatch>;

/** Onboarding writes income + split + prefs in one transaction. */
export const OnboardingInput = z.object({
    householdName: z.string().min(1).max(120),
    kind: z.enum(HouseholdKind).default(HouseholdKind.SOLO),
    currency: z.enum(Currency).default(Currency.EUR),
    /** Creator's language — stored on their AccountSettings, not the board. */
    locale: z.enum(Locale).default(Locale.NL),
    /** Creator's money style — person-scoped AccountSettings. */
    moneyCharacter: z.enum(MoneyCharacter).default(MoneyCharacter.UNKNOWN),
    /** Board income volatility. */
    incomeRhythm: z.enum(IncomeRhythm).default(IncomeRhythm.STABLE),
    /** Board debt payoff default (optional at onboard). */
    payoffStrategy: z.enum(PayoffStrategy).default(PayoffStrategy.AVALANCHE),
    monthlyNetIncome: z.int().min(0),
    split: z.array(z.object({ key: z.string(), percentage: z.number().min(0).max(100) })),
    why: z.string().max(500).nullable().default(null),
});

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
} from '../../enums';
import { HouseholdId, Id, UserId } from '../common';

export { HouseholdKind, HouseholdRole, IncomeRhythm, MoneyCharacter } from '../../enums';

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

/**
 * Money-board prefs for the household. Language, appearance, and money character
 * live on AccountSettings — they can differ per person in the same household.
 */
export const HouseholdSettings = z.object({
    householdId: HouseholdId,
    kind: z.enum(HouseholdKind),
    currency: z.enum(Currency),
    /** Product tier for the board — Basic / Plus / Max. */
    planKey: z.enum(PlanKey),
    periodStartDay: z.int().min(1).max(28),
    /** Weekly ritual reminder, local time HH:mm, null disables it. */
    ritualReminderAt: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        .nullable(),
    ritualReminderDay: z.int().min(1).max(7).nullable(),
    isBankSyncEnabled: z.boolean(),
    isCoachEnabled: z.boolean(),
    /** Surfaced on the dashboard as the "why" line. */
    why: z.string().max(500).nullable().optional(),
    /** Avalanche / snowball — one order for the shared debt list. */
    payoffStrategy: z.enum(PayoffStrategy),
    /** Stable vs variable household income picture. */
    incomeRhythm: z.enum(IncomeRhythm),
});
export type HouseholdSettings = z.infer<typeof HouseholdSettings>;

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

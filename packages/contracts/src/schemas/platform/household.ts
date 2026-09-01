import { z } from 'zod';
import { Currency, HouseholdId, Id, Locale, Theme, UserId } from '../common.js';

/**
 * Household is the tenant boundary. Every financial row carries householdId and is
 * filtered by it in one middleware — see apps/backend/src/common/tenancy.
 * Backed by better-auth's organization plugin so invites/roles come for free.
 */
export const HouseholdRole = z.enum(['OWNER', 'PARTNER', 'VIEWER']);
export type HouseholdRole = z.infer<typeof HouseholdRole>;

export const Household = z.object({
    id: HouseholdId,
    name: z.string().min(1).max(120),
    slug: z.string().min(1).max(120),
    currency: Currency,
    locale: Locale,
    /** Day of month the budget period rolls over. 1 for most, 25 for salary-day budgeters. */
    periodStartDay: z.int().min(1).max(28),
    createdAt: z.iso.datetime(),
});
export type Household = z.infer<typeof Household>;

export const HouseholdMember = z.object({
    id: Id,
    householdId: HouseholdId,
    userId: UserId,
    role: HouseholdRole,
    name: z.string(),
    email: z.email(),
    image: z.url().nullable(),
});

export const HouseholdSettings = z.object({
    householdId: HouseholdId,
    theme: Theme,
    locale: Locale,
    currency: Currency,
    periodStartDay: z.int().min(1).max(28),
    /** Weekly ritual reminder, local time HH:mm, null disables it. */
    ritualReminderAt: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        .nullable(),
    ritualReminderDay: z.int().min(1).max(7).nullable(),
    bankSyncEnabled: z.boolean(),
    coachEnabled: z.boolean(),
    /** Surfaced on the dashboard as the "why" line. */
    why: z.string().max(500).nullable().optional(),
});
export type HouseholdSettings = z.infer<typeof HouseholdSettings>;

/** Onboarding writes income + split + fixed costs in one transaction. */
export const OnboardingInput = z.object({
    householdName: z.string().min(1).max(120),
    currency: Currency.default('EUR'),
    locale: Locale.default('nl'),
    monthlyNetIncome: z.int().min(0),
    split: z.array(z.object({ key: z.string(), percentage: z.number().min(0).max(100) })),
    why: z.string().max(500).nullable().default(null),
});

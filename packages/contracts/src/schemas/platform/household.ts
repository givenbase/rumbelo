import { z } from 'zod';
import { Currency, HouseholdId, Id, Locale, Theme, UserId } from '../common';

/**
 * Household is the isolation boundary. Every financial row carries householdId and
 * is filtered by it in one place — see apps/backend/src/common/household.
 * Backed by better-auth's organization plugin so invites/roles come for free.
 */
/**
 * Capability tier of one member — deliberately neutral (owner/member/viewer, the
 * Notion/GitHub triple) so it fits couples, families, kids and friend groups
 * alike. Relationship labels ("Partner", "Kid") are UI copy driven by the
 * household's `kind`, never role values. Maps 1:1 to Better Auth org roles.
 */
export const HouseholdRole = z.enum(['OWNER', 'MEMBER', 'VIEWER']);
export type HouseholdRole = z.infer<typeof HouseholdRole>;

/**
 * Nature of the group sharing the board. Drives copy and module defaults only —
 * never permissions (that is the member's role) and never query scoping.
 */
export const HouseholdKind = z.enum(['family', 'partners', 'friends', 'solo']);
export type HouseholdKind = z.infer<typeof HouseholdKind>;

export const Household = z.object({
    id: HouseholdId,
    name: z.string().min(1).max(120),
    slug: z.string().min(1).max(120),
    /** Accounting currency for the board — shared by every member. */
    currency: Currency,
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

/**
 * Money-board prefs for the household. Language and appearance live on
 * AccountSettings — they can differ per person in the same household.
 */
export const HouseholdSettings = z.object({
    householdId: HouseholdId,
    kind: HouseholdKind,
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
    kind: HouseholdKind.default('solo'),
    currency: Currency.default('EUR'),
    /** Creator's language — stored on their AccountSettings, not the board. */
    locale: Locale.default('nl'),
    monthlyNetIncome: z.int().min(0),
    split: z.array(z.object({ key: z.string(), percentage: z.number().min(0).max(100) })),
    why: z.string().max(500).nullable().default(null),
});

/**
 * Common Schemas
 * Cross-product primitives (ids, money, periods, pagination, household scope).
 */

import { z } from 'zod';

import { Cadence, Currency, Locale, Theme } from './common.enums';

export { Cadence, Currency, Locale, Theme } from './common.enums';

/** Rumtelo-owned entity ids — Postgres `uuid` (uuid v7 via BaseEntity). */
export const Id = z.uuid();

/**
 * Better Auth entity ids — Postgres `uuid` (`advanced.database.generateId: "uuid"`).
 * Still distinct from {@link Id} (BA-owned vs Rumtelo-owned rows).
 */
export const AuthId = z.uuid();

/** Better Auth household id (`auth.household.id`). */
export const HouseholdId = AuthId;

/** Better Auth user id (`auth.user.id`). */
export const UserId = AuthId;

/** Better Auth membership row id (`auth.member.id`). */
export const MemberId = AuthId;

/**
 * Money is stored and transported as integer minor units (eurocents) — never floats.
 * Rounding errors in a budgeting app are not cosmetic; they break reconciliation.
 */
export const Money = z.int();

export const CurrencySchema = z.enum(Currency);
export const LocaleSchema = z.enum(Locale);
export const ThemeSchema = z.enum(Theme);
export const CadenceSchema = z.enum(Cadence);

/** Shared list-row fields for company catalog DTOs (templates, presets, taxonomies). */
export const CatalogItemBase = z.object({
    key: z.string().min(1).max(64),
    name: z.string().min(1).max(120),
    sortOrder: z.int(),
});

/** A budget period is one calendar month, keyed as YYYY-MM — one month-score window. */
export const PeriodKey = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM');

/** An ISO week, keyed as YYYY-Www — the unit of the weekly week check. */
export const WeekKey = z.string().regex(/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/, 'Expected YYYY-Www');

/**
 * Minimal per-product week check shell (household + week + completion).
 * Product-specific fields live on each product's own richer type / columns.
 */
export const PortalWeekCheck = z.object({
    id: Id,
    householdId: HouseholdId,
    week: WeekKey,
    completedAt: z.iso.datetime().nullable(),
});

export const IsoDate = z.iso.date();

export const Pagination = z.object({
    limit: z.int().min(1).max(200).default(50),
    cursor: z.string().nullish(),
});

export const paginated = <T extends z.ZodType>(item: T) =>
    z.object({ items: z.array(item), nextCursor: z.string().nullable() });

/** Scope every mutation to a household explicitly; never infer it from the row being edited. */
export const HouseholdScoped = z.object({ householdId: HouseholdId });

// Inferred types (same-module merge for consumers)
export type Id = z.infer<typeof Id>;
export type AuthId = z.infer<typeof AuthId>;
export type HouseholdId = z.infer<typeof HouseholdId>;
export type UserId = z.infer<typeof UserId>;
export type MemberId = z.infer<typeof MemberId>;
export type Money = z.infer<typeof Money>;
export type CatalogItemBase = z.infer<typeof CatalogItemBase>;
export type PeriodKey = z.infer<typeof PeriodKey>;
export type WeekKey = z.infer<typeof WeekKey>;
export type PortalWeekCheck = z.infer<typeof PortalWeekCheck>;

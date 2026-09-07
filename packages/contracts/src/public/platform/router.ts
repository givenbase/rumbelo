import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdRole, PlanKey } from '../../enums';
import * as schemas from '../../schemas';

/** Platform-level: account prefs, the household itself, and cross-product advisory. */
export const contract = {
    account: {
        /** READ — structured profile + display name */
        profile: oc.output(schemas.AccountProfile),
        /** UPDATE — legal names / DOB / display name (syncs Better Auth `user.name`) */
        updateProfile: oc.input(schemas.AccountProfilePatch).output(schemas.AccountProfile),
        /** CREATE */
        createSettings: oc
            .input(schemas.AccountSettings.partial().omit({ accountId: true, onboardedAt: true }))
            .output(schemas.AccountSettings),
        /** READ — current authenticated user's settings */
        settings: oc.output(schemas.AccountSettings),
        /** UPDATE */
        updateSettings: oc
            .input(schemas.AccountSettings.partial().omit({ accountId: true, onboardedAt: true }))
            .output(schemas.AccountSettings),
        /** DELETE */
        deleteSettings: oc
            .input(z.object({ id: schemas.Id }))
            .output(z.object({ ok: z.literal(true) })),
    },
    household: {
        list: oc.output(z.array(schemas.Household)),
        current: oc.input(z.object({ householdId: schemas.HouseholdId })).output(schemas.Household),
        members: oc.input(schemas.HouseholdScoped).output(z.array(schemas.HouseholdMember)),
        settings: oc.input(schemas.HouseholdScoped).output(schemas.HouseholdSettings),
        updateSettings: oc.input(schemas.HouseholdSettingsPatch).output(schemas.HouseholdSettings),
        onboard: oc.input(schemas.OnboardingInput).output(schemas.Household),
        invite: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    email: z.email(),
                    role: z.enum(HouseholdRole),
                })
            )
            .output(z.object({ invitationId: schemas.AuthId })),
    },
    /** Product tier catalog (Basic / Plus / Max). */
    plans: {
        list: oc.output(z.array(schemas.PlanCatalogItem)),
    },
    /** Stripe Checkout for Plus / Max; downgrades apply at period end. */
    billing: {
        status: oc.input(schemas.HouseholdScoped).output(schemas.HouseholdBillingStatus),
        createCheckoutSession: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    planKey: z.enum([PlanKey.PLUS, PlanKey.MAX]),
                    interval: z.enum(['month', 'year']),
                })
            )
            .output(
                z.object({
                    /** Checkout URL when a new subscription is needed. */
                    url: z.url().nullable(),
                    /** True when an existing subscription was upgraded in place (proration). */
                    applied: z.boolean(),
                })
            ),
        /**
         * Downgrade / cancel — keeps current entitlements until period end
         * (industry standard). Preview / no-Stripe applies immediately.
         */
        schedulePlanChange: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    planKey: z.enum([PlanKey.BASIC, PlanKey.PLUS]),
                })
            )
            .output(schemas.HouseholdBillingStatus),
        /**
         * Stripe Customer Portal — payment methods, invoices, cancel / change plan.
         * Changes sync back via webhooks (`customer.subscription.*`).
         */
        createPortalSession: oc
            .input(z.object({ householdId: schemas.HouseholdId }))
            .output(z.object({ url: z.url() })),
    },
    coach: {
        feed: oc
            .input(schemas.HouseholdScoped.extend({ period: schemas.PeriodKey.nullish() }))
            .output(z.array(schemas.CoachMessage)),
        dismiss: oc
            .input(z.object({ householdId: schemas.HouseholdId, id: schemas.Id }))
            .output(z.object({ ok: z.literal(true) })),
    },
};

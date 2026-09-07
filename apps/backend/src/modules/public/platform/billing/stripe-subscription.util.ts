import type Stripe from 'stripe';

import { PlanKey } from '@rumbelo/contracts';

import {
    planKeyFromStripeLookupKey,
    type PaidPlanKey,
} from './config/stripe-plans.config';

/** Statuses that mean the subscriber still has paid access. */
const ACTIVE_SUB_STATUSES = new Set<Stripe.Subscription.Status>(['active', 'trialing']);

export function isActiveSubscriptionStatus(status: Stripe.Subscription.Status): boolean {
    return ACTIVE_SUB_STATUSES.has(status);
}

export function customerIdFromStripe(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | null {
    if (!customer) return null;
    if (typeof customer === 'string') return customer;
    if ('deleted' in customer && customer.deleted) return null;
    return customer.id;
}

export function subscriptionIdFromCheckout(
    subscription: string | Stripe.Subscription | null | undefined
): string | null {
    if (!subscription) return null;
    return typeof subscription === 'string' ? subscription : subscription.id;
}

/**
 * Resolve Plus/Max from the subscription's first price lookup_key,
 * falling back to metadata.planKey.
 */
export function planKeyFromSubscription(subscription: Stripe.Subscription): PaidPlanKey | null {
    const item = subscription.items.data[0];
    const lookupKey = item?.price?.lookup_key ?? null;
    const fromLookup = planKeyFromStripeLookupKey(lookupKey);
    if (fromLookup) return fromLookup;

    const meta = subscription.metadata?.planKey;
    if (meta === PlanKey.PLUS || meta === PlanKey.MAX) return meta;
    return null;
}

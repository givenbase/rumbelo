import { z } from 'zod';

/** Display fields from `stripe.prices.retrieve` (plus expanded product name). */
export const BillingPriceDisplay = z.object({
    priceId: z.string(),
    /** Stripe `unit_amount` in the smallest currency unit (e.g. cents). */
    amountCents: z.number().int().nonnegative(),
    currency: z.string(),
    /** Price nickname, else Product name, else null. */
    label: z.string().nullable(),
});
export type BillingPriceDisplay = z.infer<typeof BillingPriceDisplay>;

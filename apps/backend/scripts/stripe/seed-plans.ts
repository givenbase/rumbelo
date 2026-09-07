#!/usr/bin/env tsx
/**
 * Create Rumbelo Plus / Max Stripe Products + recurring Prices (idempotent).
 *
 * Mirrors Meltizo's website-plan-package.stripe.ts pattern: stable lookup_keys
 * so test and live accounts share the same code paths after seeding each one.
 *
 * Usage (from apps/backend, with STRIPE_SECRET_KEY set):
 *   pnpm stripe:seed-plans
 */
import { join } from 'node:path';

import { config as loadDotenv } from 'dotenv';
import Stripe from 'stripe';

import {
    STRIPE_PLAN_CATALOG,
    STRIPE_PLAN_LOOKUP_KEYS,
    type BillingInterval,
    type PaidPlanKey,
} from '../../src/modules/public/platform/billing/config/stripe-plans.config';

loadDotenv({ path: join(process.cwd(), '.env') });
loadDotenv({ path: join(process.cwd(), '.env.local') });

const PLAN_KEYS = Object.keys(STRIPE_PLAN_CATALOG) as PaidPlanKey[];
const INTERVALS: BillingInterval[] = ['month', 'year'];

async function ensureProduct(stripe: Stripe, planKey: PaidPlanKey): Promise<Stripe.Product> {
    const catalog = STRIPE_PLAN_CATALOG[planKey];
    const existing = await stripe.products.search({
        query: `metadata['plan_key']:'${planKey}' AND metadata['product_type']:'subscription'`,
        limit: 1,
    });

    const payload = {
        name: catalog.name,
        description: catalog.description,
        metadata: {
            plan_key: planKey,
            product_type: 'subscription',
            category: 'rumbelo',
        },
    };

    if (existing.data.length > 0) {
        const product = existing.data[0]!;
        await stripe.products.update(product.id, payload);
        console.log(`↻ Product ${planKey}: ${product.id}`);
        return product;
    }

    const product = await stripe.products.create({
        ...payload,
        tax_code: 'txcd_10103001',
    });
    console.log(`✓ Product ${planKey}: ${product.id}`);
    return product;
}

async function ensurePrice(
    stripe: Stripe,
    productId: string,
    planKey: PaidPlanKey,
    interval: BillingInterval
): Promise<Stripe.Price> {
    const catalog = STRIPE_PLAN_CATALOG[planKey];
    const lookupKey = STRIPE_PLAN_LOOKUP_KEYS[planKey][interval];
    const amountMajor = catalog[interval];

    const existing = await stripe.prices.list({
        lookup_keys: [lookupKey],
        limit: 1,
        active: true,
    });

    if (existing.data.length > 0) {
        const price = existing.data[0]!;
        console.log(`  ⏭  ${lookupKey} → ${price.id} (exists)`);
        return price;
    }

    const price = await stripe.prices.create({
        product: productId,
        unit_amount: amountMajor * 100,
        currency: catalog.currency,
        recurring: { interval },
        lookup_key: lookupKey,
        nickname: `${catalog.name} — ${interval === 'month' ? 'Monthly' : 'Yearly'}`,
        metadata: {
            plan_key: planKey,
            billing_interval: interval,
        },
    });

    console.log(
        `  ✓  ${lookupKey} → ${price.id} (€${amountMajor}/${interval === 'month' ? 'mo' : 'yr'})`
    );
    return price;
}

async function main() {
    const secret = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secret) {
        console.error('❌ STRIPE_SECRET_KEY is required (set in apps/backend/.env)');
        process.exit(1);
    }

    const stripe = new Stripe(secret);
    const mode = secret.startsWith('sk_live') ? 'live' : 'test';
    console.log(`\n💳 Seeding Rumbelo Stripe catalog (${mode} mode)\n`);

    const envLines: string[] = [];

    for (const planKey of PLAN_KEYS) {
        console.log(`\n📦 ${STRIPE_PLAN_CATALOG[planKey].name}`);
        const product = await ensureProduct(stripe, planKey);

        for (const interval of INTERVALS) {
            const price = await ensurePrice(stripe, product.id, planKey, interval);
            const envName =
                interval === 'month'
                    ? `STRIPE_PRICE_ID_${planKey}_MONTHLY`
                    : `STRIPE_PRICE_ID_${planKey}_YEARLY`;
            envLines.push(`${envName}=${price.id}`);
        }
    }

    console.log('\n✅ Catalog ready. Lookup keys (preferred — already wired in BillingService):');
    for (const planKey of PLAN_KEYS) {
        for (const interval of INTERVALS) {
            console.log(`   ${STRIPE_PLAN_LOOKUP_KEYS[planKey][interval]}`);
        }
    }

    console.log('\n📋 Price IDs (optional reference / Dashboard):');
    for (const line of envLines) console.log(`   ${line}`);
    console.log('');
}

main().catch(err => {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
});

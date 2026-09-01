import { z } from 'zod';

/**
 * Fail fast on boot rather than at the first request. A finance backend with a
 * half-configured environment is worse than one that refuses to start.
 */
const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3002),

    DATABASE_URL: z.string().min(1),
    DATABASE_SSL: z
        .union([z.boolean(), z.enum(['true', 'false', '0', '1'])])
        .default(false)
        .transform(v => v === true || v === 'true' || v === '1'),
    REDIS_URL: z.string().optional(),

    BETTER_AUTH_SECRET: z.string().min(32, 'Use at least 32 chars; this signs sessions'),

    /** Public origins — mirror NEXT_PUBLIC_DOMAIN_* in the Next apps. */
    DOMAIN_APP: z.url(),
    DOMAIN_WEB: z.url(),
    DOMAIN_BACK: z.url(),

    /** Bank sync stays off until an aggregator is configured. CSV import is always on. */
    FEATURE_BANK_SYNC: z
        .union([z.boolean(), z.enum(['true', 'false', '0', '1'])])
        .default(false)
        .transform(v => v === true || v === 'true' || v === '1'),
    ENABLE_BANKING_APP_ID: z.string().optional(),
    ENABLE_BANKING_PRIVATE_KEY: z.string().optional(),

    ANTHROPIC_API_KEY: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
    const parsed = EnvSchema.safeParse(source);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`);
        throw new Error(`Invalid environment:\n${issues.join('\n')}`);
    }
    if (parsed.data.FEATURE_BANK_SYNC && !parsed.data.ENABLE_BANKING_APP_ID) {
        throw new Error('FEATURE_BANK_SYNC is on but ENABLE_BANKING_APP_ID is missing');
    }
    return parsed.data;
}

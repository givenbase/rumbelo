import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

const isProdBuild = process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION;

/** Required URL in production builds; localhost default in local/dev. */
const publicUrl = (devDefault: string) => (isProdBuild ? z.url() : z.url().default(devDefault));

/**
 * Typed env for `@rumbelo/application` via `@t3-oss/env-nextjs` (same pattern as Meltizo / Galighticus).
 *
 * - Client vars must be `NEXT_PUBLIC_*`
 * - Access via `env.NEXT_PUBLIC_…` — never raw `process.env` for declared keys
 * - Set `SKIP_ENV_VALIDATION=1` to skip (Docker / CI without full env)
 */
export const env = createEnv({
    client: {
        /* -------------------- API / AUTH -------------------- */
        NEXT_PUBLIC_API_URL: publicUrl('http://localhost:3002/rpc'),
        NEXT_PUBLIC_AUTH_URL: publicUrl('http://localhost:3002/api/auth'),

        /* -------------------- DESIGN PREVIEW -------------------- */
        /** Force fixtures even when signed in. Accepts true/false (string). */
        NEXT_PUBLIC_PREVIEW_MODE: z.enum(['true', 'false']).optional(),
        /** Plan override: grip | ritme | groei | all | max | full */
        NEXT_PUBLIC_PREVIEW_PLAN: z
            .enum(['grip', 'ritme', 'groei', 'all', 'max', 'full'])
            .optional(),

        /* -------------------- MONITORING (optional) -------------------- */
        NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    },

    emptyStringAsUndefined: true,

    runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_PREVIEW_MODE: process.env.NEXT_PUBLIC_PREVIEW_MODE,
        NEXT_PUBLIC_PREVIEW_PLAN: process.env.NEXT_PUBLIC_PREVIEW_PLAN,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

        NODE_ENV: process.env.NODE_ENV,
        SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
        PORT: process.env.PORT,
    },

    server: {
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development').optional(),
        SKIP_ENV_VALIDATION: z.string().optional(),
        PORT: z.coerce.number().default(3000).optional(),
    },

    skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});

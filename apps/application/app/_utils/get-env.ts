import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

const isProdBuild = process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION;

const portalOrigin = (devDefault: string) => (isProdBuild ? z.url() : z.url().default(devDefault));

/**
 * Three public origins — same shape for every app:
 *
 *   NEXT_PUBLIC_DOMAIN_APP  → product
 *   NEXT_PUBLIC_DOMAIN_WEB  → marketing
 *   NEXT_PUBLIC_DOMAIN_BACK → Nest origin (proxied via app `/api/backend` + `/api/auth`)
 */
export const env = createEnv({
    client: {
        NEXT_PUBLIC_DOMAIN_APP: portalOrigin('http://localhost:3000'),
        NEXT_PUBLIC_DOMAIN_WEB: portalOrigin('http://localhost:3001'),
        NEXT_PUBLIC_DOMAIN_BACK: portalOrigin('http://localhost:3002'),

        NEXT_PUBLIC_PREVIEW_MODE: z.enum(['true', 'false']).optional(),
        NEXT_PUBLIC_PREVIEW_PLAN: z
            .enum(['GRIP', 'RITME', 'GROEI', 'ALL', 'MAX', 'FULL'])
            .optional(),

        NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    },

    emptyStringAsUndefined: true,

    runtimeEnv: {
        NEXT_PUBLIC_DOMAIN_APP: process.env.NEXT_PUBLIC_DOMAIN_APP,
        NEXT_PUBLIC_DOMAIN_WEB: process.env.NEXT_PUBLIC_DOMAIN_WEB,
        NEXT_PUBLIC_DOMAIN_BACK: process.env.NEXT_PUBLIC_DOMAIN_BACK,

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

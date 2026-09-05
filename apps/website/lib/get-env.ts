import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const isProdBuild = process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION;

const portalOrigin = (devDefault: string) => (isProdBuild ? z.url() : z.url().default(devDefault));

/**
 * Marketing site — public origins only (no Nest proxies).
 *
 *   NEXT_PUBLIC_DOMAIN_APP  → product (sign-in / sign-up CTAs)
 *   NEXT_PUBLIC_DOMAIN_WEB  → this site
 *   NEXT_PUBLIC_DOMAIN_BACK → Nest public (rare links; browsers use the app)
 *
 * Railway Website service:
 *   NEXT_PUBLIC_DOMAIN_APP=https://${{Application.RAILWAY_PUBLIC_DOMAIN}}
 *   NEXT_PUBLIC_DOMAIN_WEB=https://${{Website.RAILWAY_PUBLIC_DOMAIN}}
 *   NEXT_PUBLIC_DOMAIN_BACK=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
 */
export const env = createEnv({
    client: {
        NEXT_PUBLIC_DOMAIN_APP: portalOrigin('http://localhost:3000'),
        NEXT_PUBLIC_DOMAIN_WEB: portalOrigin('http://localhost:3001'),
        NEXT_PUBLIC_DOMAIN_BACK: portalOrigin('http://localhost:3002'),
    },

    emptyStringAsUndefined: true,

    runtimeEnv: {
        NEXT_PUBLIC_DOMAIN_APP: process.env.NEXT_PUBLIC_DOMAIN_APP,
        NEXT_PUBLIC_DOMAIN_WEB: process.env.NEXT_PUBLIC_DOMAIN_WEB,
        NEXT_PUBLIC_DOMAIN_BACK: process.env.NEXT_PUBLIC_DOMAIN_BACK,
        NODE_ENV: process.env.NODE_ENV,
        SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
    },

    server: {
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development').optional(),
        SKIP_ENV_VALIDATION: z.string().optional(),
    },

    skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});

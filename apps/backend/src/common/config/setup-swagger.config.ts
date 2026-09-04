import { Logger } from '@nestjs/common';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import {
    DocumentBuilder,
    type SwaggerCustomOptions,
    type SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';

import type { Env } from './env.config';

const swaggerLogger = new Logger('Swagger');

/** Enable in development by default; elsewhere require ENABLE_SWAGGER=true. */
export function isSwaggerEnabled(env: Env): boolean {
    if (env.NODE_ENV === 'development') return true;
    return env.ENABLE_SWAGGER === true;
}

export async function setupSwagger(app: NestFastifyApplication, env: Env): Promise<void> {
    if (!isSwaggerEnabled(env)) {
        swaggerLogger.log('Swagger disabled (set ENABLE_SWAGGER=true to enable outside development)');
        return;
    }

    const config = new DocumentBuilder()
        .setTitle(`Rumbelo API (${env.NODE_ENV})`)
        .setDescription(
            `
Household money / energy / growth / soul API — **~70 oRPC procedures** under Public + Auth tags.

## In this UI
Product controllers: household, money (jars, income, ledger, turn, …), growth, energy, soul, account settings.

## Not listed here (yet)
- **better-auth** session routes live at \`/api/auth/*\` (sign-in/up via the app) — not Nest controllers.
- **Backoffice** catalogs (plans, jar templates) are server-side only — no public HTTP surface.
- **System pages** (\`/health\`, \`/email-preview\`) are HTML/JSON probes, excluded from this doc.

## Auth for Try it out
Cookie session from the application. Optional header: \`x-household-id\`.
        `.trim()
        )
        .setVersion('0.1.0')
        .addCookieAuth('session')
        .addApiKey(
            { type: 'apiKey', name: 'x-household-id', in: 'header', description: 'Active household id' },
            'household'
        )
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        deepScanRoutes: true,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
            tryItOutEnabled: true,
            docExpansion: 'list',
            filter: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            displayRequestDuration: true,
        },
        customSiteTitle: 'Rumbelo API',
    };

    SwaggerModule.setup('api/docs', app, document, customOptions);
    swaggerLogger.log(`Swagger UI at /api/docs`);
}

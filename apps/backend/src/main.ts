import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppModule } from './app.module.js';
import { loadEnv } from './common/config/env.config.js';

import 'reflect-metadata';

function loadRootEnvFile() {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i++) {
        const candidate = resolve(dir, '.env');
        if (existsSync(candidate)) {
            loadDotenv({ path: candidate, override: true });
            return;
        }
        dir = resolve(dir, '..');
    }
}

async function bootstrap() {
    loadRootEnvFile();
    const env = loadEnv();

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule.forRoot(env),
        new FastifyAdapter({ trustProxy: true, bodyLimit: 8 * 1024 * 1024 }),
        { bufferLogs: true }
    );

    await app.register(helmet, { contentSecurityPolicy: false });
    await app.register(cookie, { secret: env.BETTER_AUTH_SECRET });
    await app.register(cors, {
        // Credentials + wildcard origin is not permitted; enumerate the two frontends.
        origin: [env.APP_URL, env.WEB_URL],
        credentials: true,
        allowedHeaders: ['content-type', 'authorization', 'x-household-id'],
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.enableShutdownHooks();

    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    Logger.log(`Rumbelo API listening on :${env.PORT}`, 'Bootstrap');
}

void bootstrap();

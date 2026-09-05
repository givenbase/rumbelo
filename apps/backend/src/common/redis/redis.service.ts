import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

import { loadEnv } from '../config/env.config';

/**
 * Thin ioredis wrapper (Galighticus pattern).
 *
 * Reads `DATABASE_REDIS_URL`. When unset or unreachable, stays disabled —
 * callers check `isAvailable` and fall back in-memory if needed.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    /** Set only when `DATABASE_REDIS_URL` is configured. */
    client!: Redis;

    get isAvailable(): boolean {
        return this.client?.status === 'ready';
    }

    onModuleInit(): void {
        const url = loadEnv().DATABASE_REDIS_URL;

        if (!url) {
            this.logger.warn(
                'DATABASE_REDIS_URL not set — Redis disabled (in-memory fallback active)'
            );
            return;
        }

        this.client = new Redis(url, {
            lazyConnect: true,
            maxRetriesPerRequest: 3,
            // Stop retry loops — avoid blocking the process on a dead Redis.
            retryStrategy: () => null,
        });

        this.client.on('connect', () => this.logger.log('Redis connected'));
        this.client.on('error', (err: Error) => this.logger.warn(`Redis error: ${err.message}`));

        void this.client
            .connect()
            .catch((err: Error) =>
                this.logger.warn(
                    `Redis connection failed — falling back to in-memory: ${err.message}`
                )
            );
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client) await this.client.quit();
    }

    /** Round-trip probe for health checks. */
    async ping(): Promise<boolean> {
        if (!this.client) return false;
        try {
            return (await this.client.ping()) === 'PONG';
        } catch {
            return false;
        }
    }
}

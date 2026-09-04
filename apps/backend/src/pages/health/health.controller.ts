import { EntityManager } from '@mikro-orm/postgresql';
import {
    Inject,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Res,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { type FastifyReply } from 'fastify';

import { renderBrandPage } from '../shared/brand-shell';

type DbStatus = 'connected' | 'disconnected' | 'error';

/**
 * Health checks for Railway / load balancers — no auth, no throttle.
 * Browsers get a branded HTML page; probes (`Accept: application/json` / curl) get JSON.
 */
@ApiTags('Health')
@ApiExcludeController()
@SkipThrottle()
@AllowAnonymous()
@Controller()
export class HealthController {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    @Get('health')
    @ApiOperation({ summary: 'Liveness + DB probe' })
    async getHealth(
        @Headers('accept') accept: string | undefined,
        @Res() reply: FastifyReply
    ): Promise<void> {
        const { database, detail } = await this.probeDatabase();
        const body = {
            status: database === 'connected' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV ?? 'development',
            database,
            ...(detail ? { detail } : {}),
        };

        if (wantsHtml(accept)) {
            void reply.type('text/html').send(
                renderBrandPage({
                    title: 'Health',
                    eyebrow: body.status,
                    headline: body.status === 'ok' ? 'Alles draait' : 'Degraded',
                    message:
                        body.status === 'ok'
                            ? 'API en database zijn bereikbaar.'
                            : `Database: ${database}${detail ? ` — ${detail}` : ''}`,
                    code: body.status.toUpperCase(),
                    primaryHref: '/',
                    primaryLabel: 'API home',
                    secondaryHref: '/health/live',
                    secondaryLabel: 'Liveness JSON',
                    footerHtml: `uptime ${Math.floor(body.uptime)}s · ${body.environment}`,
                    lang: 'nl',
                })
            );
            return;
        }

        void reply.type('application/json').send(body);
    }

    @Get('health/ready')
    @ApiOperation({ summary: 'Readiness — DB must be connected' })
    async getReady() {
        const { database, detail } = await this.probeDatabase();
        if (database !== 'connected') {
            throw new ServiceUnavailableException({
                status: 'not ready',
                timestamp: new Date().toISOString(),
                database,
                ...(detail ? { detail } : {}),
            });
        }
        return {
            status: 'ready',
            timestamp: new Date().toISOString(),
            database: 'connected',
        };
    }

    @Get('health/live')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Liveness — process is up' })
    getLive() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
        };
    }

    /** Real round-trip — more reliable than `isConnected()` alone. */
    private async probeDatabase(): Promise<{ database: DbStatus; detail?: string }> {
        try {
            await this.em.getConnection().execute('select 1 as ok');
            return { database: 'connected' };
        } catch (error) {
            const detail = error instanceof Error ? error.message : 'Unknown error';
            return { database: 'error', detail };
        }
    }
}

function wantsHtml(accept: string | undefined): boolean {
    if (!accept) return false;
    const html = accept.includes('text/html');
    const json = accept.includes('application/json');
    return html && !json;
}

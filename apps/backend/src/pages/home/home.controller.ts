import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { type FastifyReply } from 'fastify';

import { loadEnv } from '../../common/config/env.config';
import { isSwaggerEnabled } from '../../common/config/setup-swagger.config';
import { escapeHtml, renderBrandPage } from '../shared/brand-shell';

/**
 * `/` — developer portal in development (or ENABLE_SWAGGER).
 * In production: minimal “API is online” page only (no docs / previews).
 */
@ApiExcludeController()
@AllowAnonymous()
@Controller()
export class HomeController {
    @Get()
    home(@Res() reply: FastifyReply): void {
        const env = loadEnv();

        if (!isSwaggerEnabled(env)) {
            const html = renderBrandPage({
                title: 'API',
                eyebrow: 'Online',
                headline: 'Rumbelo API',
                message: 'This API is running. Documentation and developer tools are not public.',
                code: 'OK',
                primaryHref: '/health',
                primaryLabel: 'Health check',
                secondaryHref: env.DOMAIN_WEB,
                secondaryLabel: 'Website',
                footerHtml: 'Operational probes only · no public API docs on this host.',
                lang: 'en',
            });
            void reply.type('text/html').send(html);
            return;
        }

        const links = [
            { href: '/api/docs', label: 'Swagger UI', hint: 'API docs' },
            { href: '/email-preview', label: 'Email preview', hint: 'Templates' },
            { href: '/health', label: 'Health', hint: 'JSON probe' },
            { href: env.DOMAIN_APP, label: 'Application', hint: 'Product' },
            { href: env.DOMAIN_WEB, label: 'Website', hint: 'Marketing' },
        ];

        const linksHtml = `<div class="links">${links
            .map(
                l =>
                    `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}<span>${escapeHtml(l.hint)}</span></a>`
            )
            .join('')}</div>`;

        const html = renderBrandPage({
            title: 'API',
            eyebrow: env.NODE_ENV,
            headline: 'Rumbelo API',
            message: 'Developer surface for this environment — docs, health, and previews.',
            primaryHref: '/api/docs',
            primaryLabel: 'Open Swagger',
            secondaryHref: '/health',
            secondaryLabel: 'Health check',
            bodyExtraHtml: linksHtml,
            lang: 'en',
        });

        void reply.type('text/html').send(html);
    }
}

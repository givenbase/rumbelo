import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { type FastifyReply } from 'fastify';

import { loadEnv } from '../../common/config/env.config';
import { renderBrandPage } from '../shared/brand-shell';

@ApiExcludeController()
@AllowAnonymous()
@Controller()
export class AccessDeniedController {
    @Get('access-denied')
    accessDenied(@Res() reply: FastifyReply): void {
        const env = loadEnv();
        const html = renderBrandPage({
            title: 'Geen toegang',
            eyebrow: 'Beperkt',
            headline: 'Geen toegang',
            message:
                'Dit deel van de API is alleen voor Rumbelo-systemen en bevoegde tools. Kwam je hier per ongeluk? Ga terug naar de site.',
            code: '403',
            primaryHref: env.DOMAIN_WEB,
            primaryLabel: 'Naar de website',
            secondaryHref: env.DOMAIN_APP,
            secondaryLabel: 'Naar de app',
            footerHtml:
                'Hulp nodig? Open de app of ga terug naar <a href="' +
                env.DOMAIN_WEB +
                '">rumbelo</a>.',
        });
        void reply.status(403).type('text/html').send(html);
    }
}

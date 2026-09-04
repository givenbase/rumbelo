import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { type FastifyReply } from 'fastify';

import { loadEnv } from '../../common/config/env.config';
import { isSwaggerEnabled } from '../../common/config/setup-swagger.config';
import { renderHouseholdInviteEmail } from '../../modules/backoffice/communication/email/templates/household-invite';

const TEMPLATES = ['household-invite'] as const;
type TemplateId = (typeof TEMPLATES)[number];

/**
 * Dev/docs-only browser preview of outbound email HTML.
 * Gated the same way as Swagger (dev, or ENABLE_SWAGGER).
 */
@ApiExcludeController()
@AllowAnonymous()
@Controller('email-preview')
export class EmailPreviewController {
    @Get()
    list() {
        this.assertEnabled();
        return {
            templates: TEMPLATES.map(id => ({
                id,
                preview: `/email-preview/${id}`,
            })),
        };
    }

    @Get(':template')
    preview(@Param('template') template: string, @Res() reply: FastifyReply): void {
        this.assertEnabled();

        if (!TEMPLATES.includes(template as TemplateId)) {
            throw new NotFoundException({
                message: 'Unknown template',
                available: [...TEMPLATES],
            });
        }

        void reply.type('text/html').send(this.render(template as TemplateId));
    }

    private assertEnabled(): void {
        const env = loadEnv();
        if (!isSwaggerEnabled(env)) {
            throw new NotFoundException('Email preview is disabled');
        }
    }

    private render(template: TemplateId): string {
        switch (template) {
            case 'household-invite': {
                const { html } = renderHouseholdInviteEmail({
                    to: 'demo@rumbelo.app',
                    householdName: 'Huishouden van Anna',
                    inviteUrl: 'https://app.rumbelo.local/invite/demo-id',
                    inviterName: 'Anna',
                    role: 'MEMBER',
                });
                return html;
            }
        }
    }
}

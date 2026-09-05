import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

import type { EmailProvider, HouseholdInviteEmailInput, SendEmailInput } from './email.types';

import { loadEnv } from '../../../../common/config/env.config';
import { renderHouseholdInviteEmail } from './templates/household-invite';

/**
 * Outbound email — Rumbelo writes (backoffice). Households never send.
 *
 * Providers:
 *   memory  — log only (default; safe for local)
 *   resend  — Resend API when EMAIL_PROVIDER=resend + RESEND_API_KEY
 * EMAIL_LOG_ONLY=true forces memory behaviour even when provider is resend.
 */
@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly provider: EmailProvider;
    private readonly defaultFrom: string;
    private readonly resend: Resend | undefined;
    private readonly appOrigin: string;

    constructor() {
        const env = loadEnv();
        this.provider = env.EMAIL_LOG_ONLY ? 'memory' : env.EMAIL_PROVIDER;
        this.defaultFrom = env.EMAIL_FROM;
        this.appOrigin = env.DOMAIN_APP.replace(/\/$/, '');

        if (this.provider === 'resend') {
            if (!env.RESEND_API_KEY) {
                this.logger.error('EMAIL_PROVIDER=resend but RESEND_API_KEY is missing');
            } else {
                this.resend = new Resend(env.RESEND_API_KEY);
            }
        }

        this.logger.log(
            `Email ready (provider=${this.provider}${env.EMAIL_LOG_ONLY ? ', log-only' : ''}, from=${this.defaultFrom})`
        );
    }

    // ====================================================================
    // ? CREATE Operations (send)
    // ====================================================================

    async send(input: SendEmailInput): Promise<boolean> {
        const to = Array.isArray(input.to) ? input.to : [input.to];
        const from = input.from ?? this.defaultFrom;

        if (this.provider === 'memory' || !this.resend) {
            this.logger.log({
                event: 'email.memory',
                to,
                subject: input.subject,
                preview: input.html.slice(0, 120),
            });
            return true;
        }

        const { error } = await this.resend.emails.send({
            from,
            to,
            subject: input.subject,
            html: input.html,
            text: input.text,
            replyTo: input.replyTo,
        });

        if (error) {
            this.logger.error(`Resend failed: ${error.message}`);
            return false;
        }

        this.logger.log(`Sent email to ${to.join(', ')} — ${input.subject}`);
        return true;
    }

    /** Household invite — called after better-auth createInvitation. */
    async sendHouseholdInvite(input: HouseholdInviteEmailInput): Promise<boolean> {
        const rendered = renderHouseholdInviteEmail(input);
        return this.send({
            to: input.to,
            subject: rendered.subject,
            html: rendered.html,
            text: rendered.text,
        });
    }

    /** Accept URL for an invitation id (application route). */
    inviteUrl(invitationId: string): string {
        return `${this.appOrigin}/invite/${invitationId}`;
    }
}

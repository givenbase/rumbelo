import type { FastifyReply, FastifyRequest } from 'fastify';

import {
    BadRequestException,
    Controller,
    Headers,
    HttpCode,
    Inject,
    Post,
    type RawBodyRequest,
    Req,
    Res,
} from '@nestjs/common';

import { BillingService } from './billing.service';

/**
 * Stripe webhook — raw body required for signature verification.
 * Public path (no household scope): `/webhooks/stripe`
 */
@Controller('webhooks')
export class StripeWebhookController {
    constructor(@Inject(BillingService) private readonly billing: BillingService) {}

    @Post('stripe')
    @HttpCode(200)
    async stripe(
        @Req() req: RawBodyRequest<FastifyRequest>,
        @Res({ passthrough: true }) _res: FastifyReply,
        @Headers('stripe-signature') signature: string | undefined
    ) {
        if (!signature) {
            throw new BadRequestException('missing stripe-signature');
        }
        const raw = req.rawBody;
        if (!raw) {
            throw new BadRequestException('missing raw body for Stripe signature');
        }
        await this.billing.handleWebhookEvent(raw, signature);
        return { received: true };
    }
}

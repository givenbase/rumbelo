import { Module } from '@nestjs/common';

import { EmailService } from './email.service';

/**
 * Transactional email (invites, digests later).
 * Provider defaults to memory (log-only) until Resend is configured.
 */
@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}

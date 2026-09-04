import { Module } from '@nestjs/common';

import { AccessDeniedModule } from './access-denied/access-denied.module';
import { EmailPreviewModule } from './email-preview/email-preview.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';

/**
 * Non-oRPC system pages on the API host:
 *   /                  — developer home (dev / ENABLE_SWAGGER)
 *   /access-denied     — branded 403
 *   /health*           — Railway / probes
 *   /email-preview*    — template HTML (dev / ENABLE_SWAGGER)
 */
@Module({
    imports: [HomeModule, AccessDeniedModule, HealthModule, EmailPreviewModule],
})
export class PagesModule {}

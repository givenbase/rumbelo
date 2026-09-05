import { Module } from '@nestjs/common';

import { AccessDeniedModule } from './access-denied/access-denied.module';
import { EmailPreviewModule } from './email-preview/email-preview.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';

/**
 * Non-oRPC system pages on the API host:
 *   /                  — prod: online status; dev: developer portal
 *   /access-denied     — branded 403 (Swagger / email-preview when gated)
 *   /health*           — Railway / probes (always on)
 *   /email-preview*    — template HTML (dev / ENABLE_SWAGGER only)
 */
@Module({
    imports: [HomeModule, AccessDeniedModule, HealthModule, EmailPreviewModule],
})
export class PagesModule {}

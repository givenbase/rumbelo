import { Module } from '@nestjs/common';

import { CommunicationModule } from './communication';
import { PlanModule } from './plan';
import { ReferenceModule } from './reference';

/**
 * Backoffice plane — Rumbelo writes; households/users do not.
 *
 *   reference/      catalogs (jar templates, …)
 *   plan/           Grip / Engine / Compound tiers
 *   communication/  outbound email (invites, digests later)
 *   content/        reserved — FAQ, tip templates
 *   billing/        only if Stripe needs its own home later
 */
@Module({
    imports: [ReferenceModule, PlanModule, CommunicationModule],
    exports: [ReferenceModule, PlanModule, CommunicationModule],
})
export class BackofficeModule {}

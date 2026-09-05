import { Module } from '@nestjs/common';

import { CommunicationModule } from './communication';
import { PlanModule } from './plan';
import { ProductModule } from './product';

/**
 * Backoffice plane — Rumbelo writes; households/users do not.
 *
 *   product/        catalogs tied to a product line (money, growth, …)
 *   reference/      reserved — cross-product lookups (countries, FAQ, …)
 *   plan/           Basic / Plus / Max tiers
 *   communication/  outbound email (invites, digests later)
 */
@Module({
    imports: [ProductModule, PlanModule, CommunicationModule],
    exports: [ProductModule, PlanModule, CommunicationModule],
})
export class BackofficeModule {}

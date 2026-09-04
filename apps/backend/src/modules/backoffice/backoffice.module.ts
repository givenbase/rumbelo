import { Module } from '@nestjs/common';

import { PlanModule } from './plan';
import { ReferenceModule } from './reference';

/**
 * Backoffice plane — Rumbelo writes; households/users do not.
 *
 *   reference/  catalogs we publish (jar templates, countries, …)
 *   plan/       Grip / Engine / Compound tiers (not money.plan jars)
 *   content/    reserved — question banks, FAQ, tip templates
 *   billing/    only if Stripe/invoices need their own home later
 */
@Module({
    imports: [ReferenceModule, PlanModule],
    exports: [ReferenceModule, PlanModule],
})
export class BackofficeModule {}

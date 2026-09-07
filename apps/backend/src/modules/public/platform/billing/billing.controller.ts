import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../common/decorators/controller-swagger.decorators';
import { BillingService } from './billing.service';

/** Transport only — Stripe Checkout for Plus / Max. */
@ControllerSwagger('billing', 'public')
export class BillingController {
    constructor(@Inject(BillingService) private readonly billing: BillingService) {}

    @Implement(contract.billing.status)
    status() {
        return implement(contract.billing.status).handler(() => this.billing.status());
    }

    @Implement(contract.billing.createCheckoutSession)
    createCheckoutSession() {
        return implement(contract.billing.createCheckoutSession).handler(({ input }) =>
            this.billing.createCheckoutSession({
                householdId: input.householdId,
                planKey: input.planKey,
                interval: input.interval,
            })
        );
    }
}

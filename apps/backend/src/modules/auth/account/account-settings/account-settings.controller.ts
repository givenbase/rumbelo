import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { AccountSettingsService } from './account-settings.service';

@Controller()
export class AccountSettingsController {
    constructor(private readonly settings: AccountSettingsService) {}

    @Implement(contract.account.settings)
    get() {
        return implement(contract.account.settings).handler(() => this.settings.get());
    }

    @Implement(contract.account.updateSettings)
    update() {
        return implement(contract.account.updateSettings).handler(({ input }) =>
            this.settings.update(input as never)
        );
    }
}

import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../common/decorators/controller-swagger.decorators';
import { AccountService } from './account.service';

/**
 * Account profile controller — legal / display identity for the signed-in person.
 */
@ControllerSwagger('account/profile', 'auth')
export class AccountController {
    constructor(@Inject(AccountService) private readonly accounts: AccountService) {}

    @Implement(contract.account.profile)
    get() {
        return implement(contract.account.profile).handler(() => this.accounts.getProfile());
    }

    @Implement(contract.account.updateProfile)
    update() {
        return implement(contract.account.updateProfile).handler(({ input }) =>
            this.accounts.updateProfile(input)
        );
    }
}

import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentPeriod } from '../../../../common/utils/period.util';
import { JarService } from './jar.service';

/** Transport only. All jar rules live in JarService. */
@Controller()
export class JarController {
    constructor(private readonly jars: JarService) {}

    @Implement(contract.money.jars.list)
    list() {
        return implement(contract.money.jars.list).handler(() => this.jars.list());
    }

    @Implement(contract.money.jars.balances)
    balances() {
        return implement(contract.money.jars.balances).handler(({ input }) =>
            this.jars.balances(input.period ?? currentPeriod())
        );
    }

    @Implement(contract.money.jars.updateSplit)
    updateSplit() {
        return implement(contract.money.jars.updateSplit).handler(({ input }) =>
            this.jars.updateSplit(input.split)
        );
    }

    @Implement(contract.money.jars.update)
    update() {
        return implement(contract.money.jars.update).handler(({ input }) =>
            this.jars.update(input.id, {
                name: input.name,
                subtitle: input.subtitle,
                icon: input.icon,
            })
        );
    }

    @Implement(contract.money.jars.createCategory)
    createCategory() {
        return implement(contract.money.jars.createCategory).handler(({ input }) =>
            this.jars.createCategory(input.jarId, input.name, input.budgeted)
        );
    }

    @Implement(contract.money.jars.updateCategory)
    updateCategory() {
        return implement(contract.money.jars.updateCategory).handler(({ input }) =>
            this.jars.updateCategory(input.id, {
                name: input.name,
                budgeted: input.budgeted,
                archived: input.archived,
            })
        );
    }

    @Implement(contract.money.jars.deleteCategory)
    deleteCategory() {
        return implement(contract.money.jars.deleteCategory).handler(async ({ input }) => {
            await this.jars.deleteCategory(input.id);
            return { ok: true as const };
        });
    }
}

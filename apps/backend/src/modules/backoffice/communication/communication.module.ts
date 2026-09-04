import { Module } from '@nestjs/common';

import { EmailModule } from './email';

/**
 * Outbound messaging we control — email first; SMS / newsletter later if needed.
 */
@Module({
    imports: [EmailModule],
    exports: [EmailModule],
})
export class CommunicationModule {}

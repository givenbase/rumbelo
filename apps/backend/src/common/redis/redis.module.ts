import { Global, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

/**
 * Global Redis client — import once in AppModule; inject RedisService anywhere.
 */
@Global()
@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}

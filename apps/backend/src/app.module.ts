import { Module, type DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { ORPCModule } from '@orpc/nest';

import ormConfig from '../mikro-orm.config.js';
import { createAuth } from './auth/auth.config.js';
import type { Env } from './common/config/env.config.js';
import { TenancyModule } from './common/tenancy/tenancy.module.js';
import { FeatureModules } from './modules/index.js';

@Module({})
export class AppModule {
  static forRoot(env: Env): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        MikroOrmModule.forRoot(ormConfig),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 240 }]),
        BetterAuthModule.forRoot({ auth: createAuth(env) }),
        ORPCModule.forRoot({ interceptors: [] }),
        TenancyModule,
        ...FeatureModules,
      ],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    };
  }
}

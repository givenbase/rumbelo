import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, type DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ORPCModule } from '@orpc/nest';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import type { Env } from './common/config/env.config';

import ormConfig from '../mikro-orm.config';
import { HouseholdContextModule } from './common/household/household-context.module';
import { createAuth } from './modules/auth/better-auth/auth.config';
import { FeatureModules } from './modules/index';

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
                HouseholdContextModule,
                ...FeatureModules,
            ],
            providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
        };
    }
}

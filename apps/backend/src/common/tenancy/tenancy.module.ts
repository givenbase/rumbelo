import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MembershipService } from './membership.service.js';
import { TenantOrpcInterceptor } from './tenant-orpc.interceptor.js';

/**
 * Global because every domain module resolves the same tenant identity, and
 * re-importing a tenancy provider in fourteen modules is the kind of repetition
 * that silently drifts.
 */
@Global()
@Module({
  providers: [
    MembershipService,
    TenantOrpcInterceptor,
    { provide: APP_INTERCEPTOR, useClass: TenantOrpcInterceptor },
  ],
  exports: [MembershipService],
})
export class TenancyModule {}

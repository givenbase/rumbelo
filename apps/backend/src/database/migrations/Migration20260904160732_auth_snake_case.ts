import { Migration } from '@mikro-orm/migrations';

/**
 * Brings better-auth's tables in line with the rest of the database:
 *
 * - camelCase columns → snake_case (better-auth maps them via `fields` config)
 * - `account` table → `provider` (it stores sign-in provider links, not profile data)
 * - `twoFactor` table → `two_factor`
 * - constraint names → MikroORM conventions (_unique / _foreign, on update cascade)
 *
 * The tables already exist (created by better-auth's CLI), so this migration
 * renames in place instead of creating. From here on the auth tables are part
 * of the MikroORM snapshot; better-auth remains their only writer at runtime.
 */
export class Migration20260904160732_auth_snake_case extends Migration {
    override async up(): Promise<void> {
        // user
        this.addSql(`alter table "auth"."user" rename column "emailVerified" to "email_verified";`);
        this.addSql(`alter table "auth"."user" rename column "createdAt" to "created_at";`);
        this.addSql(`alter table "auth"."user" rename column "updatedAt" to "updated_at";`);
        this.addSql(
            `alter table "auth"."user" rename column "twoFactorEnabled" to "two_factor_enabled";`
        );
        this.addSql(
            `alter table "auth"."user" rename constraint "user_email_key" to "user_email_unique";`
        );

        // organization
        this.addSql(
            `alter table "auth"."organization" rename column "createdAt" to "created_at";`
        );
        this.addSql(
            `alter table "auth"."organization" rename constraint "organization_slug_key" to "organization_slug_unique";`
        );

        // session
        this.addSql(`alter table "auth"."session" rename column "expiresAt" to "expires_at";`);
        this.addSql(`alter table "auth"."session" rename column "createdAt" to "created_at";`);
        this.addSql(`alter table "auth"."session" rename column "updatedAt" to "updated_at";`);
        this.addSql(`alter table "auth"."session" rename column "ipAddress" to "ip_address";`);
        this.addSql(`alter table "auth"."session" rename column "userAgent" to "user_agent";`);
        this.addSql(`alter table "auth"."session" rename column "userId" to "user_id";`);
        this.addSql(
            `alter table "auth"."session" rename column "activeOrganizationId" to "active_organization_id";`
        );
        this.addSql(
            `alter table "auth"."session" rename constraint "session_token_key" to "session_token_unique";`
        );
        this.addSql(`alter table "auth"."session" drop constraint "session_userId_fkey";`);
        this.addSql(
            `alter table "auth"."session" add constraint "session_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`
        );

        // member
        this.addSql(
            `alter table "auth"."member" rename column "organizationId" to "organization_id";`
        );
        this.addSql(`alter table "auth"."member" rename column "userId" to "user_id";`);
        this.addSql(`alter table "auth"."member" rename column "createdAt" to "created_at";`);
        this.addSql(`alter table "auth"."member" drop constraint "member_organizationId_fkey";`);
        this.addSql(`alter table "auth"."member" drop constraint "member_userId_fkey";`);
        this.addSql(
            `alter table "auth"."member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."member" add constraint "member_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`
        );

        // invitation
        this.addSql(
            `alter table "auth"."invitation" rename column "organizationId" to "organization_id";`
        );
        this.addSql(`alter table "auth"."invitation" rename column "expiresAt" to "expires_at";`);
        this.addSql(`alter table "auth"."invitation" rename column "createdAt" to "created_at";`);
        this.addSql(`alter table "auth"."invitation" rename column "inviterId" to "inviter_id";`);
        this.addSql(
            `alter table "auth"."invitation" drop constraint "invitation_organizationId_fkey";`
        );
        this.addSql(`alter table "auth"."invitation" drop constraint "invitation_inviterId_fkey";`);
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "auth"."user" ("id") on update cascade on delete cascade;`
        );

        // account → provider (sign-in provider links, not profile data)
        this.addSql(`alter table "auth"."account" rename to "provider";`);
        this.addSql(
            `alter table "auth"."provider" rename constraint "account_pkey" to "provider_pkey";`
        );
        this.addSql(`alter table "auth"."provider" rename column "accountId" to "account_id";`);
        this.addSql(`alter table "auth"."provider" rename column "providerId" to "provider_id";`);
        this.addSql(`alter table "auth"."provider" rename column "userId" to "user_id";`);
        this.addSql(
            `alter table "auth"."provider" rename column "accessToken" to "access_token";`
        );
        this.addSql(
            `alter table "auth"."provider" rename column "refreshToken" to "refresh_token";`
        );
        this.addSql(`alter table "auth"."provider" rename column "idToken" to "id_token";`);
        this.addSql(
            `alter table "auth"."provider" rename column "accessTokenExpiresAt" to "access_token_expires_at";`
        );
        this.addSql(
            `alter table "auth"."provider" rename column "refreshTokenExpiresAt" to "refresh_token_expires_at";`
        );
        this.addSql(`alter table "auth"."provider" rename column "createdAt" to "created_at";`);
        this.addSql(`alter table "auth"."provider" rename column "updatedAt" to "updated_at";`);
        this.addSql(`alter table "auth"."provider" drop constraint "account_userId_fkey";`);
        this.addSql(
            `alter table "auth"."provider" add constraint "provider_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`
        );

        // twoFactor → two_factor
        this.addSql(`alter table "auth"."twoFactor" rename to "two_factor";`);
        this.addSql(
            `alter table "auth"."two_factor" rename constraint "twoFactor_pkey" to "two_factor_pkey";`
        );
        this.addSql(
            `alter table "auth"."two_factor" rename column "backupCodes" to "backup_codes";`
        );
        this.addSql(`alter table "auth"."two_factor" rename column "userId" to "user_id";`);
        this.addSql(
            `alter table "auth"."two_factor" rename column "failedVerificationCount" to "failed_verification_count";`
        );
        this.addSql(
            `alter table "auth"."two_factor" rename column "lockedUntil" to "locked_until";`
        );
        this.addSql(`alter table "auth"."two_factor" drop constraint "twoFactor_userId_fkey";`);
        this.addSql(
            `alter table "auth"."two_factor" add constraint "two_factor_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`
        );

        // verification
        this.addSql(
            `alter table "auth"."verification" rename column "expiresAt" to "expires_at";`
        );
        this.addSql(
            `alter table "auth"."verification" rename column "createdAt" to "created_at";`
        );
        this.addSql(
            `alter table "auth"."verification" rename column "updatedAt" to "updated_at";`
        );
    }

    override async down(): Promise<void> {
        // verification
        this.addSql(
            `alter table "auth"."verification" rename column "expires_at" to "expiresAt";`
        );
        this.addSql(
            `alter table "auth"."verification" rename column "created_at" to "createdAt";`
        );
        this.addSql(
            `alter table "auth"."verification" rename column "updated_at" to "updatedAt";`
        );

        // two_factor → twoFactor
        this.addSql(`alter table "auth"."two_factor" drop constraint "two_factor_user_id_foreign";`);
        this.addSql(
            `alter table "auth"."two_factor" rename column "backup_codes" to "backupCodes";`
        );
        this.addSql(`alter table "auth"."two_factor" rename column "user_id" to "userId";`);
        this.addSql(
            `alter table "auth"."two_factor" rename column "failed_verification_count" to "failedVerificationCount";`
        );
        this.addSql(
            `alter table "auth"."two_factor" rename column "locked_until" to "lockedUntil";`
        );
        this.addSql(
            `alter table "auth"."two_factor" rename constraint "two_factor_pkey" to "twoFactor_pkey";`
        );
        this.addSql(`alter table "auth"."two_factor" rename to "twoFactor";`);
        this.addSql(
            `alter table "auth"."twoFactor" add constraint "twoFactor_userId_fkey" foreign key ("userId") references "auth"."user" ("id") on delete cascade;`
        );

        // provider → account
        this.addSql(`alter table "auth"."provider" drop constraint "provider_user_id_foreign";`);
        this.addSql(`alter table "auth"."provider" rename column "account_id" to "accountId";`);
        this.addSql(`alter table "auth"."provider" rename column "provider_id" to "providerId";`);
        this.addSql(`alter table "auth"."provider" rename column "user_id" to "userId";`);
        this.addSql(
            `alter table "auth"."provider" rename column "access_token" to "accessToken";`
        );
        this.addSql(
            `alter table "auth"."provider" rename column "refresh_token" to "refreshToken";`
        );
        this.addSql(`alter table "auth"."provider" rename column "id_token" to "idToken";`);
        this.addSql(
            `alter table "auth"."provider" rename column "access_token_expires_at" to "accessTokenExpiresAt";`
        );
        this.addSql(
            `alter table "auth"."provider" rename column "refresh_token_expires_at" to "refreshTokenExpiresAt";`
        );
        this.addSql(`alter table "auth"."provider" rename column "created_at" to "createdAt";`);
        this.addSql(`alter table "auth"."provider" rename column "updated_at" to "updatedAt";`);
        this.addSql(
            `alter table "auth"."provider" rename constraint "provider_pkey" to "account_pkey";`
        );
        this.addSql(`alter table "auth"."provider" rename to "account";`);
        this.addSql(
            `alter table "auth"."account" add constraint "account_userId_fkey" foreign key ("userId") references "auth"."user" ("id") on delete cascade;`
        );

        // invitation
        this.addSql(
            `alter table "auth"."invitation" drop constraint "invitation_organization_id_foreign";`
        );
        this.addSql(
            `alter table "auth"."invitation" drop constraint "invitation_inviter_id_foreign";`
        );
        this.addSql(
            `alter table "auth"."invitation" rename column "organization_id" to "organizationId";`
        );
        this.addSql(`alter table "auth"."invitation" rename column "expires_at" to "expiresAt";`);
        this.addSql(`alter table "auth"."invitation" rename column "created_at" to "createdAt";`);
        this.addSql(`alter table "auth"."invitation" rename column "inviter_id" to "inviterId";`);
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_organizationId_fkey" foreign key ("organizationId") references "auth"."organization" ("id") on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_inviterId_fkey" foreign key ("inviterId") references "auth"."user" ("id") on delete cascade;`
        );

        // member
        this.addSql(
            `alter table "auth"."member" drop constraint "member_organization_id_foreign";`
        );
        this.addSql(`alter table "auth"."member" drop constraint "member_user_id_foreign";`);
        this.addSql(
            `alter table "auth"."member" rename column "organization_id" to "organizationId";`
        );
        this.addSql(`alter table "auth"."member" rename column "user_id" to "userId";`);
        this.addSql(`alter table "auth"."member" rename column "created_at" to "createdAt";`);
        this.addSql(
            `alter table "auth"."member" add constraint "member_organizationId_fkey" foreign key ("organizationId") references "auth"."organization" ("id") on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."member" add constraint "member_userId_fkey" foreign key ("userId") references "auth"."user" ("id") on delete cascade;`
        );

        // session
        this.addSql(`alter table "auth"."session" drop constraint "session_user_id_foreign";`);
        this.addSql(`alter table "auth"."session" rename column "expires_at" to "expiresAt";`);
        this.addSql(`alter table "auth"."session" rename column "created_at" to "createdAt";`);
        this.addSql(`alter table "auth"."session" rename column "updated_at" to "updatedAt";`);
        this.addSql(`alter table "auth"."session" rename column "ip_address" to "ipAddress";`);
        this.addSql(`alter table "auth"."session" rename column "user_agent" to "userAgent";`);
        this.addSql(`alter table "auth"."session" rename column "user_id" to "userId";`);
        this.addSql(
            `alter table "auth"."session" rename column "active_organization_id" to "activeOrganizationId";`
        );
        this.addSql(
            `alter table "auth"."session" rename constraint "session_token_unique" to "session_token_key";`
        );
        this.addSql(
            `alter table "auth"."session" add constraint "session_userId_fkey" foreign key ("userId") references "auth"."user" ("id") on delete cascade;`
        );

        // organization
        this.addSql(
            `alter table "auth"."organization" rename column "created_at" to "createdAt";`
        );
        this.addSql(
            `alter table "auth"."organization" rename constraint "organization_slug_unique" to "organization_slug_key";`
        );

        // user
        this.addSql(`alter table "auth"."user" rename column "email_verified" to "emailVerified";`);
        this.addSql(`alter table "auth"."user" rename column "created_at" to "createdAt";`);
        this.addSql(`alter table "auth"."user" rename column "updated_at" to "updatedAt";`);
        this.addSql(
            `alter table "auth"."user" rename column "two_factor_enabled" to "twoFactorEnabled";`
        );
        this.addSql(
            `alter table "auth"."user" rename constraint "user_email_unique" to "user_email_key";`
        );
    }
}

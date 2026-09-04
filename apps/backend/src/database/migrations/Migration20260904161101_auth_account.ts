import { Migration } from '@mikro-orm/migrations';

export class Migration20260904161101_auth_account extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "auth"."account" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" text not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."account" add constraint "account_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "auth"."account" add constraint "account_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auth"."account" cascade;`);
  }

}

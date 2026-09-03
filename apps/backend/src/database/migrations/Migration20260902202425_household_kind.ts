import { Migration } from '@mikro-orm/migrations';

/**
 * Adds household_settings.kind — the nature of the group sharing the board
 * (family | partners | friends | solo). Copy and module defaults only; never
 * permissions and never query scoping.
 *
 * Trimmed by hand: the generator also proposed dropping better-auth's tables
 * (user, session, organization, …) because they are not MikroORM entities.
 * better-auth owns and migrates those — they must never appear in our migrations.
 */
export class Migration20260902202425_household_kind extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "platform"."household_settings" add column "kind" text check ("kind" in ('family', 'partners', 'friends', 'solo')) not null default 'solo';`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "platform"."household_settings" drop column "kind";`);
    }
}

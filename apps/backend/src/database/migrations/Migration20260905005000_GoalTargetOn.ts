import { Migration } from '@mikro-orm/migrations';

/**
 * Calendar dates use *On (not *Date) so *Day ordinals stay unambiguous.
 * money_goal.target_date → target_on
 */
export class Migration20260905005000_GoalTargetOn extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "money_goal" rename column "target_date" to "target_on";`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "money_goal" rename column "target_on" to "target_date";`);
    }
}

import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { Jar } from './jar.entity.js';

/** A spending line inside a jar. Budget is planned; actuals come from transactions. */
@Entity({ tableName: 'category', schema: 'money' })
export class Category extends HouseholdEntity {
  @ManyToOne(() => Jar, { deleteRule: 'cascade' })
  jar!: Jar;

  @Property({ length: 80 })
  name!: string;

  @Property({ type: 'bigint', default: 0 })
  budgeted = 0;

  @Property({ default: false })
  archived = false;
}

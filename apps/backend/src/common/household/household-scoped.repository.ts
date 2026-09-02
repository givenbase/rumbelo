import type { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql';

import type { HouseholdEntity } from '../database/base.entity.js';

import { currentHouseholdId } from './household.context.js';

/**
 * The single place household scoping is applied.
 *
 * Services must go through this rather than calling em.find directly on
 * household-owned entities: the filter is injected from AsyncLocalStorage, so a
 * caller cannot pass the wrong householdId and cannot forget to pass one at all.
 */
export class HouseholdScopedRepository<T extends HouseholdEntity> {
    constructor(
        private readonly em: EntityManager,
        private readonly entity: new () => T
    ) {}

    private scope(where: FilterQuery<T> = {} as FilterQuery<T>): FilterQuery<T> {
        return { ...(where as object), householdId: currentHouseholdId() } as FilterQuery<T>;
    }

    find(where?: FilterQuery<T>, options?: FindOptions<T>) {
        return this.em.find(this.entity, this.scope(where), options);
    }

    findOne(where: FilterQuery<T>) {
        return this.em.findOne(this.entity, this.scope(where));
    }

    async findOneOrFail(where: FilterQuery<T>): Promise<T> {
        const found = await this.findOne(where);
        if (!found) throw new Error(`${this.entity.name} not found in this household`);
        return found;
    }

    count(where?: FilterQuery<T>) {
        return this.em.count(this.entity, this.scope(where));
    }

    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'householdId'>): T {
        const entity = this.em.create(this.entity, {
            ...(data as object),
            householdId: currentHouseholdId(),
        } as never);
        return entity;
    }

    remove(entity: T) {
        if (entity.householdId !== currentHouseholdId()) {
            throw new Error('Refusing to delete a row from another household');
        }
        return this.em.remove(entity);
    }
}

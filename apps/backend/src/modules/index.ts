import { CoachModule } from './coach/coach.module.js';
import { EnergyModule } from './energy/energy.module.js';
import { GrowthModule } from './growth/growth.module.js';
import { HouseholdModule } from './household/household.module.js';
import { MoneyModule } from './money/money.module.js';
import { SoulModule } from './soul/soul.module.js';

/**
 * Registered by AppModule.
 *
 * Four product modules mirroring the application's portals, plus two
 * platform-level modules that every product depends on:
 *   Household — the tenant itself, its settings and members
 *   Coach     — advisory that reads across all four products
 */
export const FeatureModules = [
  HouseholdModule,
  MoneyModule,
  GrowthModule,
  EnergyModule,
  SoulModule,
  CoachModule,
];

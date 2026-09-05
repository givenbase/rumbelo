import { z } from 'zod';

import { Cadence, DebtKind, FlowDirection, IncomeKind, JarKey } from '../../../../enums';
import { CatalogItemBase } from '../../../../common/schemas';

/** Money company-catalog DTOs (backoffice.product.money templates + presets). */

export const CategoryTemplate = CatalogItemBase.extend({
    jarKey: z.enum(JarKey),
});
export type CategoryTemplate = z.infer<typeof CategoryTemplate>;

export const FixedCostPreset = CatalogItemBase.extend({
    jarKey: z.enum(JarKey),
    categoryTemplateKey: z.string().min(1).max(64),
    defaultCadence: z.enum(Cadence),
    suggestedDueDay: z.int().min(1).max(31).nullable(),
    direction: z.enum(FlowDirection),
    audienceTags: z.array(z.string()),
});
export type FixedCostPreset = z.infer<typeof FixedCostPreset>;

export const DebtPreset = CatalogItemBase.extend({
    kind: z.enum(DebtKind),
});
export type DebtPreset = z.infer<typeof DebtPreset>;

export const IncomeSourcePreset = CatalogItemBase.extend({
    kind: z.enum(IncomeKind),
    defaultCadence: z.enum(Cadence),
});
export type IncomeSourcePreset = z.infer<typeof IncomeSourcePreset>;

export const GoalPreset = CatalogItemBase.extend({
    jarKey: z.enum(JarKey),
    categoryTemplateKey: z.string().min(1).max(64).nullable(),
    icon: z.string().max(8).nullable(),
});
export type GoalPreset = z.infer<typeof GoalPreset>;

export const MerchantPreset = CatalogItemBase.extend({
    matchValue: z.string().min(1).max(120),
    /** Extra bank-feed needles (Revolut / SEPA / card descriptors). */
    aliases: z.array(z.string().min(1).max(120)),
    /** ISO 18245 merchant category code when known. */
    mcc: z.string().length(4).nullable(),
    jarKey: z.enum(JarKey),
    categoryTemplateKey: z.string().min(1).max(64),
});
export type MerchantPreset = z.infer<typeof MerchantPreset>;

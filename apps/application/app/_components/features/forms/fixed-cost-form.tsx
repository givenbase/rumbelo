'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useLiveQuery } from '@rumbelo/hooks';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Button,
    Input,
    createFormInvalidHandler,
} from '@rumbelo/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { parseEurosToCents } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';

import { resolveCategoryId, useCategoryTemplates } from './catalog-helpers';
import { PresetNameField } from './preset-name-field';

const euros = z
    .string()
    .min(1, 'Amount is required')
    .refine(
        v => {
            const cents = parseEurosToCents(v);
            return cents != null && cents > 0;
        },
        { message: 'Enter a valid amount' }
    );

const fixedCostFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    amount: euros,
    jarId: z.string().min(1, 'Choose a jar'),
    categoryId: z.string().nullable().optional(),
    dueDay: z.string().optional(),
});

export type FixedCostFormValues = z.infer<typeof fixedCostFormSchema>;

type FixedCostFormProps = {
    defaultValues?: Partial<FixedCostFormValues>;
    embedded?: boolean;
    mode?: 'create' | 'edit';
    entityId?: string;
    onSuccess?: () => void;
};

export function FixedCostForm({
    defaultValues,
    embedded = true,
    mode = 'create',
    entityId,
    onSuccess,
}: FixedCostFormProps) {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const dismiss = useFormDismiss(onSuccess);
    const live = isLiveData(householdId);
    const pendingCategoryName = useRef<string | null>(null);

    const jarsQuery = useLiveQuery(
        api.money.jars.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );
    const jars = useMemo(() => jarsQuery.data ?? [], [jarsQuery.data]);

    const balancesQuery = useLiveQuery(
        api.money.jars.balances.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const presetsQuery = useLiveQuery(
        api.money.catalogs.fixedCostPresets.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live && mode === 'create'
    );
    const categoriesQuery = useCategoryTemplates(live && mode === 'create');

    const categoryNameByKey = useMemo(() => {
        const map = new Map<string, string>();
        for (const c of categoriesQuery.data ?? []) map.set(c.key, c.name);
        return map;
    }, [categoriesQuery.data]);

    const presetOptions = useMemo(
        () =>
            (presetsQuery.data ?? []).map(p => ({
                key: p.key,
                name: p.name,
                group: categoryNameByKey.get(p.categoryTemplateKey) ?? p.categoryTemplateKey,
                jarKey: p.jarKey,
                categoryTemplateKey: p.categoryTemplateKey,
                suggestedDueDay: p.suggestedDueDay,
            })),
        [presetsQuery.data, categoryNameByKey]
    );

    const form = useForm<FixedCostFormValues>({
        defaultValues: {
            name: defaultValues?.name ?? '',
            amount: defaultValues?.amount ?? '',
            jarId: defaultValues?.jarId ?? '',
            categoryId: defaultValues?.categoryId ?? null,
            dueDay: defaultValues?.dueDay ?? '',
        },
        resolver: zodResolver(fixedCostFormSchema),
    });

    useEffect(() => {
        if (jars[0]?.id && !form.getValues('jarId')) {
            form.setValue('jarId', jars[0].id);
        }
    }, [jars, form]);

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: FixedCostFormValues) => {
            if (!householdId) throw new Error('No household');
            const cents = parseEurosToCents(values.amount);
            if (cents == null || cents <= 0) throw new Error('Invalid amount');
            const due = values.dueDay?.trim() ? Number(values.dueDay) : null;
            const dueDay = due != null && due >= 1 && due <= 31 ? due : null;
            const name = values.name.trim();

            let categoryId = values.categoryId ?? null;
            if (pendingCategoryName.current) {
                const jarBalance = (balancesQuery.data ?? []).find(j => j.id === values.jarId);
                categoryId = await resolveCategoryId({
                    client,
                    householdId,
                    jarId: values.jarId,
                    categoryName: pendingCategoryName.current,
                    existing: jarBalance?.categories ?? [],
                });
                pendingCategoryName.current = null;
            }

            if (mode === 'edit' && entityId) {
                return client.money.fixedCosts.update({
                    id: entityId,
                    householdId,
                    name,
                    amount: cents,
                    jarId: values.jarId,
                    categoryId,
                    dueDay,
                });
            }
            return client.money.fixedCosts.create({
                householdId,
                jarId: values.jarId,
                categoryId,
                name,
                amount: cents,
                cadence: 'MONTHLY',
                dueDay,
                direction: 'OUT',
                active: true,
                endsOn: null,
                note: null,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.byJar.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            showToast(mode === 'edit' ? 'Fixed cost updated' : 'Fixed cost saved', 'success');
            dismiss();
        },
        onError: () => showToast('Save failed', 'error'),
    });

    const removeMutation = useMutation({
        mutationFn: async () => {
            if (!householdId || !entityId) throw new Error('No household');
            return client.money.fixedCosts.remove({ householdId, id: entityId });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.byJar.key() });
            showToast('Fixed cost deleted', 'success');
            dismiss();
        },
        onError: () => showToast('Delete failed', 'error'),
    });

    async function onSubmit(values: FixedCostFormValues) {
        if (!live) {
            showToast('Sign in to save fixed costs', 'error');
            return;
        }
        await saveMutation.mutateAsync(values);
    }

    const busy =
        form.formState.isSubmitting ||
        saveMutation.isPending ||
        removeMutation.isPending ||
        (live && jars.length === 0);

    return (
        <FormCreateEditShell
            embedded={embedded}
            form={form}
            onError={onError}
            onSubmit={onSubmit}
            sidebar={
                <div className="grid gap-2">
                    <Button type="submit" className="w-full" disabled={busy}>
                        {saveMutation.isPending || form.formState.isSubmitting
                            ? 'Working…'
                            : mode === 'edit'
                              ? 'Save changes'
                              : 'Save fixed cost'}
                    </Button>
                    {mode === 'edit' && entityId ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-danger hover:bg-danger/10 hover:text-danger"
                            disabled={
                                form.formState.isSubmitting ||
                                saveMutation.isPending ||
                                removeMutation.isPending
                            }
                            onClick={() => {
                                if (!window.confirm('Permanently delete this fixed cost?')) return;
                                void removeMutation.mutateAsync();
                            }}>
                            {removeMutation.isPending ? 'Deleting…' : 'Delete'}
                        </Button>
                    ) : null}
                </div>
            }>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            {mode === 'create' ? (
                                <PresetNameField
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="e.g. rent"
                                    options={presetOptions}
                                    onSelect={opt => {
                                        const full = presetOptions.find(p => p.key === opt.key);
                                        if (!full) return;
                                        const jar = jars.find(j => j.key === full.jarKey);
                                        if (jar) form.setValue('jarId', jar.id);
                                        if (full.suggestedDueDay != null) {
                                            form.setValue('dueDay', String(full.suggestedDueDay));
                                        }
                                        pendingCategoryName.current =
                                            categoryNameByKey.get(full.categoryTemplateKey) ?? null;
                                        form.setValue('categoryId', null);
                                    }}
                                />
                            ) : (
                                <Input placeholder="e.g. rent" {...field} />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount per month (€)</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="jarId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jar</FormLabel>
                        <FormControl>
                            <select
                                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                                {...field}>
                                {jars.length === 0 ? (
                                    <option value="">No jars — complete setup first</option>
                                ) : (
                                    jars.map(jar => (
                                        <option key={jar.id} value={jar.id}>
                                            {jar.icon ? `${jar.icon} ` : ''}
                                            {jar.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="dueDay"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Due day (day of month)</FormLabel>
                        <FormControl>
                            <Input type="number" min={1} max={31} placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormCreateEditShell>
    );
}

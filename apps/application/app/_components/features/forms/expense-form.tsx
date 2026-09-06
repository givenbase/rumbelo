'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
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

import { parseEurosToCents, todayIsoDate } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { ConfirmActionButton } from './confirm-action-button';
import { resolveCategoryId, useCategoryTemplates } from './catalog-helpers';
import {
    ExpenseIntentField,
    type ExpenseIntentSelection,
} from './expense-intent-field';

const expenseFormSchema = z.object({
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine(
            value => {
                const cents = parseEurosToCents(value);
                return cents !== null && cents > 0;
            },
            { message: 'Enter a valid amount' }
        ),
    note: z.string().max(280),
    jarId: z.string().min(1, 'Choose a jar'),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema> & {
    /** Edit hydrate only — not submitted as description anymore */
    description?: string;
    counterparty?: string | null;
    categoryId?: string | null;
};

type ExpenseFormProps = {
    defaultValues?: Partial<ExpenseFormValues>;
    embedded?: boolean;
    mode?: 'create' | 'edit';
    /** When set (inbox "Anders"), submit sorts/updates that transaction instead of creating. */
    entityId?: string;
    onSuccess?: () => void;
};

const EMPTY_INTENT: ExpenseIntentSelection = {
    vendor: '',
    categoryKey: null,
    categoryName: null,
    jarKey: null,
    source: null,
};

function buildIntentFromDefaults(
    defaults: Partial<ExpenseFormValues> | undefined,
    merchants: Array<{ name: string; categoryTemplateKey: string; jarKey: string }>,
    categories: Array<{ key: string; name: string; jarKey: string }>
): ExpenseIntentSelection {
    const vendor = defaults?.counterparty?.trim() || '';
    const description = defaults?.description?.trim() || '';
    const note = defaults?.note?.trim() || '';

    if (vendor) {
        const merchant = merchants.find(m => m.name.toLowerCase() === vendor.toLowerCase());
        if (merchant) {
            const category = categories.find(c => c.key === merchant.categoryTemplateKey);
            return {
                vendor,
                categoryKey: merchant.categoryTemplateKey,
                categoryName: category?.name ?? merchant.categoryTemplateKey,
                jarKey: merchant.jarKey,
                source: 'merchant',
            };
        }
        const categoryFromDesc = categories.find(
            c => c.name.toLowerCase() === description.toLowerCase()
        );
        return {
            vendor,
            categoryKey: categoryFromDesc?.key ?? null,
            categoryName: categoryFromDesc?.name ?? null,
            jarKey: categoryFromDesc?.jarKey ?? null,
            source: categoryFromDesc ? 'category' : 'custom',
        };
    }

    if (description && description !== note) {
        const category = categories.find(c => c.name.toLowerCase() === description.toLowerCase());
        if (category) {
            return {
                vendor: '',
                categoryKey: category.key,
                categoryName: category.name,
                jarKey: category.jarKey,
                source: 'category',
            };
        }
        return {
            vendor: description,
            categoryKey: null,
            categoryName: null,
            jarKey: null,
            source: 'custom',
        };
    }

    return EMPTY_INTENT;
}

/**
 * Canonical create/edit form — Galighticus pattern:
 * useForm + zodResolver → FormCreateEditShell(embedded) → FormField wrappers.
 * Create: money.transactions.create. Edit: update + sort into the chosen jar.
 */
export function ExpenseForm({
    defaultValues,
    embedded = true,
    mode = 'create',
    entityId,
    onSuccess,
}: ExpenseFormProps) {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const dismiss = useFormDismiss(onSuccess);
    const live = isLiveData(householdId);
    const [showNote, setShowNote] = useState(Boolean(defaultValues?.note?.trim()));
    const [intent, setIntent] = useState<ExpenseIntentSelection>(EMPTY_INTENT);
    const [intentReady, setIntentReady] = useState(mode === 'create');

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

    const merchantsQuery = useLiveQuery(
        api.money.catalogs.merchantPresets.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live
    );
    const categoriesQuery = useCategoryTemplates(live);

    const merchants = useMemo(
        () =>
            (merchantsQuery.data ?? []).map(preset => ({
                key: preset.key,
                name: preset.name,
                jarKey: preset.jarKey,
                categoryTemplateKey: preset.categoryTemplateKey,
                aliases: preset.aliases,
            })),
        [merchantsQuery.data]
    );

    const categories = useMemo(
        () =>
            (categoriesQuery.data ?? []).map(category => ({
                key: category.key,
                name: category.name,
                jarKey: category.jarKey,
                icon: category.icon,
            })),
        [categoriesQuery.data]
    );

    const categoryIconByKey = useMemo(() => {
        const map = new Map<string, string | null>();
        for (const category of categories) {
            map.set(category.key, category.icon ?? null);
        }
        return map;
    }, [categories]);

    useEffect(() => {
        if (mode !== 'edit') return;
        if (intentReady) return;
        if (merchantsQuery.isLoading || categoriesQuery.isLoading) return;
        setIntent(buildIntentFromDefaults(defaultValues, merchants, categories));
        setIntentReady(true);
    }, [
        mode,
        intentReady,
        merchantsQuery.isLoading,
        categoriesQuery.isLoading,
        defaultValues,
        merchants,
        categories,
    ]);

    const form = useForm<z.infer<typeof expenseFormSchema>>({
        defaultValues: {
            amount: defaultValues?.amount ?? '',
            note: defaultValues?.note ?? '',
            jarId: defaultValues?.jarId ?? '',
        },
        resolver: zodResolver(expenseFormSchema),
    });

    useEffect(() => {
        if (jars[0]?.id && !form.getValues('jarId')) {
            form.setValue('jarId', jars[0].id);
        }
    }, [jars, form]);

    useEffect(() => {
        if (!intent.jarKey) return;
        const jar = jars.find(j => j.key === intent.jarKey);
        if (jar) form.setValue('jarId', jar.id);
    }, [intent.jarKey, jars, form]);

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: z.infer<typeof expenseFormSchema>) => {
            if (!householdId) throw new Error('No household');
            if (!intent.vendor && !intent.categoryKey) {
                throw new Error('Pick a vendor or type');
            }
            const cents = parseEurosToCents(values.amount);
            if (cents === null || cents <= 0) throw new Error('Invalid amount');

            const vendor = intent.vendor.trim();
            const note = values.note.trim();
            const description =
                note || intent.categoryName?.trim() || vendor || 'Expense';

            let categoryId: string | null = null;
            if (intent.categoryName) {
                const jarBalance = (balancesQuery.data ?? []).find(j => j.id === values.jarId);
                categoryId = await resolveCategoryId({
                    client,
                    householdId,
                    jarId: values.jarId,
                    categoryName: intent.categoryName,
                    existing: jarBalance?.categories ?? [],
                });
            }

            if (mode === 'edit' && entityId) {
                await client.money.transactions.update({
                    id: entityId,
                    householdId,
                    description,
                    amount: -cents,
                    note: note || null,
                    counterparty: vendor || null,
                    categoryId,
                });
                return client.money.transactions.sort({
                    householdId,
                    transactionId: entityId,
                    jarId: values.jarId,
                    categoryId,
                    createRule: false,
                });
            }

            return client.money.transactions.create({
                householdId,
                description,
                amount: -cents,
                bookedOn: todayIsoDate(),
                jarId: values.jarId,
                accountId: null,
                categoryId,
                counterparty: vendor || null,
                note: note || null,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.transactions.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.transactions.inbox.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
            showToast(mode === 'edit' ? 'Expense updated' : 'Expense saved', 'success');
            dismiss();
        },
        onError: error =>
            showToast(error instanceof Error ? error.message : 'Save failed', 'error'),
    });

    const removeMutation = useMutation({
        mutationFn: async () => {
            if (!householdId || !entityId) throw new Error('No household');
            return client.money.transactions.remove({ householdId, id: entityId });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.transactions.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.transactions.inbox.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
            showToast('Expense deleted', 'success');
            dismiss();
        },
        onError: () => showToast('Delete failed', 'error'),
    });

    async function onSubmit(values: z.infer<typeof expenseFormSchema>) {
        if (!live) {
            showToast('Sign in to save expenses', 'error');
            return;
        }
        if (!intent.vendor && !intent.categoryKey) {
            showToast('Pick a vendor or a type first', 'error');
            return;
        }
        await saveMutation.mutateAsync(values);
    }

    const busy =
        form.formState.isSubmitting ||
        saveMutation.isPending ||
        removeMutation.isPending ||
        (live && jars.length === 0) ||
        (mode === 'edit' && !intentReady);

    const noteValue = form.watch('note');

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
                              : 'Save expense'}
                    </Button>
                    {mode === 'edit' && entityId ? (
                        <ConfirmActionButton
                            variant="ghost"
                            className="w-full text-danger hover:bg-danger/10 hover:text-danger"
                            disabled={
                                form.formState.isSubmitting ||
                                saveMutation.isPending ||
                                removeMutation.isPending
                            }
                            pending={removeMutation.isPending}
                            label="Delete"
                            confirmLabel="Click again to delete"
                            onConfirm={() => void removeMutation.mutateAsync()}
                        />
                    ) : null}
                </div>
            }>
            <div className="grid gap-2">
                <p className="font-mono text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
                    What was it?
                </p>
                <ExpenseIntentField
                    value={intent}
                    onChange={setIntent}
                    merchants={merchants}
                    categories={categories}
                    categoryIconByKey={categoryIconByKey}
                    disabled={busy}
                />
            </div>

            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount (€)</FormLabel>
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

            {showNote || noteValue ? (
                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional — e.g. kids lunch" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : (
                <button
                    type="button"
                    className="justify-self-start font-mono text-xs tracking-wide text-accent uppercase hover:underline"
                    onClick={() => setShowNote(true)}>
                    Add note
                </button>
            )}
        </FormCreateEditShell>
    );
}

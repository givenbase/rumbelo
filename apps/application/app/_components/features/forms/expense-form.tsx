'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
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

const expenseFormSchema = z.object({
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine(
            v => {
                const cents = parseEurosToCents(v);
                return cents != null && cents > 0;
            },
            { message: 'Enter a valid amount' }
        ),
    description: z.string().min(1, 'Description is required').max(120),
    jarId: z.string().min(1, 'Choose a jar'),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

type ExpenseFormProps = {
    defaultValues?: Partial<ExpenseFormValues>;
    embedded?: boolean;
    mode?: 'create' | 'edit';
    /** When set (inbox "Anders"), submit sorts/updates that transaction instead of creating. */
    entityId?: string;
    onSuccess?: () => void;
};

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

    const jarsQuery = useLiveQuery(
        api.money.jars.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );
    const jars = useMemo(() => jarsQuery.data ?? [], [jarsQuery.data]);

    const form = useForm<ExpenseFormValues>({
        defaultValues: {
            amount: defaultValues?.amount ?? '',
            description: defaultValues?.description ?? '',
            jarId: defaultValues?.jarId ?? '',
        },
        resolver: zodResolver(expenseFormSchema),
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
        mutationFn: async (values: ExpenseFormValues) => {
            if (!householdId) throw new Error('No household');
            const cents = parseEurosToCents(values.amount);
            if (cents == null || cents <= 0) throw new Error('Invalid amount');
            const description = values.description.trim();

            if (mode === 'edit' && entityId) {
                await client.money.transactions.update({
                    id: entityId,
                    householdId,
                    description,
                    amount: -cents,
                });
                return client.money.transactions.sort({
                    householdId,
                    transactionId: entityId,
                    jarId: values.jarId,
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
                categoryId: null,
                counterparty: null,
                note: null,
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
        onError: () => showToast('Save failed', 'error'),
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

    async function onSubmit(values: ExpenseFormValues) {
        if (!live) {
            showToast('Sign in to save expenses', 'error');
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
                              : 'Save expense'}
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
                                if (!window.confirm('Permanently delete this expense?')) return;
                                void removeMutation.mutateAsync();
                            }}>
                            {removeMutation.isPending ? 'Deleting…' : 'Delete'}
                        </Button>
                    ) : null}
                </div>
            }>
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. groceries" {...field} />
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
        </FormCreateEditShell>
    );
}

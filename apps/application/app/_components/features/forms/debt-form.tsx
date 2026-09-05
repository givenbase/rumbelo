'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
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
import { DebtKind } from '@rumbelo/contracts';
import { z } from 'zod';

import { parseEurosToCents } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { PresetNameField } from './preset-name-field';

const euros = z
    .string()
    .min(1, 'Amount is required')
    .refine(
        v => {
            const cents = parseEurosToCents(v);
            return cents !== null && cents >= 0;
        },
        { message: 'Enter a valid amount' }
    );

const debtFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    balance: euros,
    interestRate: z
        .string()
        .min(1, 'Interest rate is required')
        .refine(
            v => {
                const n = Number(v.replace(',', '.'));
                return Number.isFinite(n) && n >= 0 && n <= 100;
            },
            { message: 'Interest must be between 0 and 100' }
        ),
    minimumPayment: z.string().optional(),
    kind: z.enum(DebtKind),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;

type DebtFormProps = {
    defaultValues?: Partial<DebtFormValues>;
    embedded?: boolean;
    mode?: 'create' | 'edit';
    entityId?: string;
    onSuccess?: () => void;
};

export function DebtForm({
    defaultValues,
    embedded = true,
    mode = 'create',
    entityId,
    onSuccess,
}: DebtFormProps) {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const dismiss = useFormDismiss(onSuccess);
    const live = isLiveData(householdId);

    const presetsQuery = useLiveQuery(
        api.money.catalogs.debtPresets.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live && mode === 'create'
    );
    const presetOptions = useMemo(
        () => (presetsQuery.data ?? []).map(p => ({ key: p.key, name: p.name, kind: p.kind })),
        [presetsQuery.data]
    );

    const form = useForm<DebtFormValues>({
        defaultValues: {
            name: defaultValues?.name ?? '',
            balance: defaultValues?.balance ?? '',
            interestRate: defaultValues?.interestRate ?? '0',
            minimumPayment: defaultValues?.minimumPayment ?? '',
            kind: defaultValues?.kind ?? DebtKind.LOAN,
        },
        resolver: zodResolver(debtFormSchema),
    });

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: DebtFormValues) => {
            if (!householdId) throw new Error('No household');
            const balance = parseEurosToCents(values.balance);
            if (balance === null || balance < 0) throw new Error('Invalid balance');
            const minimum = values.minimumPayment?.trim()
                ? (parseEurosToCents(values.minimumPayment) ?? 0)
                : 0;
            const name = values.name.trim();
            const interestRate = Number(values.interestRate.replace(',', '.'));
            if (mode === 'edit' && entityId) {
                return client.money.debts.update({
                    id: entityId,
                    householdId,
                    name,
                    balance,
                    interestRate,
                    minimumPayment: minimum,
                    kind: values.kind,
                });
            }
            return client.money.debts.create({
                householdId,
                name,
                kind: values.kind,
                balance,
                originalBalance: balance,
                interestRate,
                minimumPayment: minimum,
                extraPayment: 0,
                dueDay: null,
                closedOn: null,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.debts.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.debts.plan.key() });
            showToast(mode === 'edit' ? 'Debt updated' : 'Debt saved', 'success');
            dismiss();
        },
        onError: () => showToast('Save failed', 'error'),
    });

    const removeMutation = useMutation({
        mutationFn: async () => {
            if (!householdId || !entityId) throw new Error('No household');
            return client.money.debts.remove({ householdId, id: entityId });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.debts.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.debts.plan.key() });
            showToast('Debt deleted', 'success');
            dismiss();
        },
        onError: () => showToast('Delete failed', 'error'),
    });

    async function onSubmit(values: DebtFormValues) {
        if (!live) {
            showToast('Sign in to save debts', 'error');
            return;
        }
        await saveMutation.mutateAsync(values);
    }

    const busy = form.formState.isSubmitting || saveMutation.isPending || removeMutation.isPending;

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
                              : 'Save debt'}
                    </Button>
                    {mode === 'edit' && entityId ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-danger hover:bg-danger/10 hover:text-danger"
                            disabled={busy}
                            onClick={() => {
                                if (!window.confirm('Permanently delete this debt?')) return;
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
                                    placeholder="e.g. credit card"
                                    options={presetOptions}
                                    onSelect={opt => {
                                        const full = presetOptions.find(p => p.key === opt.key);
                                        if (full) form.setValue('kind', full.kind);
                                    }}
                                />
                            ) : (
                                <Input placeholder="e.g. credit card" {...field} />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="kind"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                            <select
                                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                                {...field}>
                                <option value="CREDIT_CARD">Credit card</option>
                                <option value="LOAN">Loan</option>
                                <option value="STUDENT">Student loan</option>
                                <option value="MORTGAGE">Mortgage</option>
                                <option value="FAMILY">Family</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Balance (€)</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Interest rate (% per year)</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="12,9" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="minimumPayment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum payment (€)</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormCreateEditShell>
    );
}

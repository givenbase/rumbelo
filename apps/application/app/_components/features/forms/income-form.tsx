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
import { Cadence, IncomeKind } from '@rumbelo/contracts';
import { formatMoney } from '@rumbelo/utils';
import { z } from 'zod';

import { parseEurosToCents } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { ConfirmActionButton } from './confirm-action-button';
import { PresetNameField } from './preset-name-field';

const incomeFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
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
    kind: z.enum(IncomeKind),
    cadence: z.enum(Cadence),
    amountEffectiveFrom: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

type IncomePeriod = {
    id: string;
    amount: number;
    effectiveOn: string;
};

type IncomeFormProps = {
    defaultValues?: Partial<IncomeFormValues>;
    periods?: IncomePeriod[];
    embedded?: boolean;
    mode?: 'create' | 'edit';
    entityId?: string;
    onSuccess?: () => void;
};

const EMPTY_PERIODS: IncomePeriod[] = [];

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export function IncomeForm({
    defaultValues,
    periods = EMPTY_PERIODS,
    embedded = true,
    mode = 'create',
    entityId,
    onSuccess,
}: IncomeFormProps) {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const dismiss = useFormDismiss(onSuccess);
    const live = isLiveData(householdId);

    const presetsQuery = useLiveQuery(
        api.money.catalogs.incomeSourcePresets.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live && mode === 'create'
    );
    const presetOptions = useMemo(
        () =>
            (presetsQuery.data ?? []).map(preset => ({
                key: preset.key,
                name: preset.name,
                kind: preset.kind,
                defaultCadence: preset.defaultCadence,
            })),
        [presetsQuery.data]
    );

    const form = useForm<IncomeFormValues>({
        defaultValues: {
            name: defaultValues?.name ?? '',
            amount: defaultValues?.amount ?? '',
            kind: defaultValues?.kind ?? IncomeKind.SALARY,
            cadence: defaultValues?.cadence ?? Cadence.MONTHLY,
            amountEffectiveFrom: defaultValues?.amountEffectiveFrom ?? todayIso(),
        },
        resolver: zodResolver(incomeFormSchema),
    });

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: IncomeFormValues) => {
            if (!householdId) throw new Error('No household');
            const cents = parseEurosToCents(values.amount);
            if (cents === null || cents <= 0) throw new Error('Invalid amount');
            const name = values.name.trim();
            if (mode === 'edit' && entityId) {
                return client.money.income.update({
                    id: entityId,
                    householdId,
                    name,
                    amount: cents,
                    kind: values.kind,
                    cadence: values.cadence,
                    amountEffectiveFrom: values.amountEffectiveFrom?.slice(0, 10) || todayIso(),
                });
            }
            return client.money.income.create({
                householdId,
                name,
                amount: cents,
                kind: values.kind,
                cadence: values.cadence,
                expectedDay: null,
                isActive: true,
                startedOn: null,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.income.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.goals.projections.key() });
            showToast(mode === 'edit' ? 'Income updated' : 'Income saved', 'success');
            dismiss();
        },
        onError: () => showToast('Save failed', 'error'),
    });

    const removeMutation = useMutation({
        mutationFn: async () => {
            if (!householdId || !entityId) throw new Error('No household');
            return client.money.income.remove({ householdId, id: entityId });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.income.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
            showToast('Income deleted', 'success');
            dismiss();
        },
        onError: () => showToast('Delete failed', 'error'),
    });

    async function onSubmit(values: IncomeFormValues) {
        if (!live) {
            showToast('Sign in to save income', 'error');
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
                              : 'Save income'}
                    </Button>
                    {mode === 'edit' && entityId ? (
                        <ConfirmActionButton
                            variant="ghost"
                            className="w-full text-danger hover:bg-danger/10 hover:text-danger"
                            disabled={busy}
                            pending={removeMutation.isPending}
                            label="Delete"
                            confirmLabel="Click again to delete"
                            onConfirm={() => void removeMutation.mutateAsync()}
                        />
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
                                    placeholder="e.g. salary"
                                    options={presetOptions}
                                    onSelect={opt => {
                                        const full = presetOptions.find(
                                            preset => preset.key === opt.key
                                        );
                                        if (!full) return;
                                        form.setValue('kind', full.kind);
                                        form.setValue('cadence', full.defaultCadence);
                                    }}
                                />
                            ) : (
                                <Input placeholder="e.g. salary" {...field} />
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
                        <FormLabel>{mode === 'edit' ? 'New amount (€)' : 'Amount (€)'}</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {mode === 'edit' ? (
                <FormField
                    control={form.control}
                    name="amountEffectiveFrom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Effective from</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : null}

            <FormField
                control={form.control}
                name="cadence"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>How often</FormLabel>
                        <FormControl>
                            <select
                                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                                {...field}>
                                <option value={Cadence.WEEKLY}>Weekly</option>
                                <option value={Cadence.MONTHLY}>Monthly</option>
                                <option value={Cadence.QUARTERLY}>Quarterly</option>
                                <option value={Cadence.YEARLY}>Yearly</option>
                                <option value={Cadence.ONCE}>One-time</option>
                            </select>
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
                                <option value="SALARY">Salary</option>
                                <option value="FREELANCE">Freelance</option>
                                <option value="BENEFIT">Benefit</option>
                                <option value="RENTAL">Rental income</option>
                                <option value="DIVIDEND">Dividend</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {mode === 'edit' && periods.length > 0 ? (
                <div className="grid gap-2 border-t border-line pt-4">
                    <p className="font-mono text-xs font-medium tracking-widest text-fg-muted uppercase">
                        Amount history
                    </p>
                    <ul className="grid gap-1.5">
                        {periods.map(period => (
                            <li
                                key={period.id}
                                className="flex items-baseline justify-between gap-3 text-sm">
                                <span className="font-mono text-xs text-fg-muted">
                                    {period.effectiveOn}
                                </span>
                                <span className="font-mono text-fg">
                                    {formatMoney(period.amount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </FormCreateEditShell>
    );
}

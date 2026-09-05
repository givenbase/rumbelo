'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
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
            return cents !== null && cents > 0;
        },
        { message: 'Enter a valid amount' }
    );

const goalFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    target: euros,
    monthlyContribution: z.string().optional(),
    jarId: z.string().optional(),
    why: z.string().max(500).optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

type GoalFormProps = {
    defaultValues?: Partial<GoalFormValues>;
    embedded?: boolean;
    mode?: 'create' | 'edit';
    entityId?: string;
    onSuccess?: () => void;
};

export function GoalForm({
    defaultValues,
    embedded = true,
    mode = 'create',
    entityId,
    onSuccess,
}: GoalFormProps) {
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

    const presetsQuery = useLiveQuery(
        api.money.catalogs.goalPresets.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live && mode === 'create'
    );
    const presetOptions = useMemo(
        () =>
            (presetsQuery.data ?? []).map(p => ({
                key: p.key,
                name: p.name,
                jarKey: p.jarKey,
            })),
        [presetsQuery.data]
    );

    const form = useForm<GoalFormValues>({
        defaultValues: {
            name: defaultValues?.name ?? '',
            target: defaultValues?.target ?? '',
            monthlyContribution: defaultValues?.monthlyContribution ?? '',
            jarId: defaultValues?.jarId ?? '',
            why: defaultValues?.why ?? '',
        },
        resolver: zodResolver(goalFormSchema),
    });

    useEffect(() => {
        if (!form.getValues('jarId') && jars.length > 0) {
            const lts = jars.find(j => j.key === 'LONG_TERM_SAVINGS');
            form.setValue('jarId', lts?.id ?? jars[0]!.id);
        }
    }, [jars, form]);

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: GoalFormValues) => {
            if (!householdId) throw new Error('No household');
            const target = parseEurosToCents(values.target);
            if (target === null || target <= 0) throw new Error('Invalid target');
            const monthly = values.monthlyContribution?.trim()
                ? (parseEurosToCents(values.monthlyContribution) ?? 0)
                : 0;
            const name = values.name.trim();
            const jarId = values.jarId || null;
            const why = values.why?.trim() || null;
            if (mode === 'edit' && entityId) {
                return client.money.goals.update({
                    id: entityId,
                    householdId,
                    name,
                    target,
                    monthlyContribution: monthly,
                    jarId,
                    why,
                });
            }
            return client.money.goals.create({
                householdId,
                jarId,
                name,
                icon: null,
                target,
                monthlyContribution: monthly,
                targetOn: null,
                status: 'ACTIVE',
                why,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.goals.projections.key() });
            showToast(mode === 'edit' ? 'Goal updated' : 'Goal saved', 'success');
            dismiss();
        },
        onError: () => showToast('Save failed', 'error'),
    });

    const removeMutation = useMutation({
        mutationFn: async () => {
            if (!householdId || !entityId) throw new Error('No household');
            return client.money.goals.remove({ householdId, id: entityId });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.goals.projections.key() });
            showToast('Goal deleted', 'success');
            dismiss();
        },
        onError: () => showToast('Delete failed', 'error'),
    });

    async function onSubmit(values: GoalFormValues) {
        if (!live) {
            showToast('Sign in to save goals', 'error');
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
                              : 'Save goal'}
                    </Button>
                    {mode === 'edit' && entityId ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-danger hover:bg-danger/10 hover:text-danger"
                            disabled={busy}
                            onClick={() => {
                                if (!window.confirm('Permanently delete this goal?')) return;
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
                                    placeholder="e.g. emergency fund"
                                    options={presetOptions}
                                    onSelect={opt => {
                                        const full = presetOptions.find(p => p.key === opt.key);
                                        if (!full) return;
                                        const jar = jars.find(j => j.key === full.jarKey);
                                        if (jar) form.setValue('jarId', jar.id);
                                    }}
                                />
                            ) : (
                                <Input placeholder="e.g. emergency fund" {...field} />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target amount (€)</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Monthly contribution (€)</FormLabel>
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
                                {jars.map(jar => (
                                    <option key={jar.id} value={jar.id}>
                                        {jar.icon ? `${jar.icon} ` : ''}
                                        {jar.name}
                                    </option>
                                ))}
                            </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="why"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Why (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Briefly why this matters" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormCreateEditShell>
    );
}

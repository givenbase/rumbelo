'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

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
import { GoalKind, GoalStatus } from '@rumbelo/contracts';
import { z } from 'zod';

import { parseEurosToCents } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { ConfirmActionButton } from './confirm-action-button';
import { PresetNameField } from './preset-name-field';

const euros = z
    .string()
    .min(1, 'Amount is required')
    .refine(
        value => {
            const cents = parseEurosToCents(value);
            return cents !== null && cents > 0;
        },
        { message: 'Enter a valid amount' }
    );

const goalFormSchema = z.object({
    kind: z.enum(GoalKind),
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
            (presetsQuery.data ?? []).map(preset => ({
                key: preset.key,
                name: preset.name,
                jarKey: preset.jarKey,
                icon: preset.icon,
            })),
        [presetsQuery.data]
    );
    const selectedIcon = useRef<string | null>(null);

    const form = useForm<GoalFormValues>({
        defaultValues: {
            kind: defaultValues?.kind ?? GoalKind.SAVE,
            name: defaultValues?.name ?? '',
            target: defaultValues?.target ?? '',
            monthlyContribution: defaultValues?.monthlyContribution ?? '',
            jarId: defaultValues?.jarId ?? '',
            why: defaultValues?.why ?? '',
        },
        resolver: zodResolver(goalFormSchema),
    });

    const kind = useWatch({ control: form.control, name: 'kind' });
    const isEarn = kind === GoalKind.EARN;

    useEffect(() => {
        if (isEarn) return;
        if (!form.getValues('jarId') && jars.length > 0) {
            const lts = jars.find(j => j.key === 'LONG_TERM_SAVINGS');
            form.setValue('jarId', lts?.id ?? jars[0]!.id);
        }
    }, [jars, form, isEarn]);

    const onError = createFormInvalidHandler(({ title, description }) => {
        showToast(description ?? title, 'error');
    });

    const saveMutation = useMutation({
        mutationFn: async (values: GoalFormValues) => {
            if (!householdId) throw new Error('No household');
            const target = parseEurosToCents(values.target);
            if (target === null || target <= 0) throw new Error('Invalid target');
            const earn = values.kind === GoalKind.EARN;
            const monthly = earn
                ? 0
                : values.monthlyContribution?.trim()
                  ? (parseEurosToCents(values.monthlyContribution) ?? 0)
                  : 0;
            const name = values.name.trim();
            const jarId = earn ? null : values.jarId || null;
            const why = values.why?.trim() || null;
            if (mode === 'edit' && entityId) {
                return client.money.goals.update({
                    id: entityId,
                    householdId,
                    kind: values.kind,
                    name,
                    target,
                    monthlyContribution: monthly,
                    jarId,
                    why,
                });
            }
            return client.money.goals.create({
                householdId,
                kind: values.kind,
                jarId,
                name,
                icon: selectedIcon.current,
                target,
                monthlyContribution: monthly,
                targetOn: null,
                status: GoalStatus.ACTIVE,
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
                name="kind"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Goal type</FormLabel>
                        <FormControl>
                            <select
                                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                                {...field}>
                                <option value={GoalKind.SAVE}>Save into a jar</option>
                                <option value={GoalKind.EARN}>Earn monthly net</option>
                            </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            {mode === 'create' && !isEarn ? (
                                <PresetNameField
                                    value={field.value}
                                    placeholder="e.g. emergency fund"
                                    options={presetOptions}
                                    onChange={value => {
                                        field.onChange(value);
                                        if (
                                            !presetOptions.some(
                                                preset =>
                                                    preset.name.toLowerCase() ===
                                                    value.trim().toLowerCase()
                                            )
                                        ) {
                                            selectedIcon.current = null;
                                        }
                                    }}
                                    onSelect={opt => {
                                        const full = presetOptions.find(
                                            preset => preset.key === opt.key
                                        );
                                        if (!full) return;
                                        selectedIcon.current = full.icon;
                                        const jar = jars.find(j => j.key === full.jarKey);
                                        if (jar) form.setValue('jarId', jar.id);
                                    }}
                                />
                            ) : (
                                <Input
                                    placeholder={
                                        isEarn ? 'e.g. €5k net income' : 'e.g. emergency fund'
                                    }
                                    {...field}
                                />
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
                        <FormLabel>{isEarn ? 'Monthly net (€)' : 'Target amount (€)'}</FormLabel>
                        <FormControl>
                            <Input inputMode="decimal" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {!isEarn ? (
                <>
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
                </>
            ) : null}

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

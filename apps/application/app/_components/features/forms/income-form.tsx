'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
 Button, Input , createFormInvalidHandler } from '@rumbelo/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { parseEurosToCents } from '@/app/_lib/money-input';
import { isLiveData } from '@/app/_lib/preview';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';

const incomeFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => {
      const cents = parseEurosToCents(v);
      return cents != null && cents > 0;
    }, { message: 'Enter a valid amount' }),
  kind: z.enum(['SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER']),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

type IncomeFormProps = {
  defaultValues?: Partial<IncomeFormValues>;
  embedded?: boolean;
  mode?: 'create' | 'edit';
  entityId?: string;
  onSuccess?: () => void;
};

export function IncomeForm({
  defaultValues,
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

  const form = useForm<IncomeFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      amount: defaultValues?.amount ?? '',
      kind: defaultValues?.kind ?? 'SALARY',
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
      if (cents == null || cents <= 0) throw new Error('Invalid amount');
      const name = values.name.trim();
      if (mode === 'edit' && entityId) {
        return client.money.income.update({
          id: entityId,
          householdId,
          name,
          amount: cents,
          kind: values.kind,
        });
      }
      return client.money.income.create({
        householdId,
        name,
        amount: cents,
        kind: values.kind,
        cadence: 'MONTHLY',
        expectedDay: null,
        active: true,
        startedOn: null,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.income.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.dashboard.get.key() });
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
            <Button
              type="button"
              variant="ghost"
              className="w-full text-danger hover:bg-danger/10 hover:text-danger"
              disabled={busy}
              onClick={() => {
                if (!window.confirm('Permanently delete this income source?')) return;
                void removeMutation.mutateAsync();
              }}
            >
              {removeMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          ) : null}
        </div>
      }
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. salary" {...field} />
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
        name="kind"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <select
                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                {...field}
              >
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
    </FormCreateEditShell>
  );
}

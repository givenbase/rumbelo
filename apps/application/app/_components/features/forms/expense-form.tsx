'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumbelo/ui';
import { Button, Input } from '@rumbelo/ui';
import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useLiveQuery } from '@rumbelo/hooks';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { createFormInvalidHandler } from '@rumbelo/ui';
import { parseEurosToCents, todayIsoDate } from '@/app/_lib/money-input';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { isLiveData } from '@/app/_lib/preview';

const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Bedrag is verplicht')
    .refine((v) => {
      const cents = parseEurosToCents(v);
      return cents != null && cents > 0;
    }, { message: 'Voer een geldig bedrag in' }),
  description: z.string().min(1, 'Omschrijving is verplicht').max(120),
  jarId: z.string().min(1, 'Kies een pot'),
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
    live,
  );
  const jars = jarsQuery.data ?? [];

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
      showToast(mode === 'edit' ? 'Uitgave bijgewerkt' : 'Uitgave opgeslagen', 'success');
      dismiss();
    },
    onError: () => showToast('Opslaan mislukt', 'error'),
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
      showToast('Uitgave verwijderd', 'success');
      dismiss();
    },
    onError: () => showToast('Verwijderen mislukt', 'error'),
  });

  async function onSubmit(values: ExpenseFormValues) {
    if (!live) {
      showToast('Log in om uitgaven op te slaan', 'error');
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
              ? 'Bezig…'
              : mode === 'edit'
                ? 'Wijzigingen opslaan'
                : 'Uitgave opslaan'}
          </Button>
          {mode === 'edit' && entityId ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-danger hover:bg-danger/10 hover:text-danger"
              disabled={form.formState.isSubmitting || saveMutation.isPending || removeMutation.isPending}
              onClick={() => {
                if (!window.confirm('Deze uitgave definitief verwijderen?')) return;
                void removeMutation.mutateAsync();
              }}
            >
              {removeMutation.isPending ? 'Verwijderen…' : 'Verwijderen'}
            </Button>
          ) : null}
        </div>
      }
    >
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Omschrijving</FormLabel>
            <FormControl>
              <Input placeholder="Bijv. boodschappen" {...field} />
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
            <FormLabel>Bedrag (€)</FormLabel>
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
            <FormLabel>Pot</FormLabel>
            <FormControl>
              <select
                className="h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
                {...field}
              >
                {jars.length === 0 ? (
                  <option value="">Geen potten — rond onboarding af</option>
                ) : (
                  jars.map((jar) => (
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

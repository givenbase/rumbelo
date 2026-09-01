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
import { parseEurosToCents } from '@/app/_lib/money-input';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';
import { isLiveData } from '@/app/_lib/preview';

const euros = z
  .string()
  .min(1, 'Bedrag is verplicht')
  .refine((v) => {
    const cents = parseEurosToCents(v);
    return cents != null && cents > 0;
  }, { message: 'Voer een geldig bedrag in' });

const fixedCostFormSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht').max(120),
  amount: euros,
  jarId: z.string().min(1, 'Kies een pot'),
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

  const jarsQuery = useLiveQuery(
    api.money.jars.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );
  const jars = jarsQuery.data ?? [];

  const form = useForm<FixedCostFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      amount: defaultValues?.amount ?? '',
      jarId: defaultValues?.jarId ?? '',
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
      if (mode === 'edit' && entityId) {
        return client.money.fixedCosts.update({
          id: entityId,
          householdId,
          name,
          amount: cents,
          jarId: values.jarId,
          dueDay,
        });
      }
      return client.money.fixedCosts.create({
        householdId,
        jarId: values.jarId,
        categoryId: null,
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
      showToast(mode === 'edit' ? 'Vaste last bijgewerkt' : 'Vaste last opgeslagen', 'success');
      dismiss();
    },
    onError: () => showToast('Opslaan mislukt', 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!householdId || !entityId) throw new Error('No household');
      return client.money.fixedCosts.remove({ householdId, id: entityId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.fixedCosts.byJar.key() });
      showToast('Vaste last verwijderd', 'success');
      dismiss();
    },
    onError: () => showToast('Verwijderen mislukt', 'error'),
  });

  async function onSubmit(values: FixedCostFormValues) {
    if (!live) {
      showToast('Log in om vaste lasten op te slaan', 'error');
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
                : 'Vaste last opslaan'}
          </Button>
          {mode === 'edit' && entityId ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-danger hover:bg-danger/10 hover:text-danger"
              disabled={form.formState.isSubmitting || saveMutation.isPending || removeMutation.isPending}
              onClick={() => {
                if (!window.confirm('Deze vaste last definitief verwijderen?')) return;
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Naam</FormLabel>
            <FormControl>
              <Input placeholder="Bijv. huur" {...field} />
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
            <FormLabel>Bedrag per maand (€)</FormLabel>
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

      <FormField
        control={form.control}
        name="dueDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vervaldatum (dag van de maand)</FormLabel>
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

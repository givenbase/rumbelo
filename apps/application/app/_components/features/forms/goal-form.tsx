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

const goalFormSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht').max(120),
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
    live,
  );
  const jars = jarsQuery.data ?? [];

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
      const lts = jars.find((j) => j.key === 'LONG_TERM_SAVINGS');
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
      if (target == null || target <= 0) throw new Error('Invalid target');
      const monthly = values.monthlyContribution?.trim()
        ? parseEurosToCents(values.monthlyContribution) ?? 0
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
        targetDate: null,
        status: 'ACTIVE',
        why,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.goals.projections.key() });
      showToast(mode === 'edit' ? 'Doel bijgewerkt' : 'Doel opgeslagen', 'success');
      dismiss();
    },
    onError: () => showToast('Opslaan mislukt', 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!householdId || !entityId) throw new Error('No household');
      return client.money.goals.remove({ householdId, id: entityId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.money.goals.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.goals.projections.key() });
      showToast('Doel verwijderd', 'success');
      dismiss();
    },
    onError: () => showToast('Verwijderen mislukt', 'error'),
  });

  async function onSubmit(values: GoalFormValues) {
    if (!live) {
      showToast('Log in om doelen op te slaan', 'error');
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
              ? 'Bezig…'
              : mode === 'edit'
                ? 'Wijzigingen opslaan'
                : 'Doel opslaan'}
          </Button>
          {mode === 'edit' && entityId ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-danger hover:bg-danger/10 hover:text-danger"
              disabled={busy}
              onClick={() => {
                if (!window.confirm('Dit doel definitief verwijderen?')) return;
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
              <Input placeholder="Bijv. noodfonds" {...field} />
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
            <FormLabel>Doelbedrag (€)</FormLabel>
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
            <FormLabel>Maandelijkse inleg (€)</FormLabel>
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
                {jars.map((jar) => (
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
            <FormLabel>Waarom (optioneel)</FormLabel>
            <FormControl>
              <Input placeholder="Kort waarom dit ertoe doet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormCreateEditShell>
  );
}

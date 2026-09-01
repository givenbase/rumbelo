'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumbelo/ui';
import { Button, Input } from '@rumbelo/ui';
import { FormCreateEditShell } from '@/components/layout/form-create-edit-shell';
import { createFormInvalidHandler } from '@rumbelo/ui';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useFormDismiss } from '@/app/_lib/use-form-dismiss';

const stubSchema = z.object({
  label: z.string().min(1, 'Naam is verplicht').max(80),
  amount: z.string().optional(),
});

type StubValues = z.infer<typeof stubSchema>;

export type StubKind = 'session' | 'asset' | 'move';

const KIND_COPY: Record<
  StubKind,
  { submit: string; amountLabel?: string; labelPlaceholder: string }
> = {
  session: {
    submit: 'Training opslaan',
    labelPlaceholder: 'Bijv. hardlopen',
  },
  asset: {
    submit: 'Bezitting opslaan',
    amountLabel: 'Waarde (€)',
    labelPlaceholder: 'Bijv. fiets',
  },
  move: {
    submit: 'Verplaatsen',
    amountLabel: 'Bedrag (€)',
    labelPlaceholder: 'Van → naar',
  },
};

type SheetStubFormProps = {
  kind: StubKind;
  defaultValues?: Partial<StubValues>;
  embedded?: boolean;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
};

/**
 * Placeholder forms for domains without a money API yet (energy session, assets, jar moves).
 * Same shell + RHF/zod pattern as the live money forms.
 */
export function SheetStubForm({
  kind,
  defaultValues,
  embedded = true,
  mode = 'create',
  onSuccess,
}: SheetStubFormProps) {
  const { showToast } = useAppShell();
  const dismiss = useFormDismiss(onSuccess);
  const copy = KIND_COPY[kind];

  const form = useForm<StubValues>({
    defaultValues: {
      label: defaultValues?.label ?? '',
      amount: defaultValues?.amount ?? '',
    },
    resolver: zodResolver(stubSchema),
  });

  const onError = createFormInvalidHandler(({ title, description }) => {
    showToast(description ?? title, 'error');
  });

  async function onSubmit(_values: StubValues) {
    showToast(
      mode === 'edit' ? 'Opgeslagen (lokaal)' : `${copy.submit.replace(' opslaan', '')} klaar (lokaal)`,
      'success',
    );
    dismiss();
  }

  return (
    <FormCreateEditShell
      embedded={embedded}
      form={form}
      onError={onError}
      onSubmit={onSubmit}
      sidebar={
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Bezig…' : copy.submit}
        </Button>
      }
    >
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Naam</FormLabel>
            <FormControl>
              <Input placeholder={copy.labelPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {copy.amountLabel ? (
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{copy.amountLabel}</FormLabel>
              <FormControl>
                <Input inputMode="decimal" placeholder="0,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}

      <p className="text-xs text-fg-faint">
        Nog geen live API voor dit type — het formulierpatroon staat al klaar.
      </p>
    </FormCreateEditShell>
  );
}

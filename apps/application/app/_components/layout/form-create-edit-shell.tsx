'use client';

import type { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormErrorBox,
  bindFormSubmit,
  createFormInvalidHandler,
} from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

type FormCreateEditShellProps<T extends FieldValues> = {
  /** Optional API/mutation error shown above the fields. */
  apiError?: unknown;
  children: React.ReactNode;
  /**
   * Modal/sheet mode: single column + sticky footer action bar.
   * Full-page mode (later): two-column with sidebar — keep `embedded` false.
   */
  embedded?: boolean;
  form: UseFormReturn<T>;
  onError?: (errors: FieldErrors<T>) => void;
  onSubmit: (values: T) => Promise<void> | void;
  /** Save / actions — sticky footer when embedded. */
  sidebar: React.ReactNode;
};

/** Stronger field contrast for forms rendered inside sheets/modals. */
export const embeddedFormSurfaceClass = [
  'text-fg',
  '[&_label]:text-fg-muted',
  '[&_label]:font-semibold',
  '[&_label]:tracking-[0.08em]',
  '[&_label]:text-[11px]',
  '[&_label]:uppercase',
].join(' ');

export const formFieldStackClass = 'grid gap-4';

/**
 * Form + layout for create/edit.
 * In embedded (sheet) mode: full-width fields with a sticky footer action bar.
 * Same contract as Galighticus FormCreateEditShell — forms stay reusable in page or modal.
 */
export function FormCreateEditShell<T extends FieldValues>({
  apiError,
  children,
  embedded = true,
  form,
  onError,
  onSubmit,
  sidebar,
}: FormCreateEditShellProps<T>) {
  const handleSubmit = bindFormSubmit(
    form,
    onSubmit,
    onError ?? createFormInvalidHandler(),
  );

  if (embedded) {
    return (
      <Form {...form}>
        <form
          className={cn('flex min-h-full flex-col', embeddedFormSurfaceClass)}
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="min-w-0 flex-1 space-y-4">
            <FormErrorBox apiError={apiError} form={form} />
            <fieldset className={cn('min-w-0 border-0 p-0', formFieldStackClass)}>
              {children}
            </fieldset>
          </div>
          <div className="sticky bottom-0 z-10 -mx-5 mt-6 border-t border-line bg-surface px-5 py-4 shadow-[0_-10px_28px_rgba(0,0,0,0.06)]">
            {sidebar}
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={handleSubmit}
        className={cn('grid gap-6 lg:grid-cols-[1fr_240px]', embeddedFormSurfaceClass)}
      >
        <div className="min-w-0 space-y-4">
          <FormErrorBox apiError={apiError} form={form} />
          <fieldset className={cn('min-w-0 border-0 p-0', formFieldStackClass)}>
            {children}
          </fieldset>
        </div>
        <aside className="rounded-lg border border-line bg-raised p-4 lg:sticky lg:top-4 lg:self-start">
          {sidebar}
        </aside>
      </form>
    </Form>
  );
}

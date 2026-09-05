'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import {
    Button,
    Form,
    FormControl,
    FormErrorBox,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    bindFormSubmit,
    createFormInvalidHandler,
} from '@rumbelo/ui';
import { AUTH_FORGOT_PASSWORD } from '@rumbelo/i18n';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { requestPasswordReset } from '@/lib/auth';
import { appSignInUrl, webOrigin } from '@/lib/portal-urls';

const schema = z.object({
    email: z.email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
    const [apiError, setApiError] = useState<unknown>(null);
    const [sent, setSent] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: { email: '' },
        mode: 'onTouched',
        resolver: zodResolver(schema),
    });

    const onError = createFormInvalidHandler();

    async function onSubmit(values: FormValues) {
        setApiError(null);
        const result = await requestPasswordReset({
            email: values.email,
            redirectTo: `${webOrigin()}/reset-password`,
        });

        if (result.error) {
            setApiError(result.error.message ?? 'Could not send reset email');
            return;
        }

        setSent(true);
    }

    const busy = form.formState.isSubmitting;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {AUTH_FORGOT_PASSWORD.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{AUTH_FORGOT_PASSWORD.subtitle}</p>
            </div>

            {sent ? (
                <p className="text-sm text-fg-secondary">{AUTH_FORGOT_PASSWORD.sent}</p>
            ) : (
                <Form {...form}>
                    <form
                        className="grid gap-4"
                        method="post"
                        onSubmit={bindFormSubmit(form, onSubmit, onError)}>
                        <FormErrorBox apiError={apiError} form={form} />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            disabled={busy}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-1 w-full" disabled={busy}>
                            {busy ? 'Working…' : AUTH_FORGOT_PASSWORD.submit}
                        </Button>
                    </form>
                </Form>
            )}

            <p className="text-center text-sm text-fg-muted">
                <a href={appSignInUrl()} className="font-semibold text-accent hover:underline">
                    {AUTH_FORGOT_PASSWORD.back_to_sign_in}
                </a>
                {' · '}
                <Link href="/sign-up" className="font-semibold text-accent hover:underline">
                    {AUTH_FORGOT_PASSWORD.back_to_sign_up}
                </Link>
            </p>
        </div>
    );
}

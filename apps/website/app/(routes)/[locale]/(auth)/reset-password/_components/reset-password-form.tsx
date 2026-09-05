'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
import { AUTH_RESET_PASSWORD } from '@rumbelo/i18n';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { resetPassword } from '@/lib/auth';
import { appSignInUrl } from '@/lib/portal-urls';

const MIN_PASSWORD_LENGTH = 12;

const schema = z
    .object({
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
        confirm: z.string(),
    })
    .refine(data => data.password === data.confirm, {
        message: 'Passwords do not match',
        path: ['confirm'],
    });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
    const tokenError = searchParams.get('error');

    const [apiError, setApiError] = useState<unknown>(null);
    const [done, setDone] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: { password: '', confirm: '' },
        mode: 'onTouched',
        resolver: zodResolver(schema),
    });

    const onError = createFormInvalidHandler();

    async function onSubmit(values: FormValues) {
        if (!token) {
            setApiError('This reset link is invalid or incomplete.');
            return;
        }

        setApiError(null);
        const result = await resetPassword({
            newPassword: values.password,
            token,
        });

        if (result.error) {
            setApiError(result.error.message ?? 'Could not reset password');
            return;
        }

        setDone(true);
    }

    const busy = form.formState.isSubmitting;
    const invalidToken = Boolean(tokenError) || (!token && !done);

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {AUTH_RESET_PASSWORD.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">
                    {invalidToken ? AUTH_RESET_PASSWORD.invalid : AUTH_RESET_PASSWORD.subtitle}
                </p>
            </div>

            {done ? (
                <>
                    <p className="text-sm text-fg-secondary">{AUTH_RESET_PASSWORD.success}</p>
                    <Button as="a" href={appSignInUrl()} className="w-full">
                        {AUTH_RESET_PASSWORD.continue}
                    </Button>
                </>
            ) : invalidToken ? (
                <Button as={Link} href="/forgot-password" className="w-full">
                    {AUTH_RESET_PASSWORD.request_again}
                </Button>
            ) : (
                <Form {...form}>
                    <form
                        className="grid gap-4"
                        method="post"
                        onSubmit={bindFormSubmit(form, onSubmit, onError)}>
                        <FormErrorBox apiError={apiError} form={form} />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                                            disabled={busy}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={busy}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-1 w-full" disabled={busy}>
                            {busy ? 'Working…' : AUTH_RESET_PASSWORD.submit}
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}

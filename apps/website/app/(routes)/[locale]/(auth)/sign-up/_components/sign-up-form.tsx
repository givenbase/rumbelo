'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

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
import { AUTH_MIN_PASSWORD_LENGTH, SignUpForm as SignUpFormSchema } from '@rumbelo/contracts';
import { AUTH_SIGN_UP } from '@rumbelo/i18n';

import { zodResolver } from '@hookform/resolvers/zod';

import { signUp } from '@/lib/auth';
import { appSignInUrl } from '@/lib/portal-urls';

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [apiError, setApiError] = useState<unknown>(null);

    const form = useForm<SignUpFormSchema>({
        defaultValues: {
            name: searchParams.get('name')?.trim() ?? '',
            email: searchParams.get('email')?.trim() ?? '',
            password: '',
        },
        mode: 'onTouched',
        resolver: zodResolver(SignUpFormSchema),
    });

    const onError = createFormInvalidHandler();

    async function onSubmit(values: SignUpFormSchema) {
        setApiError(null);

        const result = await signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            callbackURL: '/verify?status=confirmed',
        });

        if (result.error) {
            form.setValue('password', '');
            setApiError(result.error.message ?? 'Registration failed');
            return;
        }

        router.push(`/verify?email=${encodeURIComponent(values.email)}`);
        router.refresh();
    }

    const busy = form.formState.isSubmitting;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {AUTH_SIGN_UP.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{AUTH_SIGN_UP.subtitle}</p>
            </div>

            <Form {...form}>
                <form
                    className="grid gap-4"
                    method="post"
                    onSubmit={bindFormSubmit(form, onSubmit, onError)}>
                    <FormErrorBox apiError={apiError} form={form} />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="name"
                                        placeholder="Your name"
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder={`At least ${AUTH_MIN_PASSWORD_LENGTH} characters`}
                                        disabled={busy}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="mt-1 w-full" disabled={busy}>
                        {busy ? 'Working…' : 'Create account'}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-fg-muted">
                Already have an account?{' '}
                <a href={appSignInUrl()} className="font-semibold text-accent hover:underline">
                    Sign in
                </a>
            </p>
        </div>
    );
}

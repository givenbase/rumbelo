'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { signUp } from '@/app/_lib/auth';
import { AUTH_SIGN_UP } from '@/app/_lib/brand-quotes';

/** Matches Nest Better Auth `emailAndPassword.minPasswordLength`. */
const MIN_PASSWORD_LENGTH = 12;

const signUpFormSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(80),
    email: z.email('Enter a valid email'),
    password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

/**
 * Sign-up — same contract as Meltizo/Galighticus auth forms:
 * useForm + zodResolver → Form + FormField → Better Auth signUp.email.
 */
export function SignUpForm() {
    const router = useRouter();
    const [apiError, setApiError] = useState<unknown>(null);

    const form = useForm<SignUpFormValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        mode: 'onTouched',
        resolver: zodResolver(signUpFormSchema),
    });

    const onError = createFormInvalidHandler();

    async function onSubmit(values: SignUpFormValues) {
        setApiError(null);

        const result = await signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            callbackURL: '/',
        });

        if (result.error) {
            form.setValue('password', '');
            setApiError(result.error.message ?? 'Registration failed');
            return;
        }

        router.push('/');
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
                                        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
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
                <Link href="/sign-in" className="font-semibold text-accent hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

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
} from '@rumtelo/ui';
import {
    AUTH_MIN_PASSWORD_LENGTH,
    SignUpForm as SignUpFormSchema,
    composeDisplayName,
} from '@rumtelo/contracts';
import { AUTH_SIGN_UP } from '@rumtelo/i18n';

import { zodResolver } from '@hookform/resolvers/zod';

import { signUp } from '@/lib/auth';
import { appSignInUrl } from '@/lib/portal-urls';
import { useOptionalPlanIntent } from '@/app/_components/plan-intent-provider';
import { planIntentQuery } from '@rumtelo/utils';

const PLAN_LABELS = { PLUS: 'Plus', MAX: 'Max' } as const;

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planIntent = useOptionalPlanIntent();
    const [apiError, setApiError] = useState<unknown>(null);

    const intent = planIntent?.intent ?? null;

    const form = useForm<SignUpFormSchema>({
        defaultValues: {
            firstName: searchParams.get('firstName')?.trim() ?? '',
            middleName: '',
            lastName: searchParams.get('lastName')?.trim() ?? '',
            email: searchParams.get('email')?.trim() ?? '',
            password: '',
            phone: '',
            dateOfBirth: '',
        },
        mode: 'onTouched',
        resolver: zodResolver(SignUpFormSchema),
    });

    const onError = createFormInvalidHandler();

    async function onSubmit(values: SignUpFormSchema) {
        setApiError(null);

        const name = composeDisplayName(values.firstName, values.middleName, values.lastName);

        const result = await signUp.email({
            name,
            email: values.email,
            password: values.password,
            callbackURL: `/verify?status=confirmed${intent ? `&plan=${intent.planKey}&interval=${intent.interval}` : ''}`,
            // Forwarded to Nest → stashed → `auth.account` (not Better Auth user columns).
            firstName: values.firstName,
            middleName: values.middleName || undefined,
            lastName: values.lastName,
            phone: values.phone || undefined,
            dateOfBirth: values.dateOfBirth || undefined,
        } as never);

        if (result.error) {
            form.setValue('password', '');
            setApiError(result.error.message ?? 'Registration failed');
            return;
        }

        const verifyParams = new URLSearchParams({
            email: values.email,
            ...planIntentQuery(intent),
        });
        router.push(`/verify?${verifyParams.toString()}`);
        router.refresh();
    }

    const busy = form.formState.isSubmitting;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
                    {AUTH_SIGN_UP.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{AUTH_SIGN_UP.subtitle}</p>
                {intent ? (
                    <p className="mt-3 rounded-lg border border-accent/35 bg-accent-soft/40 px-3 py-2 text-sm text-fg-secondary">
                        You chose{' '}
                        <span className="font-semibold text-fg">{PLAN_LABELS[intent.planKey]}</span>
                        {intent.interval === 'year' ? ' (yearly)' : ' (monthly)'}. After setup we’ll
                        take you to Stripe to add payment and finish the upgrade.
                    </p>
                ) : null}
            </div>

            <Form {...form}>
                <form
                    className="grid gap-4"
                    method="post"
                    onSubmit={bindFormSubmit(form, onSubmit, onError)}>
                    <FormErrorBox apiError={apiError} form={form} />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="given-name"
                                            placeholder="Given"
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
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="family-name"
                                            placeholder="Family"
                                            disabled={busy}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle name</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="additional-name"
                                        placeholder="Optional"
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

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="Optional"
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
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Birthday</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            autoComplete="bday"
                                            disabled={busy}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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

'use client';

import { useEffect, useState } from 'react';
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
import { AUTH_VERIFY } from '@rumbelo/i18n';
import { VerifyEmailForm as VerifyEmailFormSchema } from '@rumbelo/contracts';

import { zodResolver } from '@hookform/resolvers/zod';

import { sendVerificationEmail } from '@/lib/auth';
import { appSignInUrl } from '@/lib/portal-urls';

const RESEND_COOLDOWN_SEC = 60;

function withEmail(template: string, email: string): string {
    return template.replaceAll('{email}', email);
}

export function VerifyPanel() {
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get('email')?.trim() ?? '';
    const status = searchParams.get('status');
    const confirmed = status === 'confirmed' || status === 'ok';

    const [apiError, setApiError] = useState<unknown>(null);
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const form = useForm<VerifyEmailFormSchema>({
        defaultValues: { email: emailFromQuery },
        mode: 'onTouched',
        resolver: zodResolver(VerifyEmailFormSchema),
    });

    const onInvalid = createFormInvalidHandler();

    useEffect(() => {
        if (emailFromQuery) {
            form.reset({ email: emailFromQuery });
        }
    }, [emailFromQuery, form]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = window.setTimeout(() => setCooldown(left => left - 1), 1000);
        return () => window.clearTimeout(id);
    }, [cooldown]);

    async function onSubmit(values: VerifyEmailFormSchema) {
        if (cooldown > 0) return;
        setApiError(null);

        const result = await sendVerificationEmail({
            email: values.email,
            callbackURL: '/verify?status=confirmed',
        });

        if (result.error) {
            setApiError(result.error.message ?? 'Could not resend');
            return;
        }

        setSent(true);
        setCooldown(RESEND_COOLDOWN_SEC);
    }

    const busy = form.formState.isSubmitting;
    const watchedEmail = form.watch('email');
    const subtitle = confirmed
        ? AUTH_VERIFY.confirmed
        : watchedEmail.trim()
          ? withEmail(AUTH_VERIFY.subtitle, watchedEmail.trim())
          : AUTH_VERIFY.subtitle_no_target;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {confirmed ? AUTH_VERIFY.confirmed_title : AUTH_VERIFY.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
            </div>

            {confirmed ? (
                <Button as="a" href={appSignInUrl({ verified: '1' })} className="w-full">
                    {AUTH_VERIFY.continue}
                </Button>
            ) : (
                <Form {...form}>
                    <form
                        className="grid gap-4"
                        method="post"
                        onSubmit={bindFormSubmit(form, onSubmit, onInvalid)}>
                        <FormErrorBox apiError={apiError} form={form} />

                        {sent ? (
                            <p className="text-sm text-fg-secondary">{AUTH_VERIFY.sent}</p>
                        ) : null}

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
                                            disabled={busy || cooldown > 0}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="submit"
                                variant="secondary"
                                disabled={busy || cooldown > 0}
                                className="sm:flex-1">
                                {cooldown > 0
                                    ? AUTH_VERIFY.resend_in.replaceAll(
                                          '{seconds}',
                                          String(cooldown)
                                      )
                                    : busy
                                      ? 'Working…'
                                      : AUTH_VERIFY.resend}
                            </Button>
                            <Button
                                as="a"
                                href={appSignInUrl()}
                                variant="secondary"
                                className="sm:flex-1">
                                {AUTH_VERIFY.continue}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            <p className="text-center text-sm text-fg-muted">
                <Link href="/sign-up" className="font-semibold text-accent hover:underline">
                    {AUTH_VERIFY.back_to_sign_up}
                </Link>
                {' · '}
                <a href={appSignInUrl()} className="font-semibold text-accent hover:underline">
                    {AUTH_VERIFY.back_to_sign_in}
                </a>
            </p>
        </div>
    );
}

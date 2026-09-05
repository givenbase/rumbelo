'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { AUTH_MIN_PASSWORD_LENGTH, LandingSignUpForm } from '@rumbelo/contracts';
import { zodResolver } from '@hookform/resolvers/zod';

import { ASSURANCES } from '@/lib/landing-content';
import { appSignInUrl, webSignUpPath } from '@/lib/portal-urls';

import { LandingIcon } from './landing-icon';

const FIELDS = [
    { name: 'name' as const, label: 'Your name', type: 'text', ph: 'Given Loyiso' },
    { name: 'email' as const, label: 'Email', type: 'email', ph: 'you@example.com' },
    {
        name: 'password' as const,
        label: 'Password',
        type: 'password',
        ph: `at least ${AUTH_MIN_PASSWORD_LENGTH} characters`,
    },
];

export function LandingSignupForm() {
    const router = useRouter();
    const form = useForm<LandingSignUpForm>({
        defaultValues: { name: '', email: '', password: '', terms: false },
        mode: 'onTouched',
        resolver: zodResolver(LandingSignUpForm),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting, touchedFields, submitCount },
    } = form;

    const terms = watch('terms');

    function onSubmit(values: LandingSignUpForm) {
        const params = new URLSearchParams({
            name: values.name,
            email: values.email,
        });
        router.push(`${webSignUpPath()}?${params.toString()}`);
    }

    function fieldError(name: keyof LandingSignUpForm) {
        const show = Boolean(errors[name]) && (touchedFields[name] || submitCount > 0);
        return show ? errors[name]?.message : undefined;
    }

    return (
        <section
            id="signup"
            className="mx-auto max-w-6xl px-4 py-10 pb-12 lg:px-6 lg:py-20 lg:pb-24">
            <div
                className="overflow-hidden rounded-3xl border bg-surface"
                style={{
                    borderColor: 'rgb(67 56 202 / 0.34)',
                    boxShadow: 'var(--shadow-lg), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
                }}>
                <span className="block h-1" style={{ background: 'var(--gradient-accent)' }} />

                <div className="flex flex-col gap-7 p-5 sm:p-6 md:flex-row md:flex-wrap lg:gap-14 lg:p-10">
                    <div className="min-w-0 flex-1 md:basis-80">
                        <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                            ✦ Create your account
                        </span>
                        <h2 className="my-3.5 max-w-sm font-display text-3xl font-semibold tracking-tight lg:text-4xl">
                            Split first. Spend second.
                        </h2>
                        <p className="mb-5 max-w-prose text-base leading-relaxed text-fg-muted">
                            Built for people who are doing well — and for people who are ready to.
                            Tell us what lands each month; Rumbelo assigns it from there.
                        </p>
                        <div className="grid gap-3">
                            {ASSURANCES.map(a => (
                                <span key={a.t} className="flex min-w-0 items-start gap-2.5">
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft">
                                        <LandingIcon
                                            name={a.icon}
                                            size={17}
                                            color="var(--color-accent)"
                                        />
                                    </span>
                                    <span className="pt-1 text-sm leading-relaxed text-fg-secondary">
                                        {a.t}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="w-full max-w-md min-w-0 flex-1 md:basis-80">
                        <button
                            type="button"
                            onClick={() => router.push(webSignUpPath())}
                            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-raised px-0 py-3.5 text-sm font-medium text-fg transition-colors hover:border-accent">
                            <span className="font-mono text-sm font-bold text-accent">G</span>
                            Continue with Google
                        </button>

                        <div className="my-5 flex items-center gap-3">
                            <span className="h-px flex-1 bg-line" />
                            <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                OR WITH EMAIL
                            </span>
                            <span className="h-px flex-1 bg-line" />
                        </div>

                        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                            {FIELDS.map(f => {
                                const message = fieldError(f.name);
                                return (
                                    <label key={f.name} className="grid gap-1.5">
                                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                            {f.label}
                                        </span>
                                        <input
                                            type={f.type}
                                            autoComplete={
                                                f.name === 'password'
                                                    ? 'new-password'
                                                    : f.name === 'email'
                                                      ? 'email'
                                                      : 'name'
                                            }
                                            placeholder={f.ph}
                                            disabled={isSubmitting}
                                            className="w-full rounded-lg border bg-raised px-3.5 py-3 text-sm text-fg transition-colors outline-none focus:border-accent"
                                            style={{
                                                borderColor: message
                                                    ? 'var(--color-danger)'
                                                    : 'var(--color-line)',
                                            }}
                                            {...register(f.name)}
                                        />
                                        {message ? (
                                            <span className="font-mono text-xs font-medium text-danger">
                                                {message}
                                            </span>
                                        ) : null}
                                    </label>
                                );
                            })}

                            <label
                                className="mt-1 flex cursor-pointer items-start gap-2.5"
                                onClick={() =>
                                    setValue('terms', !terms, {
                                        shouldValidate: true,
                                        shouldTouch: true,
                                    })
                                }>
                                <span
                                    className="mt-px grid size-4 shrink-0 place-items-center rounded-sm border text-xs text-on-accent"
                                    style={{
                                        background: terms
                                            ? 'var(--gradient-accent)'
                                            : 'transparent',
                                        borderColor: terms
                                            ? 'transparent'
                                            : 'var(--color-line-strong)',
                                    }}>
                                    {terms ? '✓' : ''}
                                </span>
                                <span className="text-sm leading-relaxed text-fg-muted">
                                    I agree to the terms and privacy policy. Rumbelo has read-only
                                    access to bank data, and only after I connect it myself.
                                </span>
                            </label>
                            {fieldError('terms') ? (
                                <span className="font-mono text-xs font-medium text-danger">
                                    {fieldError('terms')}
                                </span>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-1.5 w-full cursor-pointer rounded-full border-0 py-4 font-mono text-xs font-bold tracking-wide text-on-accent uppercase transition-all hover:brightness-105 active:scale-95 disabled:opacity-60"
                                style={{ background: 'var(--gradient-accent)' }}>
                                Create my free account
                            </button>

                            <span className="text-center font-mono text-xs font-medium tracking-wide text-fg-faint">
                                Already have an account?{' '}
                                <a
                                    href={appSignInUrl()}
                                    className="text-accent hover:text-accent-hover">
                                    Sign in
                                </a>
                            </span>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { AUTH_MIN_PASSWORD_LENGTH, LandingSignUpForm } from '@rumtelo/contracts';
import { zodResolver } from '@hookform/resolvers/zod';

import { ASSURANCES, SIGNUP_SECTION } from '@/lib/landing-content';
import { appSignInUrl, webSignUpPath } from '@/lib/portal-urls';

import { LandingIcon } from './landing-icon';
import { SectionHeading } from './landing-primitives';

const FIELDS = [
    {
        name: 'displayName' as const,
        label: 'Display name',
        type: 'text',
        ph: 'How should the Coach greet you?',
    },
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
        defaultValues: { displayName: '', email: '', password: '', terms: false },
        mode: 'onTouched',
        resolver: zodResolver(LandingSignUpForm),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, touchedFields, submitCount },
    } = form;

    const terms = useWatch({ control, name: 'terms' }) ?? false;

    function onSubmit(values: LandingSignUpForm) {
        const params = new URLSearchParams({
            name: values.displayName,
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
            className="mx-auto max-w-6xl px-4 py-12 pb-14 lg:px-6 lg:py-20 lg:pb-24">
            <div className="overflow-hidden rounded-3xl border border-accent/35 bg-surface shadow-lg ring-1 ring-fg/8 ring-inset dark:ring-white/8">
                <span className="block h-1 bg-(image:--gradient-accent)" />

                <div className="flex flex-col gap-7 p-5 sm:p-6 md:flex-row md:flex-wrap lg:gap-14 lg:p-10">
                    <div className="min-w-0 flex-1 md:basis-80">
                        <SectionHeading
                            eyebrow={SIGNUP_SECTION.eyebrow}
                            headline={SIGNUP_SECTION.headline}
                            lead={SIGNUP_SECTION.lead}
                            headlineClassName="max-w-sm"
                        />
                        <div className="mt-6 grid gap-3">
                            {ASSURANCES.map(assurance => (
                                <span
                                    key={assurance.text}
                                    className="flex min-w-0 items-start gap-2.5">
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                                        <LandingIcon name={assurance.icon} size={17} />
                                    </span>
                                    <span className="pt-1 text-sm leading-relaxed text-fg-secondary">
                                        {assurance.text}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="w-full max-w-md min-w-0 flex-1 md:basis-80">
                        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                            {FIELDS.map(field => {
                                const message = fieldError(field.name);
                                return (
                                    <label key={field.name} className="grid gap-1.5">
                                        <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                            {field.label}
                                        </span>
                                        <input
                                            type={field.type}
                                            autoComplete={
                                                field.name === 'password'
                                                    ? 'new-password'
                                                    : field.name === 'email'
                                                      ? 'email'
                                                      : 'nickname'
                                            }
                                            placeholder={field.ph}
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(message)}
                                            className={`w-full rounded-lg border bg-raised px-3.5 py-3 text-sm text-fg transition-colors outline-none focus:border-accent ${
                                                message ? 'border-danger' : 'border-line'
                                            }`}
                                            {...register(field.name)}
                                        />
                                        {message ? (
                                            <span className="font-mono text-xs font-medium text-danger">
                                                {message}
                                            </span>
                                        ) : null}
                                    </label>
                                );
                            })}

                            <label className="mt-1 flex cursor-pointer items-start gap-2.5">
                                <input type="checkbox" className="sr-only" {...register('terms')} />
                                <span
                                    className={`mt-px grid size-4 shrink-0 place-items-center rounded-sm border text-xs text-on-accent ${
                                        terms
                                            ? 'border-transparent bg-(image:--gradient-accent)'
                                            : 'border-line-strong bg-transparent'
                                    }`}>
                                    {terms ? '✓' : ''}
                                </span>
                                <span className="text-sm leading-relaxed text-fg-muted">
                                    {SIGNUP_SECTION.terms}
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
                                className="mt-1.5 w-full rounded-full border-0 bg-(image:--gradient-accent) py-4 font-mono text-xs font-bold tracking-wide text-on-accent uppercase shadow-glow transition-all hover:brightness-105 active:scale-95 disabled:opacity-60">
                                {SIGNUP_SECTION.submit}
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

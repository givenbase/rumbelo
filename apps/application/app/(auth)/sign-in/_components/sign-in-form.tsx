'use client';

import { useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Field, Input } from '@rumbelo/ui';

import { signIn } from '@/app/_lib/auth';
import { AUTH_SIGN_IN } from '@rumbelo/i18n';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/app/_lib/demo-accounts';

function safeRedirectPath(value: string | null): string {
    if (value && value.startsWith('/') && !value.startsWith('//')) return value;
    return '/';
}

const isDev = process.env.NODE_ENV !== 'production';

export function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = safeRedirectPath(searchParams.get('redirectTo'));
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submitCredentials(nextEmail: string, nextPassword: string) {
        setError(null);
        setPending(true);
        const result = await signIn.email({
            email: nextEmail,
            password: nextPassword,
            callbackURL: redirectTo,
        });
        setPending(false);

        if (result.error) {
            setError(result.error.message ?? 'Sign in failed');
            return;
        }
        router.push(redirectTo);
        router.refresh();
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submitCredentials(email, password);
    }

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {AUTH_SIGN_IN.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{AUTH_SIGN_IN.subtitle}</p>
            </div>

            {isDev ? (
                <div className="grid gap-2 rounded-xl border border-line bg-raised/40 p-3">
                    <p className="font-mono text-[10px] tracking-widest text-fg-faint uppercase">
                        Demo accounts
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {DEMO_ACCOUNTS.map(account => (
                            <Button
                                key={account.persona}
                                type="button"
                                variant="secondary"
                                size="sm"
                                disabled={pending}
                                className="rounded-full font-mono text-[10px] tracking-wide uppercase"
                                onClick={() => {
                                    setEmail(account.email);
                                    setPassword(DEMO_PASSWORD);
                                    void submitCredentials(account.email, DEMO_PASSWORD);
                                }}>
                                {account.label}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-fg-muted">
                        Password for all: <code className="text-fg">{DEMO_PASSWORD}</code>
                    </p>
                </div>
            ) : null}

            <form className="grid gap-4" onSubmit={onSubmit}>
                <Field label="Email" htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </Field>
                <Field label="Password" htmlFor="password">
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        minLength={12}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                    />
                </Field>
                {error ? <p className="text-sm text-danger">{error}</p> : null}
                <Button type="submit" className="mt-1 w-full" disabled={pending}>
                    {pending ? 'Working…' : 'Sign in'}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-line" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-bg px-3 text-xs text-fg-faint">or</span>
                </div>
            </div>

            <p className="text-center text-sm text-fg-muted">
                No account yet?{' '}
                <Link href="/sign-up" className="font-semibold text-accent hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    );
}

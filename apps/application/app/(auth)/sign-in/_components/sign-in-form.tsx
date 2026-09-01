'use client';

import { useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Field, Input } from '@rumbelo/ui';

import { signIn } from '@/app/_lib/auth';

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');

    const result = await signIn.email({ email, password, callbackURL: '/' });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? 'Sign in failed');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-fg-muted mb-2">
          ✦ Rumbelo
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Welcome back</h1>
        <p className="mt-1 text-sm text-fg-muted">Sign in to keep steering.</p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
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
            placeholder="••••••••••••"
          />
        </Field>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full mt-1" disabled={pending}>
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

      <p className="text-sm text-center text-fg-muted">
        No account yet?{' '}
        <Link href="/sign-up" className="font-semibold text-accent hover:underline">
          Start splitting
        </Link>
      </p>
    </div>
  );
}

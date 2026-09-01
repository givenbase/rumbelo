'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { signUp } from '@/app/_lib/auth';
import { Button, Field, Input } from '@rumbelo/ui';

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');

    const result = await signUp.email({ name, email, password, callbackURL: '/' });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? 'Registration failed');
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
        <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Start splitting</h1>
        <p className="mt-1 text-sm text-fg-muted">Create an account and set up your household.</p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required placeholder="Your name" />
        </Field>
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
            autoComplete="new-password"
            required
            minLength={12}
            placeholder="At least 12 characters"
          />
        </Field>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full mt-1" disabled={pending}>
          {pending ? 'Working…' : 'Create account'}
        </Button>
      </form>

      <p className="text-sm text-center text-fg-muted">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

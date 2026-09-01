'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { signIn } from '@/app/_lib/auth';
import { Button, Field, Input } from '@rumbelo/ui';

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
      setError(result.error.message ?? 'Inloggen mislukt');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-muted mb-2">
          ✦ Rumbelo
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Welkom terug</h1>
        <p className="mt-1 text-sm text-fg-muted">Log in om verder te sturen.</p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field label="E-mailadres" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="jij@voorbeeld.nl"
          />
        </Field>
        <Field label="Wachtwoord" htmlFor="password">
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
          {pending ? 'Bezig…' : 'Inloggen'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-bg px-3 text-[11px] text-fg-faint">of</span>
        </div>
      </div>

      <p className="text-sm text-center text-fg-muted">
        Nog geen account?{' '}
        <Link href="/sign-up" className="font-semibold text-accent hover:underline">
          Begin met verdelen
        </Link>
      </p>
    </div>
  );
}

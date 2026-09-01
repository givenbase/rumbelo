'use client';

import { useState } from 'react';

import { ASSURANCES } from '@/lib/landing-content';

import { LandingIcon } from './landing-icon';

type FieldKey = 'name' | 'email' | 'pass';

const FIELDS: { key: FieldKey; label: string; type: string; ph: string }[] = [
  { key: 'name', label: 'Your name', type: 'text', ph: 'Given Loyiso' },
  { key: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
  { key: 'pass', label: 'Password', type: 'password', ph: 'at least 8 characters' },
];

export function LandingSignupForm() {
  const [vals, setVals] = useState<Record<FieldKey, string>>({ name: '', email: '', pass: '' });
  const [terms, setTerms] = useState(false);
  const [note, setNote] = useState('');
  const [noteOk, setNoteOk] = useState(false);

  const valid =
    /\S+@\S+\.\S+/.test(vals.email) &&
    vals.pass.length >= 8 &&
    vals.name.trim() &&
    terms;

  const submit = () => {
    if (!valid) {
      setNoteOk(false);
      if (!vals.name.trim()) setNote('Tell us your name first.');
      else if (!/\S+@\S+\.\S+/.test(vals.email)) setNote('That email does not look right.');
      else if (vals.pass.length < 8) setNote('Use at least 8 characters.');
      else setNote('Please agree to the terms.');
      return;
    }
    setNoteOk(true);
    setNote('Account created — this is a prototype. Better Auth would sign you in here.');
  };

  const googleIn = () => {
    setNoteOk(true);
    setNote('Google sign-in would open here — this is a prototype.');
  };

  const hasError = (key: FieldKey) => note && !noteOk && !String(vals[key]).trim();

  return (
    <section id="signup" className="mx-auto max-w-6xl px-4 lg:px-6 py-10 lg:py-20 pb-12 lg:pb-24">
      <div
        className="overflow-hidden rounded-3xl border bg-surface"
        style={{
          borderColor: 'rgb(67 56 202 / 0.34)',
          boxShadow: 'var(--shadow-lg), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
        }}
      >
        <span className="block h-1" style={{ background: 'var(--gradient-accent)' }} />

        <div className="flex flex-wrap gap-7 lg:gap-14 p-6 lg:p-10">
          {/* Left: assurances */}
          <div className="min-w-0 min-w-0 flex-1 basis-80">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
              ✦ CREATE YOUR ACCOUNT
            </span>
            <h2 className="mb-3.5 mt-3.5 max-w-sm font-display text-3xl lg:text-4xl font-semibold tracking-tight">
              Six jars, five minutes.
            </h2>
            <p className="mb-5 max-w-prose text-base leading-relaxed text-fg-muted">
              You will be asked one thing: what lands in your account each month. Rumbelo does the
              splitting from there.
            </p>
            <div className="grid gap-3">
              {ASSURANCES.map((a) => (
                <span key={a.t} className="flex min-w-0 items-start gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft">
                    <LandingIcon name={a.icon} size={17} color="var(--color-accent)" />
                  </span>
                  <span className="pt-1 text-sm leading-relaxed text-fg-secondary">
                    {a.t}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="min-w-0 max-w-md min-w-0 flex-1 basis-80">
            <button
              type="button"
              onClick={googleIn}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-raised px-0 py-3.5 text-sm font-medium text-fg transition-colors hover:border-accent"
            >
              <span className="font-mono text-sm font-bold text-accent">G</span>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-fg-faint">
                OR WITH EMAIL
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="grid gap-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="grid gap-1.5">
                  <span className="font-mono text-xs font-medium uppercase tracking-wide text-fg-faint">
                    {f.label}
                  </span>
                  <input
                    type={f.type}
                    value={vals[f.key]}
                    onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full rounded-lg border bg-raised px-3.5 py-3 text-sm text-fg outline-none transition-colors focus:border-accent"
                    style={{ borderColor: hasError(f.key) ? 'var(--color-danger)' : 'var(--color-line)' }}
                  />
                </label>
              ))}

              <label
                className="mt-1 flex cursor-pointer items-start gap-2.5"
                onClick={() => setTerms((t) => !t)}
              >
                <span
                  className="mt-px grid size-4 shrink-0 place-items-center rounded-sm border text-xs text-on-accent"
                  style={{
                    background: terms ? 'var(--gradient-accent)' : 'transparent',
                    borderColor: terms ? 'transparent' : 'var(--color-line-strong)',
                  }}
                >
                  {terms ? '✓' : ''}
                </span>
                <span className="text-sm leading-relaxed text-fg-muted">
                  I agree to the terms and privacy policy. Rumbelo has read-only access to bank
                  data, and only after I connect it myself.
                </span>
              </label>

              <button
                type="button"
                onClick={submit}
                className="font-mono mt-1.5 w-full cursor-pointer rounded-full border-0 py-4 text-xs font-bold uppercase tracking-wide text-on-accent transition-all hover:brightness-105 active:scale-95"
                style={{ background: 'var(--gradient-accent)' }}
              >
                Create my free account
              </button>

              {note && (
                <span
                  className="font-mono text-xs font-medium leading-relaxed tracking-normal"
                  style={{ color: noteOk ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  {note}
                </span>
              )}

              <span className="font-mono text-center text-xs font-medium tracking-wide text-fg-faint">
                Already have an account?{' '}
                <a href="/sign-in" className="text-accent hover:text-accent-hover">
                  Sign in
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

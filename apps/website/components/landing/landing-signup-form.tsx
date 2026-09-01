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
    <section id="signup" className="mx-auto max-w-[1180px] px-[clamp(14px,3vw,22px)] py-[clamp(36px,6vw,88px)] pb-[clamp(48px,8vw,100px)]">
      <div
        className="overflow-hidden rounded-[24px] border bg-surface"
        style={{
          borderColor: 'rgb(67 56 202 / 0.34)',
          boxShadow: 'var(--shadow-lg), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
        }}
      >
        <span className="block h-[3px]" style={{ background: 'var(--gradient-accent)' }} />

        <div className="flex flex-wrap gap-[clamp(28px,4vw,56px)] p-[clamp(26px,4vw,44px)]">
          {/* Left: assurances */}
          <div className="min-w-0 flex-[1_1_320px]">
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent">
              ✦ CREATE YOUR ACCOUNT
            </span>
            <h2 className="mb-[14px] mt-[14px] max-w-[20ch] font-display text-[clamp(26px,3.4vw,36px)] font-semibold tracking-tight">
              Six jars, five minutes.
            </h2>
            <p className="mb-[22px] max-w-[44ch] text-[15px] leading-[1.65] text-fg-muted">
              You will be asked one thing: what lands in your account each month. Rumbelo does the
              splitting from there.
            </p>
            <div className="grid gap-3">
              {ASSURANCES.map((a) => (
                <span key={a.t} className="flex min-w-0 items-start gap-[11px]">
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-accent-soft">
                    <LandingIcon name={a.icon} size={17} color="var(--color-accent)" />
                  </span>
                  <span className="pt-[5px] text-[13.5px] leading-[1.55] text-fg-secondary">
                    {a.t}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="min-w-0 max-w-[420px] flex-[1_1_320px]">
            <button
              type="button"
              onClick={googleIn}
              className="flex w-full cursor-pointer items-center justify-center gap-[11px] rounded-[12px] border border-line-strong bg-raised px-0 py-[14px] text-[14px] font-medium text-fg transition-colors hover:border-accent"
            >
              <span className="font-mono text-[14px] font-bold text-accent">G</span>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-fg-faint">
                OR WITH EMAIL
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="grid gap-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="grid gap-[6px]">
                  <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-fg-faint">
                    {f.label}
                  </span>
                  <input
                    type={f.type}
                    value={vals[f.key]}
                    onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full rounded-[11px] border bg-raised px-[14px] py-[13px] text-[14.5px] text-fg outline-none transition-colors focus:border-accent"
                    style={{ borderColor: hasError(f.key) ? 'var(--color-danger)' : 'var(--color-line)' }}
                  />
                </label>
              ))}

              <label
                className="mt-1 flex cursor-pointer items-start gap-[10px]"
                onClick={() => setTerms((t) => !t)}
              >
                <span
                  className="mt-[1px] grid size-[18px] shrink-0 place-items-center rounded-[5px] border text-[11px] text-on-accent"
                  style={{
                    background: terms ? 'var(--gradient-accent)' : 'transparent',
                    borderColor: terms ? 'transparent' : 'var(--color-line-strong)',
                  }}
                >
                  {terms ? '✓' : ''}
                </span>
                <span className="text-[12.5px] leading-[1.55] text-fg-muted">
                  I agree to the terms and privacy policy. Rumbelo has read-only access to bank
                  data, and only after I connect it myself.
                </span>
              </label>

              <button
                type="button"
                onClick={submit}
                className="font-mono mt-[6px] w-full cursor-pointer rounded-full border-0 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-on-accent transition-[filter] hover:brightness-105 active:scale-[0.985]"
                style={{ background: 'var(--gradient-accent)' }}
              >
                Create my free account
              </button>

              {note && (
                <span
                  className="font-mono text-[11px] font-medium leading-relaxed tracking-[0.04em]"
                  style={{ color: noteOk ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  {note}
                </span>
              )}

              <span className="font-mono text-center text-[10px] font-medium tracking-[0.05em] text-fg-faint">
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

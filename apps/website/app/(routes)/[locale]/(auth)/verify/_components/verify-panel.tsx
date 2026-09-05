'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@rumbelo/ui';
import { AUTH_VERIFY } from '@rumbelo/i18n';

import { sendVerificationEmail } from '@/lib/auth';
import { appSignInUrl } from '@/lib/portal-urls';

const RESEND_COOLDOWN_SEC = 60;

function withEmail(template: string, email: string): string {
    return template.replaceAll('{email}', email);
}

export function VerifyPanel() {
    const searchParams = useSearchParams();
    const email = useMemo(() => searchParams.get('email')?.trim() ?? '', [searchParams]);
    const status = searchParams.get('status');
    const confirmed = status === 'confirmed' || status === 'ok';

    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = window.setTimeout(() => setCooldown(left => left - 1), 1000);
        return () => window.clearTimeout(id);
    }, [cooldown]);

    async function onResend() {
        if (!email || pending || cooldown > 0) return;
        setPending(true);
        setError(null);
        const result = await sendVerificationEmail({
            email,
            callbackURL: '/verify?status=confirmed',
        });
        setPending(false);

        if (result.error) {
            setError(result.error.message ?? 'Could not resend');
            return;
        }

        setSent(true);
        setCooldown(RESEND_COOLDOWN_SEC);
    }

    const subtitle = confirmed
        ? AUTH_VERIFY.confirmed
        : email
          ? withEmail(AUTH_VERIFY.subtitle, email)
          : AUTH_VERIFY.subtitle_no_target;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {confirmed ? AUTH_VERIFY.confirmed_title : AUTH_VERIFY.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
            </div>

            {sent ? <p className="text-sm text-fg-secondary">{AUTH_VERIFY.sent}</p> : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
                {confirmed ? null : (
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={!email || pending || cooldown > 0}
                        onClick={() => void onResend()}>
                        {cooldown > 0
                            ? AUTH_VERIFY.resend_in.replaceAll('{seconds}', String(cooldown))
                            : AUTH_VERIFY.resend}
                    </Button>
                )}
                <Button as="a" href={appSignInUrl(confirmed ? { verified: '1' } : undefined)}>
                    {AUTH_VERIFY.continue}
                </Button>
            </div>

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

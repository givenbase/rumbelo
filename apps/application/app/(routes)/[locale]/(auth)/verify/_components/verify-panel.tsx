'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@rumbelo/ui';

import { sendVerificationEmail } from '@/app/_lib/auth';
import { AUTH_VERIFY } from '@rumbelo/i18n';

const RESEND_COOLDOWN_SEC = 60;

function withEmail(template: string, email: string): string {
    return template.replaceAll('{email}', email);
}

/**
 * Pending verification gate — email today; phone / other channels later.
 * Query: `?email=` (optional) so resend knows the target.
 */
export function VerifyPanel() {
    const searchParams = useSearchParams();
    const email = useMemo(() => searchParams.get('email')?.trim() ?? '', [searchParams]);

    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    async function onResend() {
        if (!email || pending || cooldown > 0) return;
        setPending(true);
        setError(null);
        const result = await sendVerificationEmail({
            email,
            callbackURL: '/',
        });
        setPending(false);

        if (result.error) {
            setError(result.error.message ?? 'Could not resend');
            return;
        }

        setSent(true);
        setCooldown(RESEND_COOLDOWN_SEC);
        const started = Date.now();
        const tick = window.setInterval(() => {
            const left = RESEND_COOLDOWN_SEC - Math.floor((Date.now() - started) / 1000);
            if (left <= 0) {
                window.clearInterval(tick);
                setCooldown(0);
                return;
            }
            setCooldown(left);
        }, 250);
    }

    const subtitle = email
        ? withEmail(AUTH_VERIFY.subtitle, email)
        : AUTH_VERIFY.subtitle_no_target;

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {AUTH_VERIFY.title}
                </h1>
                <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
            </div>

            {sent ? <p className="text-sm text-fg-secondary">{AUTH_VERIFY.sent}</p> : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={!email || pending || cooldown > 0}
                    onClick={() => void onResend()}>
                    {cooldown > 0
                        ? AUTH_VERIFY.resend_in.replaceAll('{seconds}', String(cooldown))
                        : AUTH_VERIFY.resend}
                </Button>
                <Button as={Link} href="/">
                    {AUTH_VERIFY.continue}
                </Button>
            </div>

            <p className="text-center text-sm text-fg-muted">
                <Link href="/sign-in" className="font-semibold text-accent hover:underline">
                    {AUTH_VERIFY.back_to_sign_in}
                </Link>
            </p>
        </div>
    );
}

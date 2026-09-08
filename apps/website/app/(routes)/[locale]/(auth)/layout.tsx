import Link from 'next/link';

import { RumbeloLogo } from '@rumbelo/brand';
import { BRAND_TAGLINE } from '@rumbelo/i18n';
import { ThemeToggle } from '@rumbelo/ui';

import { AuthAside } from './_components/auth-aside';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative grid min-h-dvh lg:grid-cols-2">
            <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
                <ThemeToggle className="size-8 rounded-full bg-transparent text-sm text-fg-muted hover:border-accent hover:bg-transparent hover:text-accent" />
            </div>

            <div
                className="flex flex-col items-center justify-center px-6 py-12 sm:px-10"
                style={{ background: 'var(--gradient-page)' }}>
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-10 inline-grid gap-1.5">
                        <RumbeloLogo variant="wordmark" className="h-8 w-auto max-w-[11rem]" />
                        <span className="text-xs text-fg-muted">{BRAND_TAGLINE}</span>
                    </Link>
                    {children}
                </div>
            </div>

            <AuthAside />
        </div>
    );
}

import Link from 'next/link';

import { BRAND_TAGLINE } from '@/app/_lib/brand-quotes';

import { AuthAside } from './_components/auth-aside';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-10 flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent font-display text-sm font-semibold text-on-accent">
                            R
                        </span>
                        <span className="min-w-0">
                            <span className="block font-display text-lg font-semibold tracking-tight">
                                Rumbelo
                            </span>
                            <span className="mt-0.5 block text-xs text-fg-muted">{BRAND_TAGLINE}</span>
                        </span>
                    </Link>
                    {children}
                </div>
            </div>

            <AuthAside />
        </div>
    );
}

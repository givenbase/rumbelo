'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';

import { BRAND_TAGLINE } from '@rumtelo/i18n';
import { RumteloLogo } from '@rumtelo/brand';
import { ThemeToggle } from '@rumtelo/ui';

import { appSignInUrl, webSignUpPath } from '@/lib/portal-urls';

import { Cta } from './landing-primitives';

const NAV_LINKS = [
    { href: '#portals', label: 'The portals' },
    { href: '#loop', label: 'The loop' },
    { href: '#coach', label: 'The Coach' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'Questions' },
] as const;

export function LandingHeader() {
    const [open, setOpen] = useState(false);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const onChange = () => {
            if (mq.matches) setOpen(false);
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const close = () => setOpen(false);

    return (
        <header className="sticky top-0 z-20 border-b border-line bg-chrome backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-3 px-4 py-3 lg:gap-5 lg:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
                    <Link href="/" className="flex min-w-0 items-center gap-2">
                        <RumteloLogo variant="wordmark" className="h-7 w-auto max-w-[9.5rem]" />
                    </Link>
                    <span className="hidden font-mono text-xs font-medium tracking-wide whitespace-nowrap text-fg-faint sm:inline">
                        {BRAND_TAGLINE}
                    </span>
                </div>

                <nav className="ml-auto hidden items-center gap-5 lg:flex">
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-fg-muted transition-colors hover:text-accent">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <ThemeToggle className="size-8 rounded-full bg-transparent text-sm text-fg-muted hover:border-accent hover:bg-transparent hover:text-accent" />

                    <a
                        href={appSignInUrl()}
                        className="hidden text-sm text-fg-muted transition-colors hover:text-accent md:inline">
                        Sign in
                    </a>

                    <Cta href={webSignUpPath()} className="hidden sm:inline-flex">
                        Start free
                    </Cta>

                    <button
                        type="button"
                        className="grid size-9 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
                        aria-expanded={open}
                        aria-controls={menuId}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen(previous => !previous)}>
                        <span className="relative block size-4" aria-hidden>
                            <span
                                className={`absolute inset-x-0 top-0.5 h-0.5 rounded-full bg-current transition-transform ${
                                    open ? 'translate-y-1.5 rotate-45' : ''
                                }`}
                            />
                            <span
                                className={`absolute inset-x-0 top-[7px] h-0.5 rounded-full bg-current transition-opacity ${
                                    open ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`absolute inset-x-0 top-[13px] h-0.5 rounded-full bg-current transition-transform ${
                                    open ? '-translate-y-1.5 -rotate-45' : ''
                                }`}
                            />
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                id={menuId}
                className={`border-t border-line bg-chrome lg:hidden ${open ? 'block' : 'hidden'}`}>
                <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={close}
                            className="rounded-lg px-3 py-3 text-base text-fg-muted transition-colors hover:bg-raised hover:text-accent">
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={appSignInUrl()}
                        onClick={close}
                        className="rounded-lg px-3 py-3 text-base text-fg-muted transition-colors hover:bg-raised hover:text-accent">
                        Sign in
                    </a>
                    <Cta
                        href={webSignUpPath()}
                        size="lg"
                        onClick={close}
                        className="mt-2 sm:hidden">
                        Start free — no card
                    </Cta>
                </nav>
            </div>
        </header>
    );
}

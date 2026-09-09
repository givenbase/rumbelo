'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';

import { RumteloLogo } from '@rumtelo/brand';
import { ThemeToggle } from '@rumtelo/ui';

import { appSignInUrl, webSignUpPath } from '@/lib/portal-urls';

import { Cta } from './landing-primitives';

const NAV_LINKS = [
    { href: '#loop', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
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
            <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-4 px-4 py-3 lg:px-6">
                <Link href="/" className="min-w-0 shrink-0">
                    <RumteloLogo variant="wordmark" className="h-7 w-auto max-w-[9.5rem]" />
                </Link>

                <nav className="ml-auto hidden items-center gap-6 lg:flex">
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-fg-muted transition-colors hover:text-accent">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:ml-2">
                    <ThemeToggle className="size-8 rounded-full bg-transparent text-sm text-fg-muted hover:border-accent hover:bg-transparent hover:text-accent" />

                    <Cta href={appSignInUrl()} variant="ghost" className="hidden sm:inline-flex">
                        Sign in
                    </Cta>

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
                    <div className="mt-2 flex flex-col gap-2 sm:hidden">
                        <Cta href={appSignInUrl()} variant="ghost" size="lg" onClick={close}>
                            Sign in
                        </Cta>
                        <Cta href={webSignUpPath()} size="lg" onClick={close}>
                            Start free — no card
                        </Cta>
                    </div>
                </nav>
            </div>
        </header>
    );
}

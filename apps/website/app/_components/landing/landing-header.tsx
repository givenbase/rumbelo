'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';

import { RumteloLogo } from '@rumtelo/brand';
import { ThemeToggle } from '@rumtelo/ui';

import { appSignInUrl, webSignUpPath } from '@/lib/portal-urls';

import { Cta } from './landing-primitives';

const NAV_LINKS = [
    { href: '#portals', label: 'Portals' },
    { href: '#loop', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'Questions' },
    { href: '#signup', label: 'Create account' },
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
        <header className="sticky top-0 z-20 border-b border-line bg-chrome/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl min-w-0 items-center gap-3 px-4 py-3 sm:gap-4 lg:px-6">
                <Link href="/" className="min-w-0 shrink" onClick={close}>
                    <RumteloLogo
                        variant="wordmark"
                        className="h-6 w-auto max-w-34 sm:h-7 sm:max-w-38"
                    />
                </Link>

                <nav
                    aria-label="Primary"
                    className="ml-auto hidden items-center gap-5 lg:flex xl:gap-6">
                    {NAV_LINKS.filter(link => link.href !== '#signup').map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm whitespace-nowrap text-fg-muted transition-colors hover:text-accent">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-4">
                    <ThemeToggle className="size-9 shrink-0 rounded-full bg-transparent text-sm text-fg-muted hover:border-accent hover:bg-transparent hover:text-accent sm:size-8" />

                    <Cta
                        href={appSignInUrl()}
                        variant="ghost"
                        className="hidden whitespace-nowrap sm:inline-flex">
                        Sign in
                    </Cta>

                    <Cta href={webSignUpPath()} className="hidden whitespace-nowrap sm:inline-flex">
                        Start free
                    </Cta>

                    <button
                        type="button"
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
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
                                className={`absolute inset-x-0 top-1.75 h-0.5 rounded-full bg-current transition-opacity ${
                                    open ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`absolute inset-x-0 top-3.25 h-0.5 rounded-full bg-current transition-transform ${
                                    open ? '-translate-y-1.5 -rotate-45' : ''
                                }`}
                            />
                        </span>
                    </button>
                </div>
            </div>

            <div id={menuId} hidden={!open} className="border-t border-line bg-chrome lg:hidden">
                <nav
                    aria-label="Mobile"
                    className="mx-auto flex w-full max-w-6xl flex-col gap-0.5 px-4 py-3 pb-5">
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={close}
                            className="rounded-lg px-3 py-3.5 text-base text-fg-muted transition-colors hover:bg-raised hover:text-accent">
                            {link.label}
                        </Link>
                    ))}
                    <div className="mt-3 grid gap-2 border-t border-line pt-4 sm:hidden">
                        <Cta
                            href={appSignInUrl()}
                            variant="ghost"
                            size="lg"
                            className="w-full"
                            onClick={close}>
                            Sign in
                        </Cta>
                        <Cta href={webSignUpPath()} size="lg" className="w-full" onClick={close}>
                            Start free — no card
                        </Cta>
                    </div>
                </nav>
            </div>
        </header>
    );
}

'use client';

import { useEffect, useId, useState } from 'react';

import { BRAND_TAGLINE } from '@rumbelo/i18n';
import { appSignUpUrl } from '@/lib/portal-urls';

import { LandingThemeToggle } from './landing-theme-toggle';

const NAV_LINKS = [
    { href: '#pillars', label: 'The portals' },
    { href: '#jars', label: 'The jars' },
    { href: '#how', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
] as const;

export function LandingHeader() {
    const [open, setOpen] = useState(false);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
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
        <header
            className="sticky top-0 z-20 border-b border-line backdrop-blur-md"
            style={{ background: 'var(--color-chrome)' }}>
            <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-3 px-4 py-3 lg:gap-5 lg:px-6">
                <div className="flex min-w-0 flex-1 items-baseline gap-2 lg:flex-none">
                    <a
                        href="#"
                        className="font-display text-xl font-bold tracking-tight"
                        onClick={close}>
                        Rumbelo
                    </a>
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
                    <LandingThemeToggle />

                    <a
                        href={appSignUpUrl()}
                        className="hidden rounded-full px-5 py-2.5 font-mono text-xs font-semibold tracking-wide text-on-accent uppercase transition-all hover:brightness-105 active:scale-95 sm:inline-flex"
                        style={{ background: 'var(--gradient-accent)' }}>
                        Start free
                    </a>

                    <button
                        type="button"
                        className="grid size-9 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
                        aria-expanded={open}
                        aria-controls={menuId}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen(v => !v)}>
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
                className={`border-t border-line lg:hidden ${open ? 'block' : 'hidden'}`}
                style={{ background: 'var(--color-chrome)' }}>
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
                        href={appSignUpUrl()}
                        onClick={close}
                        className="mt-2 rounded-full px-5 py-3.5 text-center font-mono text-xs font-semibold tracking-wide text-on-accent uppercase transition-all hover:brightness-105 active:scale-95 sm:hidden"
                        style={{ background: 'var(--gradient-accent)' }}>
                        Start free
                    </a>
                </nav>
            </div>
        </header>
    );
}

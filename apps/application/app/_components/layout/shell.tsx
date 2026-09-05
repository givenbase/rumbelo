'use client';

import { useState, type ReactNode } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { BRAND_TAGLINE } from '@rumbelo/i18n';
import { cn } from '@rumbelo/utils';
import { Locale } from '@rumbelo/contracts';

import { signOut } from '@/app/_lib/auth';
import { BOTTOM_TABS, NAV_GROUPS, TOP_PILL_LABELS } from '@/app/_lib/nav';
import { isScreenLocked, SCREEN_MIN } from '@/app/_lib/plan';
import { settingsHrefForNavGroup } from '@/app/_lib/settings-tabs';
import { whyLineFor } from '@/app/_lib/why-lines';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { LockedGate } from '@/components/features/shell/locked-gate';
import { OnboardingOverlay } from '@/components/features/shell/onboarding-overlay';

import { PeriodSelector } from './period-selector';
import { PeriodTravelBanner } from './period-travel-banner';
import { QuickAddFab } from './quick-add';
import { ThemeToggle } from './theme-toggle';
import { ToastPill } from './toast';
// ── Menu items ───────────────────────────────────────────────────────────────

interface MenuItem {
    label: string;
    sub: string;
    href: string | null;
    danger: boolean;
    onboardingTrigger?: true;
}

const MENU_ITEMS: MenuItem[] = [
    { label: 'Settings', sub: 'Jars, rules, automatic split', href: '/settings', danger: false },
    { label: 'My plan', sub: 'Manage your subscription', href: '/settings/plan', danger: false },
    {
        label: 'Reset setup',
        sub: 'Run through the first setup again',
        href: null,
        danger: false,
        onboardingTrigger: true,
    },
    { label: 'Help & info', sub: 'What does each number mean?', href: null, danger: false },
    { label: 'Sign out', sub: 'You stay signed in for 30 days', href: null, danger: true },
];

// ── Subnav tint — each group borrows a jar hue (design: TINTS) ───────────────

const SUBNAV_TINT: Record<string, string> = {
    home: 'border-t-jar-ff',
    money: 'border-t-jar-give',
    growth: 'border-t-jar-lts',
    energy: 'border-t-jar-play',
    soul: 'border-t-portal-soul',
};

// ── Public export ─────────────────────────────────────────────────────────────

/**
 * Top-level shell — wraps every authenticated page.
 * `AppShellProvider` lives in `app/providers.tsx`; this component consumes it.
 */
export function AppShell({ children }: { children: ReactNode }) {
    return <AppShellInner>{children}</AppShellInner>;
}

// ── Also re-export useAppShell so consumers don't need two imports ────────────
export { useAppShell } from '@/components/features/shell/app-shell-context';

// ── Inner shell (has access to context) ──────────────────────────────────────

function AppShellInner({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const { plan, resetOnboardingFlow, toggleLocale, locale } = useAppShell();
    const { session } = useAuth();

    const userName = session?.user?.name?.trim() || 'Guest';
    const userEmail = session?.user?.email ?? '';
    const userInitials = (() => {
        const parts = userName.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
            return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
        }
        if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
        return (userEmail.slice(0, 2) || '?').toUpperCase();
    })();

    async function handleSignOut() {
        setSigningOut(true);
        setMenuOpen(false);
        try {
            await signOut();
            router.replace('/sign-in');
        } catch {
            setSigningOut(false);
        }
    }

    const activeGroup =
        NAV_GROUPS.find(g =>
            g.children.some(c =>
                c.href === '/'
                    ? pathname === '/'
                    : pathname === c.href || pathname.startsWith(`${c.href}/`)
            )
        ) ?? null;

    const why = whyLineFor(pathname);

    // Plan-gate: check if the current screen is locked for the active plan.
    const activeChild = activeGroup?.children.find(
        c => c.href === pathname || pathname.startsWith(c.href + '/')
    );
    const screenIsLocked = isScreenLocked(activeChild?.screenKey ?? null, plan);
    const requiredPlan = activeChild?.screenKey ? SCREEN_MIN[activeChild.screenKey] : undefined;

    return (
        <div className="min-h-dvh bg-bg bg-(image:--gradient-page) bg-top bg-no-repeat">
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-chrome backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
                    {/* Wordmark */}
                    <Link href="/" className="flex shrink-0 items-baseline gap-2.5">
                        <span className="font-display text-lg font-semibold tracking-tight text-fg">
                            Rumbelo
                        </span>
                        <span className="hidden font-mono text-xs font-medium tracking-wide text-fg-faint xl:inline">
                            {BRAND_TAGLINE}
                        </span>
                    </Link>

                    {/* Portal pill bar (desktop) */}
                    <nav
                        className="hidden flex-1 justify-center md:flex"
                        aria-label="Main navigation">
                        <div className="flex items-center gap-0.5 rounded-full border border-line bg-sunken p-1 shadow-md">
                            {NAV_GROUPS.map(g => {
                                const active = g === activeGroup;
                                return (
                                    <Link
                                        key={g.key}
                                        href={g.href}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs font-semibold tracking-widest uppercase transition-colors',
                                            active
                                                ? 'bg-accent text-on-accent'
                                                : 'text-fg-secondary hover:text-accent'
                                        )}>
                                        <span aria-hidden>{g.icon}</span>
                                        {TOP_PILL_LABELS[g.key] ?? g.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Right side: lang toggle, theme + avatar */}
                    <div className="relative ml-auto flex items-center gap-2 md:ml-0">
                        {/* Lang toggle */}
                        <button
                            type="button"
                            onClick={toggleLocale}
                            title={locale === Locale.NL ? 'Switch to English' : 'Switch to Dutch'}
                            className="flex h-8 items-center rounded-full border border-line px-2.5 font-mono text-xs font-semibold tracking-wide text-fg-muted uppercase transition-colors hover:border-accent-hover hover:text-accent sm:px-3">
                            {locale === Locale.NL ? 'NL' : 'EN'}
                        </button>

                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={() => setMenuOpen(v => !v)}
                            aria-label="User menu"
                            aria-expanded={menuOpen}
                            className="grid size-9 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-on-accent transition hover:brightness-110 active:scale-95">
                            {userInitials}
                        </button>

                        {menuOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close menu"
                                    onClick={() => setMenuOpen(false)}
                                    className="fixed inset-0 z-30 cursor-default"
                                />
                                <div className="absolute top-11 right-0 z-40 w-[min(18rem,calc(100vw-2rem))] animate-rise overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-xl">
                                    {/* User row */}
                                    <div className="flex items-center gap-3 border-b border-line px-4.5 py-4">
                                        <div className="grid size-9.5 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-on-accent">
                                            {userInitials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-fg">
                                                {userName}
                                            </p>
                                            <p className="truncate font-mono text-xs text-fg-faint">
                                                {userEmail || '—'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-0.5 p-2">
                                        {MENU_ITEMS.map(item => {
                                            const isOnboarding = item.onboardingTrigger === true;

                                            const inner = (
                                                <>
                                                    <span
                                                        className={cn(
                                                            'text-sm',
                                                            item.danger ? 'text-danger' : 'text-fg'
                                                        )}>
                                                        {item.label}
                                                    </span>
                                                    <span className="text-xs leading-tight text-fg-faint">
                                                        {item.sub}
                                                    </span>
                                                </>
                                            );

                                            if (isOnboarding) {
                                                return (
                                                    <button
                                                        key={item.label}
                                                        type="button"
                                                        onClick={() => {
                                                            setMenuOpen(false);
                                                            resetOnboardingFlow();
                                                        }}
                                                        className="grid w-full gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-raised">
                                                        {inner}
                                                    </button>
                                                );
                                            }

                                            if (item.href) {
                                                return (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        onClick={() => setMenuOpen(false)}
                                                        className="grid gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-raised">
                                                        {inner}
                                                    </Link>
                                                );
                                            }

                                            if (item.danger) {
                                                return (
                                                    <button
                                                        key={item.label}
                                                        type="button"
                                                        disabled={signingOut}
                                                        onClick={() => void handleSignOut()}
                                                        className="grid w-full gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-raised">
                                                        {inner}
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="grid w-full gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-raised">
                                                    {inner}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Subnav (portal children) */}
                {activeGroup && (
                    <div className={cn('border-t-2 bg-bg-app', SUBNAV_TINT[activeGroup.key])}>
                        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-2.5">
                            {/* Desktop pill strip */}
                            <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
                                {activeGroup.children.map(c => {
                                    const active =
                                        pathname === c.href || pathname.startsWith(c.href + '/');
                                    const locked = isScreenLocked(c.screenKey, plan);
                                    return (
                                        <Link
                                            key={c.href}
                                            href={c.href}
                                            className={cn(
                                                'rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide uppercase transition-colors',
                                                active
                                                    ? 'border-accent-hover bg-accent-soft text-accent'
                                                    : 'border-line text-fg-muted hover:border-accent-hover hover:text-accent',
                                                locked && !active && 'opacity-55'
                                            )}>
                                            {locked && (
                                                <span aria-hidden className="mr-1 text-xs">
                                                    🔒
                                                </span>
                                            )}
                                            {c.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile dropdown */}
                            <div className="relative min-w-0 sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => setSubOpen(v => !v)}
                                    className="flex max-w-[min(100%,14rem)] items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 font-mono text-xs font-semibold tracking-wide text-fg uppercase">
                                    <span className="truncate">
                                        {activeGroup.children.find(
                                            c =>
                                                pathname === c.href ||
                                                pathname.startsWith(c.href + '/')
                                        )?.label ?? activeGroup.children[0].label}
                                    </span>
                                    <span className="shrink-0 text-xs opacity-70" aria-hidden>
                                        ▾
                                    </span>
                                </button>
                                {subOpen && (
                                    <div className="absolute top-10 left-0 z-40 grid w-[min(16rem,calc(100vw-2rem))] animate-rise gap-0.5 rounded-xl border border-line-strong bg-surface p-1.5 shadow-xl">
                                        {activeGroup.children.map(c => (
                                            <Link
                                                key={c.href}
                                                href={c.href}
                                                onClick={() => setSubOpen(false)}
                                                className="rounded-lg px-3 py-2.5 text-sm text-fg transition-colors hover:bg-raised">
                                                {c.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Period selector + Settings */}
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                <PeriodSelector />
                                <Link
                                    href={settingsHrefForNavGroup(activeGroup?.key)}
                                    className="hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide text-fg-faint uppercase transition-colors hover:border-accent-hover hover:text-accent sm:flex">
                                    <span aria-hidden>◇</span>
                                    Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ── MAIN ─────────────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
                <PeriodTravelBanner />
                {why && (
                    <p className="mb-3.5 max-w-prose font-mono text-xs leading-relaxed font-medium tracking-wide text-fg-faint">
                        ◇ {why}
                    </p>
                )}
                <main className="min-w-0">
                    {screenIsLocked && requiredPlan ? (
                        <LockedGate requiredPlan={requiredPlan} />
                    ) : (
                        children
                    )}
                </main>
            </div>

            {/* ── BOTTOM NAV (mobile) ───────────────────────────────────────── */}
            <nav
                className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-line bg-chrome pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
                aria-label="Mobile navigation">
                {BOTTOM_TABS.map((tab, i) => {
                    const active = NAV_GROUPS[i] === activeGroup;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium',
                                active ? 'text-accent' : 'text-fg-muted'
                            )}>
                            <span aria-hidden className="text-base">
                                {tab.glyph}
                            </span>
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>

            {/* ── OVERLAYS ─────────────────────────────────────────────────── */}
            <QuickAddFab />
            <ToastPill />
            <OnboardingOverlay />
        </div>
    );
}

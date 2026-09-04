'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DEFAULT_JAR_SPLIT, type JarKey } from '@rumbelo/contracts';
import { useLiveQuery } from '@rumbelo/hooks';
import {
    Badge,
    Button,
    DangerZone,
    Field,
    Input,
    Meter,
    Select,
    StubNotice,
    Toggle,
} from '@rumbelo/ui';
import { cn, formatMoney, formatPercent } from '@rumbelo/utils';

import { changePassword, signOut, updateOrganization, updateUser } from '@/app/_lib/auth';
import { downloadTextFile, toCsv } from '@/app/_lib/download';
import { PLAN_LABELS, type PlanKey } from '@/app/_lib/plan';
import { isLiveData } from '@/app/_lib/preview';
import { evaluateSplitCoach, pctByJarKey } from '@/app/_lib/split-coach';
import { JAR_META, mockJars } from '@/app/_mock';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';

import {
    SettingsInkCard,
    SettingsPanel,
    SettingsPill,
    SettingsRow,
    SettingsRowLabel,
} from './settings-chrome';

const JAR_COLOR: Record<string, string> = Object.fromEntries(JAR_META.map(j => [j.key, j.color]));

const CURRENCY_OPTIONS = [
    { code: 'EUR', sampleLocale: 'nl-NL', persist: true as const },
    { code: 'USD', sampleLocale: 'en-US', persist: true as const },
    { code: 'GBP', sampleLocale: 'en-GB', persist: true as const },
    { code: 'CHF', sampleLocale: 'de-CH', persist: false as const },
];

const BANK_OPTIONS = ['ING', 'Rabobank', 'ABN AMRO', 'bunq', 'Revolut', 'N26'] as const;

const AUTO_RULES = [
    {
        key: 'split',
        name: 'Auto-split on income',
        desc: 'Every euro that arrives goes straight into the jars, 55/10/10/10/10/5.',
        defaultOn: true,
    },
    {
        key: 'guard',
        name: 'Jar guard',
        desc: 'Warn as soon as a jar passes 90% of its allocation.',
        defaultOn: true,
    },
    {
        key: 'sweep',
        name: 'Sweep surplus',
        desc: 'Whatever is left in Necessity on the 1st moves to Financial Freedom.',
        defaultOn: true,
    },
    {
        key: 'coach',
        name: 'Coach explanations',
        desc: 'Adds a plain-language explanation with the maths behind each signal.',
        defaultOn: false,
    },
] as const;

function initials(name: string, email: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
    }
    if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
    return (email.slice(0, 2) || '?').toUpperCase();
}

export function AccountSettings() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { session, householdId, refreshSession } = useAuth();
    const { showToast, locale, toggleLocale } = useAppShell();
    const live = isLiveData(householdId);

    const user = session?.user;
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(user?.name ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [signingOut, setSigningOut] = useState(false);

    const membersQuery = useLiveQuery(
        api.household.members.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );
    const settingsQuery = useLiveQuery(
        api.household.settings.queryOptions({ input: { householdId: householdId! } }),
        null,
        live
    );
    const accountSettingsQuery = useLiveQuery(api.account.settings.queryOptions(), null, live);
    const householdQuery = useLiveQuery(
        api.household.current.queryOptions({ input: { householdId: householdId! } }),
        null,
        live
    );

    const currency = settingsQuery.data?.currency ?? householdQuery.data?.currency ?? 'EUR';
    const [currencyDraft, setCurrencyDraft] = useState<string | null>(null);
    const activeCurrency = currencyDraft ?? currency;

    const [dark, setDark] = useState(
        () => typeof window !== 'undefined' && localStorage.getItem('rumbelo-theme') === 'dark'
    );
    const [periodDayDraft, setPeriodDayDraft] = useState<number | null>(null);
    const periodDay = periodDayDraft ?? settingsQuery.data?.periodStartDay ?? 1;

    const saveProfile = useMutation({
        mutationFn: async (nextName: string) => {
            const result = await updateUser({ name: nextName });
            if (result.error) throw new Error(result.error.message ?? 'Profile save failed');
        },
        onSuccess: async () => {
            await refreshSession();
            setEditingName(false);
            showToast('Profile saved', 'success');
        },
        onError: () => showToast('Profile save failed', 'error'),
    });

    const savePassword = useMutation({
        mutationFn: async () => {
            const result = await changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });
            if (result.error) throw new Error(result.error.message ?? 'Password change failed');
        },
        onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            showToast('Password changed', 'success');
        },
        onError: () => showToast('Password change failed', 'error'),
    });

    const invite = useMutation({
        mutationFn: async () => {
            if (!householdId) throw new Error('No household');
            return client.household.invite({
                householdId,
                email: inviteEmail.trim(),
                role: 'MEMBER',
            });
        },
        onSuccess: () => {
            setInviteEmail('');
            void queryClient.invalidateQueries({ queryKey: api.household.members.key() });
            showToast('Invitation sent', 'success');
        },
        onError: () => showToast('Invitation failed', 'error'),
    });

    const saveLocale = useMutation({
        mutationFn: async (next: 'nl' | 'en') => {
            return client.account.updateSettings({ locale: next });
        },
        onSuccess: (_data, next) => {
            if (locale !== next) toggleLocale();
            void queryClient.invalidateQueries({ queryKey: api.account.settings.key() });
            showToast('Language saved', 'success');
        },
        onError: () => showToast('Language save failed', 'error'),
    });

    const saveCurrency = useMutation({
        mutationFn: async (next: 'EUR' | 'USD' | 'GBP') => {
            if (!householdId) throw new Error('No household');
            return client.household.updateSettings({ householdId, currency: next });
        },
        onSuccess: () => {
            setCurrencyDraft(null);
            void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
            void queryClient.invalidateQueries({ queryKey: api.household.current.key() });
            showToast('Currency saved', 'success');
        },
        onError: () => showToast('Currency save failed', 'error'),
    });

    const savePeriod = useMutation({
        mutationFn: async () => {
            if (!householdId) throw new Error('No household');
            return client.household.updateSettings({
                householdId,
                periodStartDay: periodDay,
            });
        },
        onSuccess: () => {
            setPeriodDayDraft(null);
            void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
            showToast('Period saved', 'success');
        },
        onError: () => showToast('Period save failed', 'error'),
    });

    const saveTheme = useMutation({
        mutationFn: async (next: 'light' | 'dark') => {
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('rumbelo-theme', next);
            setDark(next === 'dark');
            return client.account.updateSettings({ theme: next });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.account.settings.key() });
        },
        onError: () => showToast('Theme save failed', 'error'),
    });

    function pickLocale(next: 'en' | 'nl') {
        if (live) saveLocale.mutate(next);
        else if (locale !== next) toggleLocale();
    }

    function pickCurrency(code: string, persist: boolean) {
        if (!persist) {
            showToast('CHF support is coming soon', 'info');
            return;
        }
        setCurrencyDraft(code);
        if (live) saveCurrency.mutate(code as 'EUR' | 'USD' | 'GBP');
    }

    async function handleSignOut() {
        setSigningOut(true);
        try {
            await signOut();
            router.push('/sign-in');
        } catch {
            showToast('Sign out failed', 'error');
            setSigningOut(false);
        }
    }

    const displayName = user?.name?.trim() || 'Guest';
    const displayEmail = user?.email ?? '';
    const activeLang = (accountSettingsQuery.data?.locale ?? locale) as 'en' | 'nl';

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Profile"
                blurb="Your identity in Rumbelo. Sessions run through Better Auth.">
                <SettingsRow>
                    <div className="flex min-w-0 items-center gap-3.5">
                        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-on-accent">
                            {initials(displayName, displayEmail)}
                        </div>
                        {editingName ? (
                            <div className="grid min-w-0 flex-1 gap-1.5">
                                <Input
                                    value={nameDraft}
                                    onChange={e => setNameDraft(e.target.value)}
                                    autoFocus
                                    aria-label="Name"
                                />
                                <p className="truncate font-mono text-[10px] text-fg-muted">
                                    {displayEmail}
                                </p>
                            </div>
                        ) : (
                            <span className="grid min-w-0 gap-px">
                                <span className="truncate text-sm text-fg">{displayName}</span>
                                <span className="truncate font-mono text-[10px] text-fg-muted">
                                    {displayEmail || '—'}
                                </span>
                            </span>
                        )}
                    </div>
                    {editingName ? (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setEditingName(false);
                                    setNameDraft(user?.name ?? '');
                                }}>
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                disabled={
                                    saveProfile.isPending ||
                                    !nameDraft.trim() ||
                                    nameDraft.trim() === (user?.name ?? '')
                                }
                                onClick={() => saveProfile.mutate(nameDraft.trim())}>
                                {saveProfile.isPending ? '…' : 'Save'}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full font-mono text-[10px] tracking-[0.12em] uppercase"
                            onClick={() => {
                                setNameDraft(user?.name ?? '');
                                setEditingName(true);
                            }}>
                            Edit
                        </Button>
                    )}
                </SettingsRow>

                <SettingsRow>
                    <SettingsRowLabel
                        title="Sign-in method"
                        sub="Email, through Better Auth"
                    />
                    <SettingsPill tone="accent">Connected</SettingsPill>
                </SettingsRow>

                <SettingsRow>
                    <SettingsRowLabel
                        title="Two-factor"
                        sub="A code from your phone on every new device"
                    />
                    <SettingsPill tone="neutral">Off</SettingsPill>
                </SettingsRow>

                <SettingsRow>
                    <SettingsRowLabel title="Language" sub="Applies to every screen" />
                    <div className="flex gap-1 rounded-full border border-line bg-raised p-0.5">
                        {(['en', 'nl'] as const).map(code => {
                            const on = activeLang === code;
                            return (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => pickLocale(code)}
                                    className={cn(
                                        'rounded-full px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase transition-colors',
                                        on
                                            ? 'bg-accent text-on-accent'
                                            : 'text-fg-muted hover:text-fg'
                                    )}>
                                    {code}
                                </button>
                            );
                        })}
                    </div>
                </SettingsRow>

                <SettingsRow>
                    <SettingsRowLabel
                        title="Currency"
                        sub="How every amount is written"
                    />
                    <div className="flex flex-wrap justify-end gap-1.5">
                        {CURRENCY_OPTIONS.map(opt => {
                            const on = activeCurrency === opt.code;
                            return (
                                <button
                                    key={opt.code}
                                    type="button"
                                    onClick={() => pickCurrency(opt.code, opt.persist)}
                                    className={cn(
                                        'grid gap-0.5 rounded-[10px] border px-3 py-2 text-left transition-colors',
                                        on
                                            ? 'border-accent bg-accent-soft'
                                            : 'border-line hover:border-accent/50'
                                    )}>
                                    <span
                                        className={cn(
                                            'font-mono text-[10px] font-medium tracking-wide',
                                            on ? 'text-accent' : 'text-fg'
                                        )}>
                                        {opt.code}
                                    </span>
                                    <span className="font-mono text-[10.5px] text-fg-muted">
                                        {formatMoney(430_000, {
                                            currency: opt.code === 'CHF' ? 'CHF' : opt.code,
                                            locale: opt.sampleLocale,
                                        })}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </SettingsRow>

                <SettingsRow last>
                    <SettingsRowLabel
                        title="Sign out"
                        sub="You stay signed in for 30 days on this device"
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full border-danger/40 font-mono text-[10px] tracking-[0.12em] text-danger uppercase hover:border-danger"
                        disabled={signingOut}
                        onClick={() => void handleSignOut()}>
                        {signingOut ? '…' : 'Sign out'}
                    </Button>
                </SettingsRow>
            </SettingsInkCard>

            <SettingsInkCard eyebrow="Password" blurb="Change the password for this email account.">
                <div className="grid gap-3 py-2.5">
                    <Field label="Current password" htmlFor="cur-pw">
                        <Input
                            id="cur-pw"
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                        />
                    </Field>
                    <Field label="New password" htmlFor="new-pw" hint="Minimum 8 characters.">
                        <Input
                            id="new-pw"
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete="new-password"
                        />
                    </Field>
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            disabled={
                                savePassword.isPending ||
                                currentPassword.length < 1 ||
                                newPassword.length < 8
                            }
                            onClick={() => savePassword.mutate()}>
                            {savePassword.isPending ? 'Working…' : 'Change password'}
                        </Button>
                    </div>
                </div>
            </SettingsInkCard>

            <SettingsInkCard
                eyebrow="Household"
                blurb="Members share jars, rules, and transaction history.">
                <div className="grid gap-3 py-2.5">
                    {live && (membersQuery.data?.length ?? 0) > 0 ? (
                        <ul className="divide-y divide-line rounded-lg border border-line">
                            {(membersQuery.data ?? []).map(m => (
                                <li
                                    key={m.id}
                                    className="flex items-center justify-between gap-3 px-3 py-2.5">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-fg">
                                            {m.name}
                                        </p>
                                        <p className="truncate text-xs text-fg-muted">{m.email}</p>
                                    </div>
                                    <Badge>{m.role}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <StubNotice what="Members appear here once you have a household." />
                    )}
                    <Field label="Invite (email)" htmlFor="invite-email">
                        <Input
                            id="invite-email"
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="partner@example.com"
                            disabled={!live}
                        />
                    </Field>
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            disabled={!live || invite.isPending || !inviteEmail.includes('@')}
                            onClick={() => invite.mutate()}>
                            {invite.isPending ? 'Working…' : 'Invite'}
                        </Button>
                    </div>
                </div>
            </SettingsInkCard>

            <SettingsInkCard
                eyebrow="Display"
                blurb="Theme and the day the budget month rolls over.">
                <div className="border-b border-line px-0">
                    <Toggle
                        checked={dark}
                        label="Dark mode"
                        hint="Saved locally and in household settings."
                        onCheckedChange={next => saveTheme.mutate(next ? 'dark' : 'light')}
                    />
                </div>
                <SettingsRow last>
                    <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <Field
                            label="Day the month rolls over"
                            htmlFor="period-day"
                            hint="Income after this day counts for next month.">
                            <Input
                                id="period-day"
                                type="number"
                                min={1}
                                max={28}
                                value={periodDay}
                                onChange={e =>
                                    setPeriodDayDraft(
                                        Math.min(28, Math.max(1, Number(e.target.value) || 1))
                                    )
                                }
                                className="w-28"
                                disabled={!live}
                            />
                        </Field>
                        <Button
                            variant="secondary"
                            disabled={!live || savePeriod.isPending}
                            onClick={() => savePeriod.mutate()}>
                            {savePeriod.isPending ? 'Working…' : 'Save'}
                        </Button>
                    </div>
                </SettingsRow>
            </SettingsInkCard>

            <DangerZone
                title="Delete account"
                body="Your household, jars, and full transaction history will be deleted. This cannot be undone — export your data first."
                action="Delete account"
                onAction={() =>
                    showToast('Account deletion coming soon — export your data first.', 'info')
                }
            />
        </SettingsPanel>
    );
}

export function JarsSettings() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const live = isLiveData(householdId);

    const jarsQuery = useLiveQuery(
        api.money.jars.list.queryOptions({ input: { householdId: householdId! } }),
        mockJars.map(j => ({
            id: j.id,
            householdId: 'mock',
            key: j.key,
            name: j.name,
            subtitle: j.subtitle,
            icon: j.icon,
            percentage: j.percentage,
            spendable: j.spendable,
            sortOrder: 0,
        })) as never,
        live
    );

    const accountsQuery = useLiveQuery(
        api.money.accounts.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const jars = useMemo(() => jarsQuery.data ?? [], [jarsQuery.data]);
    const accounts = accountsQuery.data ?? [];
    const serverPct = useMemo(
        () => Object.fromEntries(jars.map(j => [j.id, j.percentage])),
        [jars]
    );
    const [pctDraft, setPctDraft] = useState<Record<string, number> | null>(null);
    const [dismissedTips, setDismissedTips] = useState<Record<string, true>>({});
    const pct = pctDraft ?? serverPct;

    const total = Object.values(pct).reduce((s, n) => s + n, 0);
    const balanced = Math.abs(total - 100) < 0.01;

    const coachTips = useMemo(() => {
        const tips = evaluateSplitCoach(pctByJarKey(jars, pct), 'unknown');
        return tips.filter(t => !dismissedTips[t.id]);
    }, [jars, pct, dismissedTips]);

    const incomeQuery = useLiveQuery(
        api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );
    const monthlyNet = useMemo(() => {
        if (!live) {
            return mockJars.reduce((s, j) => s + j.allocated, 0);
        }
        return (incomeQuery.data ?? []).filter(s => s.active).reduce((sum, s) => sum + s.amount, 0);
    }, [live, incomeQuery.data]);

    const saveSplit = useMutation({
        mutationFn: async () => {
            if (!householdId) throw new Error('No household');
            return client.money.jars.updateSplit({
                householdId,
                split: Object.entries(pct).map(([jarId, percentage]) => ({ jarId, percentage })),
            });
        },
        onSuccess: () => {
            setPctDraft(null);
            void queryClient.invalidateQueries({ queryKey: api.money.jars.list.key() });
            void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
            showToast('Split saved', 'success');
        },
        onError: () => showToast('Split save failed', 'error'),
    });

    function resetDefaults() {
        const next: Record<string, number> = {};
        for (const jar of jars) {
            next[jar.id] = DEFAULT_JAR_SPLIT[jar.key as JarKey] ?? jar.percentage;
        }
        setPctDraft(next);
        setDismissedTips({});
    }

    const defaultAccountLabel =
        accounts[0]?.name != null
            ? `${accounts[0].name}${accounts[0].iban ? ` · ${accounts[0].iban.slice(-4)}` : ''}`
            : null;

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Where each jar sits"
                blurb="Mix freely — Necessity on your current account, the rest as pots, Financial Freedom on a real savings account."
                badge={
                    <SettingsPill tone="accent">
                        {accounts.length
                            ? `${accounts.length} account${accounts.length === 1 ? '' : 's'}`
                            : 'No accounts'}
                    </SettingsPill>
                }>
                {jars.map((jar, i) => (
                    <SettingsRow key={jar.id} last={i === jars.length - 1}>
                        <span className="flex min-w-0 items-center gap-3">
                            <span
                                className={cn(
                                    'size-2 shrink-0 rounded-sm',
                                    JAR_COLOR[jar.key] ?? 'bg-accent'
                                )}
                            />
                            <span className="grid min-w-0 gap-0.5">
                                <span className="text-sm text-fg">{jar.name}</span>
                                <span
                                    className={cn(
                                        'font-mono text-[10px]',
                                        defaultAccountLabel ? 'text-fg-secondary' : 'text-warning'
                                    )}>
                                    {defaultAccountLabel ?? 'Not set — add a bank account'}
                                </span>
                            </span>
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full font-mono text-[10px] tracking-[0.12em] uppercase"
                            onClick={() =>
                                showToast(
                                    'Jar → account mapping saves with bank accounts — coming soon.',
                                    'info'
                                )
                            }>
                            Change
                        </Button>
                    </SettingsRow>
                ))}
            </SettingsInkCard>

            <SettingsInkCard
                eyebrow="Income split"
                blurb="Where income goes on arrival — must total 100%."
                badge={
                    <Badge tone={balanced ? 'success' : 'danger'}>{formatPercent(total)}</Badge>
                }>
                <div className="grid gap-0">
                    {jars.map((jar, i) => {
                        const value = pct[jar.id] ?? jar.percentage;
                        const allocated = Math.round((monthlyNet * value) / 100);
                        return (
                            <div
                                key={jar.id}
                                className={cn(
                                    'grid gap-1.5 py-2',
                                    i < jars.length - 1 && 'border-b border-line'
                                )}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'size-1.5 shrink-0 rounded-sm',
                                            JAR_COLOR[jar.key] ?? 'bg-accent'
                                        )}
                                    />
                                    <label
                                        htmlFor={`pct-${jar.id}`}
                                        className="min-w-0 flex-1 truncate text-sm text-fg">
                                        {jar.name}
                                    </label>
                                    <Input
                                        id={`pct-${jar.id}`}
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={0.5}
                                        value={value}
                                        onChange={e =>
                                            setPctDraft(prev => ({
                                                ...(prev ?? serverPct),
                                                [jar.id]: Number(e.target.value) || 0,
                                            }))
                                        }
                                        className="h-8 w-16 text-sm"
                                    />
                                    <span className="w-3 text-xs text-fg-muted">%</span>
                                    <span className="w-20 shrink-0 text-right text-xs text-fg-muted tabular-nums">
                                        {formatMoney(allocated)}
                                    </span>
                                </div>
                                <Meter value={value / 100} tone={JAR_COLOR[jar.key] ?? 'accent'} />
                            </div>
                        );
                    })}

                    {coachTips.length > 0 ? (
                        <div className="grid gap-1.5 border-t border-line py-2">
                            <p className="font-mono text-[9px] tracking-[0.14em] text-accent uppercase">
                                Coach
                            </p>
                            {coachTips.map(tip => (
                                <div
                                    key={tip.id}
                                    className={cn(
                                        'flex items-start justify-between gap-2 rounded-md border px-2.5 py-1.5',
                                        tip.severity === 'warn'
                                            ? 'border-amber-500/40 bg-amber-500/5'
                                            : 'border-line bg-raised/40'
                                    )}>
                                    <p className="text-xs leading-snug text-fg">{tip.message}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0"
                                        onClick={() =>
                                            setDismissedTips(prev => ({
                                                ...prev,
                                                [tip.id]: true,
                                            }))
                                        }>
                                        Got it
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div className="flex justify-end gap-2 border-t border-line py-2">
                        <Button variant="ghost" size="sm" onClick={resetDefaults}>
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            disabled={!live || !balanced || saveSplit.isPending}
                            onClick={() => saveSplit.mutate()}>
                            {saveSplit.isPending ? 'Working…' : 'Save'}
                        </Button>
                    </div>
                    {!live ? (
                        <div className="pb-2">
                            <StubNotice what="Sign in and complete setup to save the split." />
                        </div>
                    ) : null}
                </div>
            </SettingsInkCard>
        </SettingsPanel>
    );
}

export function DebtSettings() {
    const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="How you pay off debt"
                blurb="Sets the order Rumbelo recommends on the Debt screen. Switch any time — nothing is lost."
                badge={
                    <SettingsPill tone="accent">
                        {strategy === 'avalanche' ? 'Avalanche' : 'Snowball'}
                    </SettingsPill>
                }>
                {(
                    [
                        {
                            key: 'avalanche' as const,
                            name: 'Avalanche',
                            tag: 'Cheapest',
                            desc: 'Highest interest rate first. Costs least over the full payoff.',
                            metric: 'Interest saved · Freedom date sooner on expensive debt',
                        },
                        {
                            key: 'snowball' as const,
                            name: 'Snowball',
                            tag: 'Momentum',
                            desc: 'Smallest balance first. Clears debts faster for a quick win.',
                            metric: 'Wins sooner · Slightly more interest overall',
                        },
                    ] as const
                ).map((st, i, arr) => {
                    const on = strategy === st.key;
                    return (
                        <button
                            key={st.key}
                            type="button"
                            onClick={() => setStrategy(st.key)}
                            className={cn(
                                'flex w-full items-start gap-2.5 py-2.5 text-left',
                                i < arr.length - 1 && 'border-b border-line'
                            )}>
                            <span
                                className={cn(
                                    'mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full border',
                                    on ? 'border-accent' : 'border-line'
                                )}>
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        on ? 'bg-accent' : 'bg-transparent'
                                    )}
                                />
                            </span>
                            <span className="grid min-w-0 flex-1 gap-0.5">
                                <span className="flex flex-wrap items-baseline gap-2">
                                    <span className="text-sm text-fg">{st.name}</span>
                                    <span className="font-mono text-[9px] tracking-[0.12em] text-accent uppercase">
                                        {st.tag}
                                    </span>
                                </span>
                                <span className="text-[11px] leading-snug text-pretty text-fg-muted">
                                    {st.desc}
                                </span>
                                <span className="font-mono text-[10px] text-fg-secondary">
                                    {st.metric}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </SettingsInkCard>
            <StubNotice what="Payoff preference persists with household settings when that API lands." />
        </SettingsPanel>
    );
}

export function BankSettings() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const live = isLiveData(householdId);

    const accountsQuery = useLiveQuery(
        api.money.accounts.list.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const [name, setName] = useState('');
    const [iban, setIban] = useState('');
    const [kind, setKind] = useState<'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH' | 'INVESTMENT'>(
        'CHECKING'
    );
    const [adding, setAdding] = useState(false);

    const createAccount = useMutation({
        mutationFn: async () => {
            if (!householdId) throw new Error('No household');
            return client.money.accounts.create({
                householdId,
                name: name.trim(),
                iban: iban.trim() || null,
                kind,
                balance: 0,
            });
        },
        onSuccess: () => {
            setName('');
            setIban('');
            setKind('CHECKING');
            setAdding(false);
            void queryClient.invalidateQueries({ queryKey: api.money.accounts.list.key() });
            showToast('Account added', 'success');
        },
        onError: () => showToast('Account add failed', 'error'),
    });

    const accounts = accountsQuery.data ?? [];
    const kindLabel: Record<string, string> = {
        CHECKING: 'Checking',
        SAVINGS: 'Savings',
        CREDIT: 'Credit card',
        CASH: 'Cash',
        INVESTMENT: 'Investment',
    };

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Bank connection"
                blurb="Read-only — Rumbelo never moves money. Disconnect any time."
                badge={<SettingsPill>Not connected</SettingsPill>}>
                {BANK_OPTIONS.map((bank, i) => (
                    <SettingsRow key={bank} last={i === BANK_OPTIONS.length - 1}>
                        <SettingsRowLabel title={bank} />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full font-mono text-[10px] tracking-[0.12em] uppercase"
                            disabled
                            onClick={() => showToast('Bank connect coming soon', 'info')}>
                            Connect
                        </Button>
                    </SettingsRow>
                ))}
            </SettingsInkCard>

            <SettingsInkCard
                eyebrow="Manual accounts"
                blurb="CSV import always works. Add accounts here for recognition during import."
                badge={
                    <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full font-mono text-[10px] tracking-[0.12em] uppercase"
                        onClick={() => setAdding(true)}>
                        + Add
                    </Button>
                }>
                {accounts.length === 0 ? (
                    <p className="py-2.5 text-sm text-fg-muted">No accounts yet.</p>
                ) : (
                    accounts.map((a, i) => (
                        <SettingsRow key={a.id} last={i === accounts.length - 1 && !adding}>
                            <SettingsRowLabel
                                title={a.name}
                                sub={`${a.iban ?? 'No IBAN'} · ${formatMoney(a.balance)}`}
                            />
                            <Badge>{kindLabel[a.kind] ?? a.kind}</Badge>
                        </SettingsRow>
                    ))
                )}

                {adding ? (
                    <div className="grid gap-3 border-t border-line py-2.5">
                        <Field label="Name" htmlFor="acc-name">
                            <Input
                                id="acc-name"
                                placeholder="Checking account"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={!live}
                                autoFocus
                            />
                        </Field>
                        <Field
                            label="IBAN"
                            htmlFor="acc-iban"
                            hint="Optional — only for recognition during import.">
                            <Input
                                id="acc-iban"
                                placeholder="NL00 BANK 0000 0000 00"
                                value={iban}
                                onChange={e => setIban(e.target.value)}
                                disabled={!live}
                            />
                        </Field>
                        <Field label="Type" htmlFor="acc-kind">
                            <Select
                                id="acc-kind"
                                value={kind}
                                onChange={e => setKind(e.target.value as typeof kind)}
                                disabled={!live}>
                                <option value="CHECKING">Checking</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="CREDIT">Credit card</option>
                                <option value="CASH">Cash</option>
                                <option value="INVESTMENT">Investment</option>
                            </Select>
                        </Field>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setAdding(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!live || createAccount.isPending || !name.trim()}
                                onClick={() => createAccount.mutate()}>
                                {createAccount.isPending ? 'Working…' : 'Add'}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </SettingsInkCard>
        </SettingsPanel>
    );
}

export function GroeiSettings() {
    const [horizon, setHorizon] = useState(24);

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Planning horizon"
                blurb="How far ahead the goal and freedom calculations look. Shorter feels urgent, longer shows the compounding.">
                <div className="flex flex-wrap items-center gap-3 py-3">
                    <input
                        type="range"
                        min={6}
                        max={60}
                        step={3}
                        value={horizon}
                        onChange={e => setHorizon(Number(e.target.value))}
                        className="min-w-55 flex-1 accent-(--color-accent)"
                        aria-label="Planning horizon in months"
                    />
                    <span className="font-display text-xl font-semibold tracking-tight whitespace-nowrap text-accent">
                        {horizon} months
                    </span>
                </div>
            </SettingsInkCard>
            <StubNotice what="Horizon persists with growth settings when that API lands." />
        </SettingsPanel>
    );
}

export function EnergieSettings() {
    const [weekHours, setWeekHours] = useState(48);
    const [sleepHours, setSleepHours] = useState(7.5);
    const [weightKg, setWeightKg] = useState(78);

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Your baseline"
                blurb="Three numbers the Energy portal builds on. Everything else — sessions, targets, advice — is derived from these.">
                <SettingsRow>
                    <span className="w-36 shrink-0 font-mono text-[9px] tracking-[0.14em] text-fg-faint uppercase">
                        Steered hours p/w
                    </span>
                    <input
                        type="range"
                        min={20}
                        max={80}
                        step={1}
                        value={weekHours}
                        onChange={e => setWeekHours(Number(e.target.value))}
                        className="min-w-35 flex-1 accent-(--color-accent)"
                        aria-label="Steered hours per week"
                    />
                    <span className="min-w-14 font-display text-lg font-semibold text-accent">
                        {weekHours}h
                    </span>
                </SettingsRow>
                <SettingsRow>
                    <span className="w-36 shrink-0 font-mono text-[9px] tracking-[0.14em] text-fg-faint uppercase">
                        Sleep per night
                    </span>
                    <input
                        type="range"
                        min={4}
                        max={11}
                        step={0.5}
                        value={sleepHours}
                        onChange={e => setSleepHours(Number(e.target.value))}
                        className="min-w-35 flex-1 accent-(--color-accent)"
                        aria-label="Sleep hours per night"
                    />
                    <span className="min-w-14 font-display text-lg font-semibold text-accent">
                        {sleepHours}h
                    </span>
                </SettingsRow>
                <SettingsRow last>
                    <span className="w-36 shrink-0 font-mono text-[9px] tracking-[0.14em] text-fg-faint uppercase">
                        Weight
                    </span>
                    <input
                        type="range"
                        min={45}
                        max={140}
                        step={1}
                        value={weightKg}
                        onChange={e => setWeightKg(Number(e.target.value))}
                        className="min-w-35 flex-1 accent-(--color-accent)"
                        aria-label="Weight in kilograms"
                    />
                    <span className="min-w-14 font-display text-lg font-semibold text-accent">
                        {weightKg} kg
                    </span>
                </SettingsRow>
            </SettingsInkCard>
            <StubNotice what="Wearable sync and persistence — coming soon." />
        </SettingsPanel>
    );
}

export function ZielSettings() {
    const [mindMin, setMindMin] = useState(10);

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Your daily stillness"
                blurb="How long you sit. Short and daily beats long and occasional — this is the one practice that costs nothing and protects every jar.">
                <div className="flex flex-wrap items-center gap-3 py-3">
                    <input
                        type="range"
                        min={1}
                        max={45}
                        step={1}
                        value={mindMin}
                        onChange={e => setMindMin(Number(e.target.value))}
                        className="min-w-55 flex-1 accent-(--color-accent)"
                        aria-label="Daily stillness minutes"
                    />
                    <span className="font-display text-xl font-semibold tracking-tight whitespace-nowrap text-accent">
                        {mindMin} min
                    </span>
                </div>
            </SettingsInkCard>
            <StubNotice what="Intention templates and reminders — coming soon." />
        </SettingsPanel>
    );
}

export function SysteemSettings() {
    const api = useApi();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast } = useAppShell();
    const live = isLiveData(householdId);

    const householdQuery = useLiveQuery(
        api.household.current.queryOptions({ input: { householdId: householdId! } }),
        null,
        live
    );

    const [hhNameDraft, setHhNameDraft] = useState<string | null>(null);
    const hhName = hhNameDraft ?? householdQuery.data?.name ?? '';

    const [rules, setRules] = useState(() =>
        Object.fromEntries(AUTO_RULES.map(r => [r.key, r.defaultOn])) as Record<string, boolean>
    );

    const saveHouseholdName = useMutation({
        mutationFn: async () => {
            if (!householdId) throw new Error('No household');
            await updateOrganization(householdId, { name: hhName.trim() });
        },
        onSuccess: () => {
            setHhNameDraft(null);
            void queryClient.invalidateQueries({ queryKey: api.household.current.key() });
            void queryClient.invalidateQueries({ queryKey: api.household.list.key() });
            showToast('Household updated', 'success');
        },
        onError: () => showToast('Household save failed', 'error'),
    });

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="What Rumbelo does by itself"
                blurb="Four rules. Everything off means Rumbelo only shows, never acts.">
                {AUTO_RULES.map((r, i) => (
                    <button
                        key={r.key}
                        type="button"
                        onClick={() => setRules(prev => ({ ...prev, [r.key]: !prev[r.key] }))}
                        className={cn(
                            'flex w-full flex-wrap items-center justify-between gap-2 py-2.5 text-left',
                            i < AUTO_RULES.length - 1 && 'border-b border-line'
                        )}>
                        <SettingsRowLabel title={r.name} sub={r.desc} />
                        <span
                            className={cn(
                                'relative h-5 w-9 shrink-0 rounded-full transition-colors',
                                rules[r.key] ? 'bg-accent' : 'bg-raised'
                            )}>
                            <span
                                className={cn(
                                    'absolute top-0.5 size-3.5 rounded-full bg-surface transition-[left]',
                                    rules[r.key] ? 'left-[18px]' : 'left-0.5'
                                )}
                            />
                        </span>
                    </button>
                ))}
            </SettingsInkCard>

            <SettingsInkCard
                eyebrow="Household name"
                blurb="Shown in the shell and on shared invites.">
                <div className="grid gap-3 py-2.5">
                    <Field label="Name" htmlFor="hh-name">
                        <Input
                            id="hh-name"
                            value={hhName}
                            onChange={e => setHhNameDraft(e.target.value)}
                            disabled={!live}
                        />
                    </Field>
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            disabled={!live || saveHouseholdName.isPending || !hhName.trim()}
                            onClick={() => saveHouseholdName.mutate()}>
                            {saveHouseholdName.isPending ? 'Working…' : 'Save'}
                        </Button>
                    </div>
                </div>
            </SettingsInkCard>

            <StubNotice what="Automation rules persist with household settings when that API lands. Theme and language live under Account." />
        </SettingsPanel>
    );
}

export function PlanSettings() {
    const { showToast } = useAppShell();
    const [billing, setBilling] = useState<'month' | 'year'>('month');
    const [plan, setPlan] = useState<PlanKey>('grip');

    const cards: {
        key: PlanKey;
        priceM: number;
        priceY: number;
        tag: string;
        line: string;
        feats: string;
    }[] = [
        {
            key: 'grip',
            priceM: 0,
            priceY: 0,
            tag: 'Free forever',
            line: 'The six jars and the practice underneath. No bank needed, no card needed — enough to start today.',
            feats: 'MONEY · the six jars · Add expenses · Safe to spend · SOUL · The coach',
        },
        {
            key: 'ritme',
            priceM: 9,
            priceY: 90,
            tag: 'Most chosen',
            line: 'The part that runs without you — plus Energy. Banks tied to jars, transactions sorted on arrival.',
            feats: 'Everything in Grip · Bank connect · Debt plan · ENERGY · Unlimited history',
        },
        {
            key: 'groei',
            priceM: 19,
            priceY: 190,
            tag: 'All four portals',
            line: 'Where the money starts making money. Goals, income curve, learning, and net worth.',
            feats: 'Everything in Engine · GROWTH · Income · Learning · Net worth · Devices later',
        },
    ];

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="What you use and pay"
                blurb="Three plans named after the road itself. Start free and stay free as long as you like — nothing you have entered is ever locked away."
                badge={
                    <div className="flex gap-1 rounded-full bg-raised p-1">
                        {(
                            [
                                ['month', 'Monthly'],
                                ['year', 'Yearly · 2 months free'],
                            ] as const
                        ).map(([k, label]) => (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setBilling(k)}
                                className={cn(
                                    'rounded-full px-3.5 py-2 font-mono text-[10px] font-medium tracking-wide uppercase',
                                    billing === k
                                        ? 'bg-accent text-on-accent'
                                        : 'text-fg-muted hover:text-fg'
                                )}>
                                {label}
                            </button>
                        ))}
                    </div>
                }>
                <div className="grid gap-2 py-2.5">
                    {cards.map(p => {
                        const yearly = billing === 'year';
                        const cur = plan === p.key;
                        const price =
                            p.priceM === 0
                                ? '€0'
                                : formatMoney((yearly ? p.priceY : p.priceM) * 100);
                        return (
                            <div
                                key={p.key}
                                className={cn(
                                    'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-l-[3px] px-3.5 py-3',
                                    cur
                                        ? 'border-accent/40 border-l-accent bg-accent-soft'
                                        : 'border-line border-l-line bg-surface'
                                )}>
                                <div className="grid min-w-0 gap-1">
                                    <span className="flex flex-wrap items-baseline gap-2">
                                        <span className="font-display text-lg font-semibold tracking-tight text-fg">
                                            {PLAN_LABELS[p.key]}
                                        </span>
                                        <span className="font-display text-lg font-semibold tracking-tight text-accent">
                                            {price}
                                        </span>
                                        {p.priceM > 0 ? (
                                            <span className="font-mono text-[10px] text-fg-muted">
                                                {yearly ? '/year' : '/month'}
                                            </span>
                                        ) : null}
                                        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[8px] tracking-widest text-fg-secondary uppercase">
                                            {p.tag}
                                        </span>
                                    </span>
                                    <p className="line-clamp-2 text-xs leading-snug text-fg-muted">
                                        {p.line}
                                    </p>
                                    <span className="line-clamp-1 font-mono text-[10px] text-fg-faint">
                                        {p.feats}
                                    </span>
                                </div>
                                <Button
                                    variant={cur ? 'secondary' : 'primary'}
                                    size="sm"
                                    className="shrink-0 rounded-full font-mono text-[10px] tracking-widest uppercase"
                                    onClick={() => {
                                        setPlan(p.key);
                                        showToast(
                                            cur
                                                ? `Already on ${PLAN_LABELS[p.key]}`
                                                : `${PLAN_LABELS[p.key]} selected — billing coming soon`,
                                            'info'
                                        );
                                    }}>
                                    {cur ? 'Current' : p.priceM === 0 ? 'Choose Grip' : 'Choose'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </SettingsInkCard>
            <StubNotice what="Stripe billing and plan gates — coming soon." />
        </SettingsPanel>
    );
}

export function ExportSettings() {
    const client = useApiClient();
    const { householdId } = useAuth();
    const { showToast, period } = useAppShell();
    const live = isLiveData(householdId);
    const [busy, setBusy] = useState<'csv' | 'json' | null>(null);
    const [scope, setScope] = useState<'all' | 'tx' | 'month'>('all');

    async function exportCsv() {
        if (!householdId) return;
        setBusy('csv');
        try {
            const { items } = await client.money.transactions.list({
                householdId,
                limit: 500,
            });
            const jars = await client.money.jars.list({ householdId });
            const jarName = new Map(jars.map(j => [j.id, j.name]));
            const rows = items.map(t => ({
                id: t.id,
                bookedOn: t.bookedOn,
                description: t.description,
                counterparty: t.counterparty ?? '',
                amountCents: t.amount,
                status: t.status,
                jar: t.jarId ? (jarName.get(t.jarId) ?? t.jarId) : '',
                categoryId: t.categoryId ?? '',
            }));
            const stamp = `${period.year}-${String(period.month).padStart(2, '0')}`;
            downloadTextFile(
                `rumbelo-transactions-${stamp}.csv`,
                toCsv(rows),
                'text/csv;charset=utf-8'
            );
            showToast(
                `${rows.length} transaction${rows.length === 1 ? '' : 's'} exported`,
                'success'
            );
        } catch {
            showToast('CSV export failed', 'error');
        } finally {
            setBusy(null);
        }
    }

    async function exportJson() {
        if (!householdId) return;
        setBusy('json');
        try {
            const [jars, income, fixedCosts, debts, goals, rules, transactions] = await Promise.all(
                [
                    client.money.jars.list({ householdId }),
                    client.money.income.list({ householdId }),
                    client.money.fixedCosts.list({ householdId }),
                    client.money.debts.list({ householdId }),
                    client.money.goals.list({ householdId }),
                    client.money.rules.list({ householdId }),
                    client.money.transactions.list({ householdId, limit: 500 }),
                ]
            );
            const payload = {
                exportedAt: new Date().toISOString(),
                householdId,
                jars,
                income,
                fixedCosts,
                debts,
                goals,
                rules,
                transactions: transactions.items,
            };
            const stamp = new Date().toISOString().slice(0, 10);
            downloadTextFile(
                `rumbelo-export-${stamp}.json`,
                JSON.stringify(payload, null, 2),
                'application/json'
            );
            showToast('Full export downloaded', 'success');
        } catch {
            showToast('JSON export failed', 'error');
        } finally {
            setBusy(null);
        }
    }

    const sheets = [
        { name: 'Jars', rows: '6 rows', cols: 'key · name · % · allocated' },
        { name: 'Income', rows: 'sources', cols: 'label · amount · kind' },
        { name: 'Fixed costs', rows: 'recurring', cols: 'name · amount · jar' },
        { name: 'Transactions', rows: 'ledger', cols: 'date · desc · amount · jar' },
        { name: 'Debts', rows: 'balances', cols: 'name · rate · balance' },
        { name: 'Goals', rows: 'targets', cols: 'name · target · jar' },
        { name: 'Rules', rows: 'automation', cols: 'match · jar · priority' },
    ];

    const scopes = [
        {
            key: 'all' as const,
            label: 'Everything',
            desc: 'Every sheet in one file',
        },
        {
            key: 'tx' as const,
            label: 'Transactions only',
            desc: 'For your accountant or administrator',
        },
        {
            key: 'month' as const,
            label: 'This month only',
            desc: 'What is running now',
        },
    ];

    return (
        <SettingsPanel>
            <SettingsInkCard
                eyebrow="Everything to Excel or CSV"
                blurb="One file with a tab per subject — jars, income, fixed costs, transactions, debts, what you own, goals. Handy for your accountant, an administrator, or your own archive.">
                <div className="grid gap-2.5 border-b border-line py-2.5">
                    <p className="font-mono text-[9px] font-medium tracking-[0.14em] text-fg-faint uppercase">
                        What goes in
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-2.5">
                        {scopes.map(o => {
                            const on = scope === o.key;
                            return (
                                <button
                                    key={o.key}
                                    type="button"
                                    onClick={() => setScope(o.key)}
                                    className={cn(
                                        'grid gap-1 rounded-[13px] border p-3.5 text-left transition-colors',
                                        on
                                            ? 'border-accent bg-accent-soft'
                                            : 'border-line hover:border-accent/40'
                                    )}>
                                    <span className="flex items-baseline justify-between gap-2">
                                        <span
                                            className={cn(
                                                'text-[13.5px] font-semibold',
                                                on ? 'text-accent' : 'text-fg'
                                            )}>
                                            {o.label}
                                        </span>
                                        {on ? (
                                            <span className="font-mono text-[11px] text-accent">
                                                ✦
                                            </span>
                                        ) : null}
                                    </span>
                                    <span className="font-mono text-[10px] leading-snug text-fg-muted">
                                        {o.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-1.5 border-b border-line py-2.5">
                    <p className="font-mono text-[9px] font-medium tracking-[0.14em] text-fg-faint uppercase">
                        Tabs in the file
                    </p>
                    <div className="grid gap-1">
                        {sheets.map(sh => (
                            <span
                                key={sh.name}
                                className="flex flex-wrap items-baseline gap-2 rounded-lg border border-line bg-raised px-2.5 py-1.5">
                                <span className="shrink-0 text-xs font-semibold text-fg">
                                    {sh.name}
                                </span>
                                <span className="shrink-0 font-mono text-[10px] text-accent">
                                    {sh.rows}
                                </span>
                                <span className="min-w-0 font-mono text-[10px] leading-snug text-fg-muted">
                                    {sh.cols}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2 py-2.5">
                    <div className="flex flex-wrap gap-2.5">
                        <Button
                            className="min-w-[190px] flex-1 rounded-full font-mono text-[10.5px] tracking-[0.13em] uppercase"
                            disabled={!live || busy != null}
                            onClick={() => {
                                showToast(
                                    'Excel multi-sheet export coming soon — use CSV or JSON for now.',
                                    'info'
                                );
                            }}>
                            Download Excel (.xls)
                        </Button>
                        <Button
                            variant="secondary"
                            className="min-w-[190px] flex-1 rounded-full font-mono text-[10.5px] tracking-[0.13em] uppercase"
                            disabled={!live || busy != null}
                            onClick={() => {
                                if (scope === 'all') void exportJson();
                                else void exportCsv();
                            }}>
                            {busy ? 'Working…' : scope === 'all' ? 'Download JSON' : 'Download CSV'}
                        </Button>
                    </div>
                    <p className="font-mono text-[10.5px] leading-relaxed text-pretty text-fg-muted">
                        Excel with a real tab per subject is coming. CSV / JSON work today — pick
                        CSV when a system asks for raw data.
                    </p>
                    {!live ? <StubNotice what="Sign in to download exports." /> : null}
                </div>
            </SettingsInkCard>
        </SettingsPanel>
    );
}

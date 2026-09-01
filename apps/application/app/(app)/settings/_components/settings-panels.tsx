'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { DEFAULT_JAR_SPLIT, type JarKey } from '@rumbelo/contracts';
import { useLiveQuery } from '@rumbelo/hooks';
import {
    Badge,
    Button,
    Card,
    DangerZone,
    Eyebrow,
    Field,
    Input,
    Meter,
    Section,
    Select,
    StubNotice,
    Toggle,
} from '@rumbelo/ui';
import { formatMoney, formatPercent } from '@rumbelo/utils';

import { changePassword, updateOrganization, updateUser } from '@/app/_lib/auth';
import { downloadTextFile, toCsv } from '@/app/_lib/download';
import { isLiveData } from '@/app/_lib/preview';
import { JAR_META, mockJars } from '@/app/_mock';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { ListToolbar } from '@/components/layout/list-toolbar';

const JAR_COLOR: Record<string, string> = Object.fromEntries(JAR_META.map(j => [j.key, j.color]));

function ProfileNameCard({
    defaultName,
    userEmail,
    savePending,
    onSave,
}: {
    defaultName: string;
    userEmail: string;
    savePending: boolean;
    onSave: (name: string) => void;
}) {
    const [name, setName] = useState(defaultName);

    return (
        <Card className="grid gap-4">
            <Field label="Name" htmlFor="name">
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </Field>
            <Field
                label="Email address"
                htmlFor="email"
                hint="Changing email requires confirmation — coming later via better-auth.">
                <Input id="email" type="email" value={userEmail} disabled />
            </Field>
            <div className="flex justify-end">
                <Button
                    disabled={savePending || !name.trim() || name.trim() === defaultName}
                    onClick={() => onSave(name.trim())}>
                    {savePending ? 'Working…' : 'Save'}
                </Button>
            </div>
        </Card>
    );
}

export function AccountSettings() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { session, householdId, refreshSession } = useAuth();
    const { showToast } = useAppShell();
    const live = isLiveData(householdId);

    const user = session?.user;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    const membersQuery = useLiveQuery(
        api.household.members.queryOptions({ input: { householdId: householdId! } }),
        [],
        live
    );

    const saveProfile = useMutation({
        mutationFn: async (nextName: string) => {
            const result = await updateUser({ name: nextName });
            if (result.error) throw new Error(result.error.message ?? 'Profile save failed');
        },
        onSuccess: async () => {
            await refreshSession();
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
                role: 'PARTNER',
            });
        },
        onSuccess: () => {
            setInviteEmail('');
            void queryClient.invalidateQueries({ queryKey: api.household.members.key() });
            showToast('Invitation sent', 'success');
        },
        onError: () => showToast('Invitation failed', 'error'),
    });

    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Account" title="Profile" />

            <ProfileNameCard
                key={user?.id ?? 'guest'}
                defaultName={user?.name ?? ''}
                userEmail={user?.email ?? ''}
                savePending={saveProfile.isPending}
                onSave={nextName => saveProfile.mutate(nextName)}
            />

            <Card className="grid gap-4">
                <Eyebrow className="mb-0">Password</Eyebrow>
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
            </Card>

            <Card>
                <Eyebrow className="mb-3">Two-step verification</Eyebrow>
                <Toggle
                    checked={false}
                    label="Authenticator app (TOTP)"
                    hint="Scan the QR code with Google Authenticator, 1Password, or similar."
                    disabled
                />
                <StubNotice what="2FA setup via better-auth TOTP — coming soon." />
            </Card>

            <Card className="grid gap-4">
                <Eyebrow className="mb-0">Household</Eyebrow>
                <p className="text-sm text-fg-muted">
                    Members share jars, rules, and transaction history. Each member signs in with
                    their own account.
                </p>
                {live && (membersQuery.data?.length ?? 0) > 0 ? (
                    <ul className="divide-y divide-line rounded-lg border border-line">
                        {(membersQuery.data ?? []).map(m => (
                            <li
                                key={m.id}
                                className="flex items-center justify-between gap-3 px-3 py-2.5">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-fg">{m.name}</p>
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
            </Card>

            <DangerZone
                title="Delete account"
                body="Your household, jars, and full transaction history will be deleted. This cannot be undone — export your data first."
                action="Delete account"
                onAction={() =>
                    showToast('Account deletion coming soon — export your data first.', 'info')
                }
            />
        </div>
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

    const jars = useMemo(() => jarsQuery.data ?? [], [jarsQuery.data]);
    const serverPct = useMemo(
        () => Object.fromEntries(jars.map(j => [j.id, j.percentage])),
        [jars]
    );
    const [pctDraft, setPctDraft] = useState<Record<string, number> | null>(null);
    const pct = pctDraft ?? serverPct;

    const total = Object.values(pct).reduce((s, n) => s + n, 0);
    const balanced = Math.abs(total - 100) < 0.01;

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
    }

    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Money" title="Jars">
                <p className="text-sm text-fg-muted">
                    The split determines where income goes the moment it arrives. Everything
                    together must be exactly 100% — otherwise money goes missing or appears from
                    nowhere.
                </p>
            </Section>

            <Card className="flex items-center justify-between">
                <p className="text-sm font-semibold text-fg">Total</p>
                <Badge tone={balanced ? 'success' : 'danger'}>{formatPercent(total)}</Badge>
            </Card>

            <Card className="grid gap-5">
                {jars.map(jar => {
                    const value = pct[jar.id] ?? jar.percentage;
                    const allocated = Math.round((monthlyNet * value) / 100);
                    return (
                        <div key={jar.id} className="grid gap-2">
                            <div className="flex items-end justify-between gap-4">
                                <Field
                                    label={`${jar.icon ?? ''} ${jar.name}`.trim()}
                                    htmlFor={`pct-${jar.id}`}>
                                    <div className="flex items-center gap-2">
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
                                            className="w-24"
                                        />
                                        <span className="text-sm text-fg-muted">%</span>
                                    </div>
                                </Field>
                                <p className="pb-3 text-sm text-fg-muted tabular-nums">
                                    {formatMoney(allocated)}/mo
                                </p>
                            </div>
                            <Meter value={value / 100} tone={JAR_COLOR[jar.key] ?? 'accent'} />
                        </div>
                    );
                })}
                <div className="flex justify-end gap-2 border-t border-line pt-4">
                    <Button variant="ghost" onClick={resetDefaults}>
                        Reset to default
                    </Button>
                    <Button
                        disabled={!live || !balanced || saveSplit.isPending}
                        onClick={() => saveSplit.mutate()}>
                        {saveSplit.isPending ? 'Working…' : 'Save split'}
                    </Button>
                </div>
                {!live ? <StubNotice what="Sign in and complete setup to save the split." /> : null}
            </Card>
        </div>
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
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Money" title="Bank">
                <p className="text-sm text-fg-muted">
                    CSV import always works and is the recommended route. A direct bank connection
                    requires a PSD2 aggregator.
                </p>
            </Section>

            <ListToolbar createLabel="+ Add account" onCreate={() => setAdding(true)}>
                <span className="text-sm font-semibold text-fg">Accounts</span>
            </ListToolbar>

            <Card className="p-0">
                {accounts.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-fg-muted">No accounts yet.</p>
                ) : (
                    <ul className="divide-y divide-line">
                        {accounts.map(a => (
                            <li
                                key={a.id}
                                className="flex items-center justify-between gap-4 px-5 py-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-fg">{a.name}</p>
                                    <p className="truncate font-mono text-xs text-fg-muted">
                                        {a.iban ?? 'No IBAN'} · {formatMoney(a.balance)}
                                    </p>
                                </div>
                                <Badge>{kindLabel[a.kind] ?? a.kind}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {adding ? (
                <Card className="grid gap-4">
                    <p className="text-sm font-semibold text-fg">Add account</p>
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
                </Card>
            ) : null}

            <Card>
                <Eyebrow className="mb-2">Bank connection</Eyebrow>
                <p className="text-sm text-fg-muted">
                    Disabled. Enable Banking has a free &lsquo;restricted production&rsquo; tier for
                    accounts you connect yourself — enough for this stage.
                </p>
                <div className="mt-4">
                    <Button variant="secondary" disabled>
                        Connect bank
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export function GroeiSettings() {
    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Growth" title="Growth profile" />
            <Card>
                <Eyebrow className="mb-2">Income goal</Eyebrow>
                <Field label="Target monthly income (net)" htmlFor="income-goal">
                    <Input id="income-goal" type="number" placeholder="5000" disabled />
                </Field>
                <p className="mt-2 text-xs text-fg-muted">Used as a reference in Growth charts.</p>
            </Card>
            <StubNotice what="Learning goals, reading list integration, and passive income tracker — coming soon." />
        </div>
    );
}

export function EnergieSettings() {
    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Energy" title="Energy profile" />
            <Card>
                <Eyebrow className="mb-3">Sleep</Eyebrow>
                <Field label="Sleep target (hours)" htmlFor="sleep-goal">
                    <Input
                        id="sleep-goal"
                        type="number"
                        min={4}
                        max={12}
                        defaultValue={8}
                        className="w-28"
                        disabled
                    />
                </Field>
            </Card>
            <Card>
                <Eyebrow className="mb-3">Training</Eyebrow>
                <Field label="Training sessions per week" htmlFor="train-goal">
                    <Input
                        id="train-goal"
                        type="number"
                        min={0}
                        max={14}
                        defaultValue={4}
                        className="w-28"
                        disabled
                    />
                </Field>
            </Card>
            <StubNotice what="Wearable integration (Garmin, Apple Health) and macro goals — coming soon." />
        </div>
    );
}

export function ZielSettings() {
    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Soul" title="Soul profile" />
            <Card>
                <Eyebrow className="mb-3">Stillness practice</Eyebrow>
                <Field label="Daily target (minutes)" htmlFor="mind-goal">
                    <Input
                        id="mind-goal"
                        type="number"
                        min={0}
                        max={120}
                        defaultValue={10}
                        className="w-28"
                        disabled
                    />
                </Field>
            </Card>
            <StubNotice what="Intention templates, chakra routing, and gratitude settings — coming soon." />
        </div>
    );
}

export function SysteemSettings() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { showToast, locale, toggleLocale } = useAppShell();
    const live = isLiveData(householdId);

    const settingsQuery = useLiveQuery(
        api.household.settings.queryOptions({ input: { householdId: householdId! } }),
        null,
        live
    );
    const householdQuery = useLiveQuery(
        api.household.current.queryOptions({ input: { householdId: householdId! } }),
        null,
        live
    );

    const settings = settingsQuery.data;
    const [periodDayDraft, setPeriodDayDraft] = useState<number | null>(null);
    const [hhNameDraft, setHhNameDraft] = useState<string | null>(null);
    const periodDay = periodDayDraft ?? settings?.periodStartDay ?? 1;
    const hhName = hhNameDraft ?? householdQuery.data?.name ?? '';
    const [dark, setDark] = useState(
        () => typeof window !== 'undefined' && localStorage.getItem('rumbelo-theme') === 'dark'
    );

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
            void queryClient.invalidateQueries({ queryKey: api.household.current.key() });
            showToast('Period saved', 'success');
        },
        onError: () => showToast('Period save failed', 'error'),
    });

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

    const saveLocale = useMutation({
        mutationFn: async (next: 'nl' | 'en') => {
            if (!householdId) throw new Error('No household');
            return client.household.updateSettings({ householdId, locale: next });
        },
        onSuccess: (_data, next) => {
            if (locale !== next) toggleLocale();
            void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
            showToast('Language saved', 'success');
        },
        onError: () => showToast('Language save failed', 'error'),
    });

    const saveTheme = useMutation({
        mutationFn: async (next: 'light' | 'dark') => {
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('rumbelo-theme', next);
            setDark(next === 'dark');
            if (!householdId) return null;
            return client.household.updateSettings({ householdId, theme: next });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
        },
        onError: () => showToast('Theme save failed', 'error'),
    });

    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="System" title="Display & period" />

            <Card>
                <Eyebrow className="mb-3">Theme</Eyebrow>
                <Toggle
                    checked={dark}
                    label="Dark mode"
                    hint="Saved locally and in household settings."
                    onCheckedChange={next => saveTheme.mutate(next ? 'dark' : 'light')}
                />
                <div className="mt-3">
                    <Field label="Language" htmlFor="lang">
                        <Select
                            id="lang"
                            value={settings?.locale ?? locale}
                            onChange={e => {
                                const next = e.target.value as 'nl' | 'en';
                                if (live) saveLocale.mutate(next);
                                else if (locale !== next) toggleLocale();
                            }}>
                            <option value="nl">Dutch</option>
                            <option value="en">English</option>
                        </Select>
                    </Field>
                    <p className="mt-1.5 text-xs text-fg-muted">
                        UI copy will be fully English; the preference is already saved.
                    </p>
                </div>
            </Card>

            <Card>
                <Eyebrow className="mb-3">Period</Eyebrow>
                <Field
                    label="Day the month rolls over"
                    htmlFor="period-day"
                    hint="The turn closes on this day. Income received after counts for next month.">
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
                <div className="mt-4 flex justify-end">
                    <Button
                        variant="secondary"
                        disabled={!live || savePeriod.isPending}
                        onClick={() => savePeriod.mutate()}>
                        {savePeriod.isPending ? 'Working…' : 'Save'}
                    </Button>
                </div>
            </Card>

            <Card>
                <Eyebrow className="mb-3">Household</Eyebrow>
                <Field label="Name" htmlFor="hh-name">
                    <Input
                        id="hh-name"
                        value={hhName}
                        onChange={e => setHhNameDraft(e.target.value)}
                        disabled={!live}
                    />
                </Field>
                <div className="mt-4 flex justify-end">
                    <Button
                        variant="secondary"
                        disabled={!live || saveHouseholdName.isPending || !hhName.trim()}
                        onClick={() => saveHouseholdName.mutate()}>
                        {saveHouseholdName.isPending ? 'Working…' : 'Save'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export function PlanSettings() {
    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="Plan" title="Subscription" />
            <Card>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-fg">Rumbelo Early Access</p>
                        <p className="mt-1 text-xs text-fg-muted">
                            You are using Rumbelo for free during the early-access phase. Billing
                            begins when the product is ready for a wider audience.
                        </p>
                    </div>
                    <Badge tone="success">Active</Badge>
                </div>
            </Card>
            <StubNotice what="Stripe integration, plan gates, and billing history — coming soon." />
        </div>
    );
}

export function ExportSettings() {
    const client = useApiClient();
    const { householdId } = useAuth();
    const { showToast, period } = useAppShell();
    const live = isLiveData(householdId);
    const [busy, setBusy] = useState<'csv' | 'json' | null>(null);

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

    return (
        <div className="mx-auto grid w-full max-w-lg gap-6">
            <Section eyebrow="System" title="Export">
                <p className="text-sm text-fg-muted">
                    Your data belongs to you. You can download an export from this device at any
                    time.
                </p>
            </Section>

            <Card className="grid gap-4">
                <Eyebrow>Transactions</Eyebrow>
                <p className="text-sm text-fg-muted">
                    All recent transactions, including jar, as CSV.
                </p>
                <Button
                    variant="secondary"
                    className="w-fit"
                    disabled={!live || busy != null}
                    onClick={() => void exportCsv()}>
                    {busy === 'csv' ? 'Working…' : 'Download as CSV'}
                </Button>
            </Card>

            <Card className="grid gap-4">
                <Eyebrow>Full data</Eyebrow>
                <p className="text-sm text-fg-muted">
                    Jars, income, fixed costs, debts, goals, rules, and transactions as JSON.
                </p>
                <Button
                    variant="secondary"
                    className="w-fit"
                    disabled={!live || busy != null}
                    onClick={() => void exportJson()}>
                    {busy === 'json' ? 'Working…' : 'Download as JSON'}
                </Button>
            </Card>

            {!live ? <StubNotice what="Sign in to download exports." /> : null}
        </div>
    );
}

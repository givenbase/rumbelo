'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_JAR_SPLIT, type JarKey } from '@rumbelo/contracts';
import { useApi, useApiClient } from '@rumbelo/contracts/react';
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
import { JAR_META, mockJars } from '@/app/_mock';
import { changePassword, updateOrganization, updateUser } from '@/app/_lib/auth';
import { downloadTextFile, toCsv } from '@/app/_lib/download';
import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { ListToolbar } from '@/components/layout/list-toolbar';

const JAR_COLOR: Record<string, string> = Object.fromEntries(
  JAR_META.map((j) => [j.key, j.color]),
);

export function AccountSettings() {
  const api = useApi();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { session, householdId, refreshSession } = useAuth();
  const { showToast } = useAppShell();
  const live = isLiveData(householdId);

  const user = session?.user;
  const [name, setName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
  }, [user?.name]);

  const membersQuery = useLiveQuery(
    api.household.members.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );

  const saveProfile = useMutation({
    mutationFn: async () => {
      const result = await updateUser({ name: name.trim() });
      if (result.error) throw new Error(result.error.message ?? 'Profiel opslaan mislukt');
    },
    onSuccess: async () => {
      await refreshSession();
      showToast('Profiel opgeslagen', 'success');
    },
    onError: () => showToast('Profiel opslaan mislukt', 'error'),
  });

  const savePassword = useMutation({
    mutationFn: async () => {
      const result = await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result.error) throw new Error(result.error.message ?? 'Wachtwoord wijzigen mislukt');
    },
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      showToast('Wachtwoord gewijzigd', 'success');
    },
    onError: () => showToast('Wachtwoord wijzigen mislukt', 'error'),
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
      showToast('Uitnodiging verstuurd', 'success');
    },
    onError: () => showToast('Uitnodigen mislukt', 'error'),
  });

  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Account" title="Profiel" />

      <Card className="grid gap-4">
        <Field label="Naam" htmlFor="name">
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field
          label="E-mailadres"
          htmlFor="email"
          hint="E-mail wijzigen vraagt om bevestiging — komt later via better-auth."
        >
          <Input id="email" type="email" value={user?.email ?? ''} disabled />
        </Field>
        <div className="flex justify-end">
          <Button
            disabled={saveProfile.isPending || !name.trim() || name.trim() === user?.name}
            onClick={() => saveProfile.mutate()}
          >
            {saveProfile.isPending ? 'Bezig…' : 'Opslaan'}
          </Button>
        </div>
      </Card>

      <Card className="grid gap-4">
        <Eyebrow className="mb-0">Wachtwoord</Eyebrow>
        <Field label="Huidig wachtwoord" htmlFor="cur-pw">
          <Input
            id="cur-pw"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
          />
        </Field>
        <Field label="Nieuw wachtwoord" htmlFor="new-pw" hint="Minimaal 8 tekens.">
          <Input
            id="new-pw"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="new-password"
          />
        </Field>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            disabled={savePassword.isPending || currentPassword.length < 1 || newPassword.length < 8}
            onClick={() => savePassword.mutate()}
          >
            {savePassword.isPending ? 'Bezig…' : 'Wachtwoord wijzigen'}
          </Button>
        </div>
      </Card>

      <Card>
        <Eyebrow className="mb-3">Tweestapsverificatie</Eyebrow>
        <Toggle
          checked={false}
          label="Authenticatie-app (TOTP)"
          hint="Scan de QR-code met Google Authenticator, 1Password of vergelijkbaar."
          disabled
        />
        <StubNotice what="2FA-setup via better-auth TOTP — komt binnenkort." />
      </Card>

      <Card className="grid gap-4">
        <Eyebrow className="mb-0">Huishouden</Eyebrow>
        <p className="text-sm text-fg-muted">
          Leden delen potten, regels en transactiegeschiedenis. Ieder lid logt in met een eigen account.
        </p>
        {live && (membersQuery.data?.length ?? 0) > 0 ? (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {(membersQuery.data ?? []).map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                  <p className="truncate text-xs text-fg-muted">{m.email}</p>
                </div>
                <Badge>{m.role}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <StubNotice what="Leden verschijnen hier zodra je een huishouden hebt." />
        )}
        <Field label="Uitnodigen (e-mail)" htmlFor="invite-email">
          <Input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="partner@example.com"
            disabled={!live}
          />
        </Field>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            disabled={!live || invite.isPending || !inviteEmail.includes('@')}
            onClick={() => invite.mutate()}
          >
            {invite.isPending ? 'Bezig…' : 'Uitnodigen'}
          </Button>
        </div>
      </Card>

      <DangerZone
        title="Account verwijderen"
        body="Je huishouden, potten en volledige transactiegeschiedenis worden verwijderd. Dit kan niet ongedaan worden gemaakt — exporteer eerst je data."
        action="Account verwijderen"
        onAction={() =>
          showToast('Account verwijderen komt later — exporteer eerst je data.', 'info')
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
    mockJars.map((j) => ({
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
    live,
  );

  const jars = jarsQuery.data ?? [];
  const [pct, setPct] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!jars.length) return;
    setPct(Object.fromEntries(jars.map((j) => [j.id, j.percentage])));
  }, [jars]);

  const total = Object.values(pct).reduce((s, n) => s + n, 0);
  const balanced = Math.abs(total - 100) < 0.01;

  const incomeQuery = useLiveQuery(
    api.money.income.list.queryOptions({ input: { householdId: householdId! } }),
    [],
    live,
  );
  const monthlyNet = useMemo(() => {
    if (!live) {
      return mockJars.reduce((s, j) => s + j.allocated, 0);
    }
    return (incomeQuery.data ?? [])
      .filter((s) => s.active)
      .reduce((sum, s) => sum + s.amount, 0);
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
      void queryClient.invalidateQueries({ queryKey: api.money.jars.list.key() });
      void queryClient.invalidateQueries({ queryKey: api.money.jars.balances.key() });
      showToast('Verdeling opgeslagen', 'success');
    },
    onError: () => showToast('Verdeling opslaan mislukt', 'error'),
  });

  function resetDefaults() {
    const next: Record<string, number> = {};
    for (const jar of jars) {
      next[jar.id] = DEFAULT_JAR_SPLIT[jar.key as JarKey] ?? jar.percentage;
    }
    setPct(next);
  }

  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Geld" title="Potten">
        <p className="text-sm text-fg-muted">
          De verdeling bepaalt waar inkomen heen gaat op het moment dat het binnenkomt. Alles samen
          moet exact 100% zijn — anders raakt er geld zoek of ontstaat het uit niets.
        </p>
      </Section>

      <Card className="flex items-center justify-between">
        <p className="text-sm font-semibold text-fg">Totaal</p>
        <Badge tone={balanced ? 'success' : 'danger'}>{formatPercent(total)}</Badge>
      </Card>

      <Card className="grid gap-5">
        {jars.map((jar) => {
          const value = pct[jar.id] ?? jar.percentage;
          const allocated = Math.round((monthlyNet * value) / 100);
          return (
            <div key={jar.id} className="grid gap-2">
              <div className="flex items-end justify-between gap-4">
                <Field label={`${jar.icon ?? ''} ${jar.name}`.trim()} htmlFor={`pct-${jar.id}`}>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`pct-${jar.id}`}
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={value}
                      onChange={(e) =>
                        setPct((prev) => ({
                          ...prev,
                          [jar.id]: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-fg-muted">%</span>
                  </div>
                </Field>
                <p className="pb-3 text-sm tabular-nums text-fg-muted">
                  {formatMoney(allocated)} p/m
                </p>
              </div>
              <Meter value={value / 100} tone={JAR_COLOR[jar.key] ?? 'accent'} />
            </div>
          );
        })}
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="ghost" onClick={resetDefaults}>
            Terug naar standaard
          </Button>
          <Button
            disabled={!live || !balanced || saveSplit.isPending}
            onClick={() => saveSplit.mutate()}
          >
            {saveSplit.isPending ? 'Bezig…' : 'Verdeling opslaan'}
          </Button>
        </div>
        {!live ? (
          <StubNotice what="Log in en rond onboarding af om de verdeling te bewaren." />
        ) : null}
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
    live,
  );

  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [kind, setKind] = useState<'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH' | 'INVESTMENT'>(
    'CHECKING',
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
      showToast('Rekening toegevoegd', 'success');
    },
    onError: () => showToast('Rekening toevoegen mislukt', 'error'),
  });

  const accounts = accountsQuery.data ?? [];
  const kindLabel: Record<string, string> = {
    CHECKING: 'Betaalrekening',
    SAVINGS: 'Spaarrekening',
    CREDIT: 'Creditcard',
    CASH: 'Contant',
    INVESTMENT: 'Beleggingsrekening',
  };

  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Geld" title="Bank">
        <p className="text-sm text-fg-muted">
          CSV-import werkt altijd en is de aanbevolen route. Een directe bankkoppeling vereist een
          PSD2-aggregator.
        </p>
      </Section>

      <ListToolbar
        createLabel="+ Rekening toevoegen"
        onCreate={() => setAdding(true)}
      >
        <span className="text-sm font-semibold text-fg">Rekeningen</span>
      </ListToolbar>

      <Card className="p-0">
        {accounts.length === 0 ? (
          <p className="px-5 py-4 text-sm text-fg-muted">Nog geen rekeningen.</p>
        ) : (
          <ul className="divide-y divide-line">
            {accounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{a.name}</p>
                  <p className="truncate font-mono text-xs text-fg-muted">
                    {a.iban ?? 'Geen IBAN'} · {formatMoney(a.balance)}
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
        <p className="text-sm font-semibold text-fg">Rekening toevoegen</p>
        <Field label="Naam" htmlFor="acc-name">
          <Input
            id="acc-name"
            placeholder="Betaalrekening"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!live}
            autoFocus
          />
        </Field>
        <Field label="IBAN" htmlFor="acc-iban" hint="Optioneel — alleen voor herkenning bij import.">
          <Input
            id="acc-iban"
            placeholder="NL00 BANK 0000 0000 00"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            disabled={!live}
          />
        </Field>
        <Field label="Soort" htmlFor="acc-kind">
          <Select
            id="acc-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
            disabled={!live}
          >
            <option value="CHECKING">Betaalrekening</option>
            <option value="SAVINGS">Spaarrekening</option>
            <option value="CREDIT">Creditcard</option>
            <option value="CASH">Contant</option>
            <option value="INVESTMENT">Beleggingsrekening</option>
          </Select>
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setAdding(false)}>
            Annuleren
          </Button>
          <Button
            disabled={!live || createAccount.isPending || !name.trim()}
            onClick={() => createAccount.mutate()}
          >
            {createAccount.isPending ? 'Bezig…' : 'Toevoegen'}
          </Button>
        </div>
      </Card>
      ) : null}

      <Card>
        <Eyebrow className="mb-2">Bankkoppeling</Eyebrow>
        <p className="text-sm text-fg-muted">
          Uitgeschakeld. Enable Banking heeft een gratis &lsquo;restricted production&rsquo;-laag
          voor rekeningen die je zelf koppelt — genoeg voor deze fase.
        </p>
        <div className="mt-4">
          <Button variant="secondary" disabled>
            Bank koppelen
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function GroeiSettings() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Groei" title="Groeiprofiel" />
      <Card>
        <Eyebrow className="mb-2">Inkomensdoel</Eyebrow>
        <Field label="Streefinkomen per maand (netto)" htmlFor="income-goal">
          <Input id="income-goal" type="number" placeholder="5000" disabled />
        </Field>
        <p className="mt-2 text-xs text-fg-muted">Wordt gebruikt als referentie in Groei-grafieken.</p>
      </Card>
      <StubNotice what="Leerdoelen, leeslijst-integratie en passief-inkomen tracker — komen binnenkort." />
    </div>
  );
}

export function EnergieSettings() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Energie" title="Energieprofiel" />
      <Card>
        <Eyebrow className="mb-3">Slaap</Eyebrow>
        <Field label="Slaapstreef (uren)" htmlFor="sleep-goal">
          <Input id="sleep-goal" type="number" min={4} max={12} defaultValue={8} className="w-28" disabled />
        </Field>
      </Card>
      <Card>
        <Eyebrow className="mb-3">Training</Eyebrow>
        <Field label="Trainingen per week" htmlFor="train-goal">
          <Input id="train-goal" type="number" min={0} max={14} defaultValue={4} className="w-28" disabled />
        </Field>
      </Card>
      <StubNotice what="Wearable-integratie (Garmin, Apple Health) en macro-doelen — komen binnenkort." />
    </div>
  );
}

export function ZielSettings() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Ziel" title="Zielprofiel" />
      <Card>
        <Eyebrow className="mb-3">Stiltepraktijk</Eyebrow>
        <Field label="Dagelijks streef (minuten)" htmlFor="mind-goal">
          <Input id="mind-goal" type="number" min={0} max={120} defaultValue={10} className="w-28" disabled />
        </Field>
      </Card>
      <StubNotice what="Intentie-sjablonen, chakra-routing en dankbaarheidsinstellingen — komen binnenkort." />
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
    live,
  );
  const householdQuery = useLiveQuery(
    api.household.current.queryOptions({ input: { householdId: householdId! } }),
    null,
    live,
  );

  const settings = settingsQuery.data;
  const [periodDay, setPeriodDay] = useState(1);
  const [hhName, setHhName] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (settings) setPeriodDay(settings.periodStartDay);
  }, [settings]);

  useEffect(() => {
    if (householdQuery.data) setHhName(householdQuery.data.name);
  }, [householdQuery.data]);

  useEffect(() => {
    const stored = localStorage.getItem('rumbelo-theme');
    setDark(stored === 'dark');
  }, []);

  const savePeriod = useMutation({
    mutationFn: async () => {
      if (!householdId) throw new Error('No household');
      return client.household.updateSettings({
        householdId,
        periodStartDay: periodDay,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
      void queryClient.invalidateQueries({ queryKey: api.household.current.key() });
      showToast('Periode opgeslagen', 'success');
    },
    onError: () => showToast('Periode opslaan mislukt', 'error'),
  });

  const saveHouseholdName = useMutation({
    mutationFn: async () => {
      if (!householdId) throw new Error('No household');
      await updateOrganization(householdId, { name: hhName.trim() });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: api.household.current.key() });
      void queryClient.invalidateQueries({ queryKey: api.household.list.key() });
      showToast('Huishouden bijgewerkt', 'success');
    },
    onError: () => showToast('Huishouden opslaan mislukt', 'error'),
  });

  const saveLocale = useMutation({
    mutationFn: async (next: 'nl' | 'en') => {
      if (!householdId) throw new Error('No household');
      return client.household.updateSettings({ householdId, locale: next });
    },
    onSuccess: (_data, next) => {
      if (locale !== next) toggleLocale();
      void queryClient.invalidateQueries({ queryKey: api.household.settings.key() });
      showToast('Taal opgeslagen', 'success');
    },
    onError: () => showToast('Taal opslaan mislukt', 'error'),
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
    onError: () => showToast('Thema opslaan mislukt', 'error'),
  });

  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Systeem" title="Weergave & periode" />

      <Card>
        <Eyebrow className="mb-3">Thema</Eyebrow>
        <Toggle
          checked={dark}
          label="Donkere modus"
          hint="Wordt lokaal én in huishoudinstellingen bewaard."
          onCheckedChange={(next) => saveTheme.mutate(next ? 'dark' : 'light')}
        />
        <div className="mt-3">
          <Field label="Taal" htmlFor="lang">
            <Select
              id="lang"
              value={settings?.locale ?? locale}
              onChange={(e) => {
                const next = e.target.value as 'nl' | 'en';
                if (live) saveLocale.mutate(next);
                else if (locale !== next) toggleLocale();
              }}
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
            </Select>
          </Field>
          <p className="mt-1.5 text-xs text-fg-muted">
            UI-copy is nog grotendeels Nederlands; de voorkeur wordt al opgeslagen.
          </p>
        </div>
      </Card>

      <Card>
        <Eyebrow className="mb-3">Periode</Eyebrow>
        <Field
          label="Dag waarop de maand omslaat"
          htmlFor="period-day"
          hint="De turn sluit op deze dag. Inkomen dat erna binnenkomt, telt voor de volgende maand."
        >
          <Input
            id="period-day"
            type="number"
            min={1}
            max={28}
            value={periodDay}
            onChange={(e) => setPeriodDay(Math.min(28, Math.max(1, Number(e.target.value) || 1)))}
            className="w-28"
            disabled={!live}
          />
        </Field>
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            disabled={!live || savePeriod.isPending}
            onClick={() => savePeriod.mutate()}
          >
            {savePeriod.isPending ? 'Bezig…' : 'Opslaan'}
          </Button>
        </div>
      </Card>

      <Card>
        <Eyebrow className="mb-3">Huishouden</Eyebrow>
        <Field label="Naam" htmlFor="hh-name">
          <Input
            id="hh-name"
            value={hhName}
            onChange={(e) => setHhName(e.target.value)}
            disabled={!live}
          />
        </Field>
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            disabled={!live || saveHouseholdName.isPending || !hhName.trim()}
            onClick={() => saveHouseholdName.mutate()}
          >
            {saveHouseholdName.isPending ? 'Bezig…' : 'Opslaan'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function PlanSettings() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Plan" title="Abonnement" />
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-fg">Rumbelo Early Access</p>
            <p className="mt-1 text-xs text-fg-muted">
              Je gebruikt Rumbelo gratis in de early-access fase. Het abonnement gaat in wanneer het
              product klaar is voor een bredere groep.
            </p>
          </div>
          <Badge tone="success">Actief</Badge>
        </div>
      </Card>
      <StubNotice what="Stripe-integratie, plan-gates en factuurgeschiedenis — komen binnenkort." />
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
      const jarName = new Map(jars.map((j) => [j.id, j.name]));
      const rows = items.map((t) => ({
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
      downloadTextFile(`rumbelo-transacties-${stamp}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
      showToast(`${rows.length} transacties geëxporteerd`, 'success');
    } catch {
      showToast('CSV-export mislukt', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function exportJson() {
    if (!householdId) return;
    setBusy('json');
    try {
      const [jars, income, fixedCosts, debts, goals, rules, transactions] = await Promise.all([
        client.money.jars.list({ householdId }),
        client.money.income.list({ householdId }),
        client.money.fixedCosts.list({ householdId }),
        client.money.debts.list({ householdId }),
        client.money.goals.list({ householdId }),
        client.money.rules.list({ householdId }),
        client.money.transactions.list({ householdId, limit: 500 }),
      ]);
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
        'application/json',
      );
      showToast('Volledige export gedownload', 'success');
    } catch {
      showToast('JSON-export mislukt', 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-lg gap-6">
      <Section eyebrow="Systeem" title="Export">
        <p className="text-sm text-fg-muted">
          Je data is van jou. Je kunt op elk moment een export downloaden vanuit dit apparaat.
        </p>
      </Section>

      <Card className="grid gap-4">
        <Eyebrow>Transacties</Eyebrow>
        <p className="text-sm text-fg-muted">
          Alle recente transacties, inclusief pot, als CSV.
        </p>
        <Button
          variant="secondary"
          className="w-fit"
          disabled={!live || busy != null}
          onClick={() => void exportCsv()}
        >
          {busy === 'csv' ? 'Bezig…' : 'Downloaden als CSV'}
        </Button>
      </Card>

      <Card className="grid gap-4">
        <Eyebrow>Volledige data</Eyebrow>
        <p className="text-sm text-fg-muted">
          Potten, inkomen, vaste lasten, schulden, doelen, regels en transacties als JSON.
        </p>
        <Button
          variant="secondary"
          className="w-fit"
          disabled={!live || busy != null}
          onClick={() => void exportJson()}
        >
          {busy === 'json' ? 'Bezig…' : 'Downloaden als JSON'}
        </Button>
      </Card>

      {!live ? (
        <StubNotice what="Log in om exports te downloaden." />
      ) : null}
    </div>
  );
}

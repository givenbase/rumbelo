import { SettingsShell } from '@/components/layout/settings-shell';

/**
 * Settings layout — sidebar rail stays mounted; each section is a nested route
 * under `/settings/[section]` (e.g. `/settings/jars`).
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>;
}

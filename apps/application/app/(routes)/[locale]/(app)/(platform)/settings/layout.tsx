import { SettingsShell } from '@/components/layout/settings-shell';

/**
 * Settings layout — sidebar rail stays mounted; each section is a nested route
 * (e.g. `/settings/product/money/jars`, `/settings/general/plan`).
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <SettingsShell>{children}</SettingsShell>;
}

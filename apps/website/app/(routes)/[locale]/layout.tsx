import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Public_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { locales } from '@rumtelo/i18n';

import { Providers } from './providers';

import '../../globals.css';

const display = Bricolage_Grotesque({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    variable: '--font-bricolage',
    display: 'swap',
});
const sans = Public_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-public-sans',
    display: 'swap',
});
const mono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-plex-mono',
    display: 'swap',
});

const TITLE = 'Rumtelo — Stop wondering where it went.';
const DESCRIPTION =
    'Money leaves. You’ll know why. Rumtelo gives every amount a job the second it lands, then widens the picture to your energy, growth and why — with a Coach, in ten minutes a week. Built in Amsterdam. Free to start.';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    applicationName: 'Rumtelo',
    keywords: [
        'money overview',
        'six jars',
        'jar budgeting',
        'personal finance coach',
        'financial freedom',
        'week check',
        'energy sleep money',
        'geld overzicht',
        'potjes methode',
    ],
    openGraph: {
        type: 'website',
        siteName: 'Rumtelo',
        title: TITLE,
        description: DESCRIPTION,
        locale: 'en',
        alternateLocale: ['nl'],
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#EDEFF3' },
        { media: '(prefers-color-scheme: dark)', color: '#0B0F16' },
    ],
};

export function generateStaticParams() {
    return locales.map(locale => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${display.variable} ${sans.variable} ${mono.variable} min-h-dvh bg-bg bg-(image:--gradient-page) font-sans text-fg antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

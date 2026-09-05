import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Public_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { locales } from '@rumbelo/i18n';

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

export const metadata: Metadata = {
    title: 'Rumbelo — Stop wondering where it went.',
    description:
        'Six jars, one calm overview. Rumbelo splits your income the second it lands — every amount gets a job before it arrives.',
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
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{var t=localStorage.getItem('rumbelo-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
                    }}
                />
            </head>
            <body
                className={`${display.variable} ${sans.variable} ${mono.variable} min-h-dvh bg-bg bg-(image:--gradient-page) font-sans text-fg antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

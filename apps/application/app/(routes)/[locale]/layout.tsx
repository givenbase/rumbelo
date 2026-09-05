import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Public_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { Providers } from './providers';

import '../../globals.css';

/**
 * Fonts come from the design: Bricolage Grotesque for display, Public Sans for
 * body, IBM Plex Mono for figures. next/font self-hosts them, so there is no
 * render-blocking request to Google and no layout shift.
 *
 * No `generateStaticParams` here: Next 16.3 fails SSG on `@modal/(...)` intercept
 * routes under `[locale]` ("Could not resolve param value for segment: locale").
 * The app is auth-gated and fine as dynamic.
 *
 * Locale comes from `next/root-params` via `i18n/request.ts` (not `setRequestLocale`).
 */
const display = Bricolage_Grotesque({
    subsets: ['latin'],
    weight: ['500', '600'],
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
    title: { default: 'Rumbelo', template: '%s · Rumbelo' },
    description: 'Control that compounds. Six jars, calm weekly rhythm, room to grow.',
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#EDEFF3' },
        { media: '(prefers-color-scheme: dark)', color: '#0B0F16' },
    ],
};

type LocaleLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${display.variable} ${sans.variable} ${mono.variable} bg-bg font-sans text-fg antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Public_Sans } from 'next/font/google';

import { Providers } from './providers';

import './globals.css';

/**
 * Fonts come from the design: Bricolage Grotesque for display, Public Sans for
 * body, IBM Plex Mono for figures. next/font self-hosts them, so there is no
 * render-blocking request to Google and no layout shift.
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
  description: 'Money with intention. Six jars, one calm overview.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EDEFF3' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F16' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Applied before paint so an explicitly-chosen theme never flashes the
          other palette. Kept inline and tiny for exactly that reason.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('rumbelo-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} bg-bg text-fg font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

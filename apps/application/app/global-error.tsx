'use client';

import { useEffect } from 'react';

import { StatusPage } from '@rumbelo/ui';

import './globals.css';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
                <StatusPage
                    type="error"
                    statusCode={500}
                    errorDetails={error.message}
                    reset={reset}
                    homeHref="/"
                    homeLabel="Back to dashboard"
                />
            </body>
        </html>
    );
}

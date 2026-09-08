'use client';

import { startTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { StatusPage } from '@rumbelo/ui';

import './globals.css';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

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
                    reset={() => {
                        startTransition(() => {
                            router.refresh();
                            reset();
                        });
                    }}
                    homeHref="/"
                    homeLabel="Back to dashboard"
                />
            </body>
        </html>
    );
}

'use client';

import { startTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { StatusPage } from '@rumbelo/ui';

export default function Error({
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
    );
}

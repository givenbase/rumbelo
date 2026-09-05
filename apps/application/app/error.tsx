'use client';

import { useEffect } from 'react';

import { StatusPage } from '@rumbelo/ui';

export default function Error({
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
        <StatusPage
            type="error"
            statusCode={500}
            errorDetails={error.message}
            reset={reset}
            homeHref="/"
            homeLabel="Back to dashboard"
        />
    );
}

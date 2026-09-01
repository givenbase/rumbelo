'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

/**
 * After create/edit success: call optional onSuccess, else router.back()
 * (soft intercept sheet or full-page history).
 */
export function useFormDismiss(onSuccess?: () => void) {
    const router = useRouter();
    return useCallback(() => {
        if (onSuccess) {
            onSuccess();
            return;
        }
        router.back();
    }, [onSuccess, router]);
}

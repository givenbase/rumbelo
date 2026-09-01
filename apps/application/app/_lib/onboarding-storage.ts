const KEY = 'rumbelo.onboarding.done';

export function isOnboardingDone(): boolean {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(KEY) === '1';
}

export function markOnboardingDone(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, '1');
}

export function resetOnboarding(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
}

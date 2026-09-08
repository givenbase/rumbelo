/**
 * Coach guides preference — on-screen why-lines & jar cards (same voice as /product/coach).
 * Shared across Help, Settings → Account, and page surfaces.
 */

export const HELPERS_STORAGE_KEY = 'rumbelo:helpers-enabled';
export const HELPERS_CHANGE_EVENT = 'rumbelo:helpers-change';

/** Default on so first-time users see guides; Help/Settings can turn off. */
export const HELPERS_DEFAULT_ENABLED = true;

export function readHelpersEnabled(): boolean {
    if (typeof window === 'undefined') return HELPERS_DEFAULT_ENABLED;
    try {
        const raw = window.localStorage.getItem(HELPERS_STORAGE_KEY);
        if (raw === null) return HELPERS_DEFAULT_ENABLED;
        return raw === '1' || raw === 'true';
    } catch {
        return HELPERS_DEFAULT_ENABLED;
    }
}

export function writeHelpersEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(HELPERS_STORAGE_KEY, enabled ? '1' : '0');
    } catch {
        /* ignore quota / private mode */
    }
    // Always notify same-tab listeners (even if storage write failed).
    try {
        window.dispatchEvent(new CustomEvent(HELPERS_CHANGE_EVENT, { detail: { enabled } }));
    } catch {
        /* ignore */
    }
}

/** Subscribe for useSyncExternalStore — storage (other tabs) + same-tab custom event. */
export function subscribeHelpersEnabled(onStoreChange: () => void): () => void {
    if (typeof window === 'undefined') return () => undefined;

    const onStorage = (event: StorageEvent) => {
        if (event.key === HELPERS_STORAGE_KEY || event.key === null) onStoreChange();
    };
    const onCustom = () => onStoreChange();

    window.addEventListener('storage', onStorage);
    window.addEventListener(HELPERS_CHANGE_EVENT, onCustom as EventListener);
    return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener(HELPERS_CHANGE_EVENT, onCustom as EventListener);
    };
}

export function getHelpersServerSnapshot(): boolean {
    return HELPERS_DEFAULT_ENABLED;
}

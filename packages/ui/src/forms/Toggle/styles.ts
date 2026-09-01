import { cn } from '@rumbelo/utils';

export function toggleTrackClass(checked: boolean) {
    return cn(
        'relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-accent' : 'bg-sunken'
    );
}

export function toggleThumbClass(checked: boolean) {
    return cn(
        'absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow-md transition-transform',
        checked ? 'translate-x-4' : 'translate-x-0'
    );
}

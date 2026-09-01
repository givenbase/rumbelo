import { cn } from '@rumbelo/utils';

export const meterTrackClass = 'h-2 w-full overflow-hidden rounded-full bg-sunken';

export function meterFillClass(tone: string) {
  return cn(
    'h-full rounded-full transition-[width] duration-500 ease-out',
    tone === 'danger' ? 'bg-danger' : tone === 'accent' ? 'bg-accent' : tone,
  );
}

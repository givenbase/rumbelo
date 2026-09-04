import { Logger } from '@nestjs/common';
import { format as formatDateFns, isValid, parseISO } from 'date-fns';

const logger = new Logger('DateUtils');

export const DATE_FORMATS = {
    ISO: 'yyyy-MM-dd',
    ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    DB: 'yyyy-MM-dd',
} as const;

/**
 * Calendar day as YYYY-MM-DD using local calendar (not UTC `toISOString`),
 * so timezone offsets do not shift the booked_on / ritual day.
 */
export function formatToISODate(date?: Date | null | string): null | string {
    if (!date) return null;

    try {
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
            return date.trim();
        }

        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            logger.warn(`Invalid date: ${date}`);
            return null;
        }

        return formatDateFns(dateObj, DATE_FORMATS.ISO);
    } catch (error) {
        logger.warn(`Failed to format date: ${date}`, error);
        return null;
    }
}

export function parseISODate(value: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return null;
    const parsed = parseISO(value.trim());
    return isValid(parsed) ? parsed : null;
}

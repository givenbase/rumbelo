import { Logger } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const logger = new Logger('TimezoneUtils');

export const DEFAULT_TIMEZONE = 'UTC';

export const COMMON_TIMEZONES = {
    UTC: 'UTC',
    AMSTERDAM: 'Europe/Amsterdam',
    LONDON: 'Europe/London',
} as const;

/** Start of calendar day in `userTimezone`, as UTC Date for DB queries. */
export function getStartOfDayInTimezone(userTimezone?: string, date?: Date): Date {
    try {
        const timezone = userTimezone || DEFAULT_TIMEZONE;
        const targetDate = date || new Date();
        const zonedDate = toZonedTime(targetDate, timezone);
        return fromZonedTime(startOfDay(zonedDate), timezone);
    } catch (error) {
        logger.warn(`getStartOfDayInTimezone failed, falling back to UTC`, error);
        return startOfDay(date || new Date());
    }
}

/** End of calendar day in `userTimezone`, as UTC Date for DB queries. */
export function getEndOfDayInTimezone(userTimezone?: string, date?: Date): Date {
    try {
        const timezone = userTimezone || DEFAULT_TIMEZONE;
        const targetDate = date || new Date();
        const zonedDate = toZonedTime(targetDate, timezone);
        return fromZonedTime(endOfDay(zonedDate), timezone);
    } catch (error) {
        logger.warn(`getEndOfDayInTimezone failed, falling back to UTC`, error);
        return endOfDay(date || new Date());
    }
}

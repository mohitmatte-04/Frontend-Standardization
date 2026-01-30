import { format as dateFnsFormat, formatDistance, formatRelative } from 'date-fns';

/**
 * Format a date to a string
 * @param date - Date to format
 * @param formatString - Format pattern (default: 'MMM dd, yyyy')
 */
export function formatDate(
    date: Date | string | number,
    formatString: string = 'MMM dd, yyyy'
): string {
    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return dateFnsFormat(dateObj, formatString);
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param date - Date to format
 */
export function formatRelativeTime(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Format date relative to now with context (e.g., "yesterday at 3:20 PM")
 * @param date - Date to format
 */
export function formatRelativeDate(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return formatRelative(dateObj, new Date());
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const today = new Date();
    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
}

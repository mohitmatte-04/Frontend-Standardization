/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Format a number with thousand separators
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 */
export function truncate(
    str: string,
    length: number,
    suffix: string = '...'
): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function titleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}

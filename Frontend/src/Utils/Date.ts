/**
 * Utility functions for formatting and evaluating vacation date ranges.
 *
 * This module provides helper functions for:
 * - Formatting vacation start and end dates into readable strings
 * - Checking if a vacation is currently active
 * - Checking if a vacation is upcoming (starts in the future)
 *
 *  Example usage:
 * formatRange(vacation.startDate, vacation.endDate);
 * isActiveNow(vacation.startDate, vacation.endDate);
 * isUpcoming(vacation.startDate);
 * 
 * --------
 */

/**
 * Formats a vacation date range into a user-friendly string.
 * Converts both dates to "DD Mon YYYY" format using the `en-GB` locale.
 *
 * @param start - The start date (string or Date object)
 * @param end - The end date (string or Date object)
 * @returns A formatted string like "14 Sep 2025 → 21 Sep 2025"
 */
export function formatRange(start: string | Date, end: string | Date): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    const startStr = startDate.toLocaleDateString("en-GB", options); // e.g. 14 Sep 2025
    const endStr = endDate.toLocaleDateString("en-GB", options);

    return `${startStr} → ${endStr}`;
}

/**
 * Determines if the current date is within the given start and end range (inclusive).
 *
 * @param start - The vacation start date
 * @param end - The vacation end date
 * @returns `true` if now is between start and end, else `false`
 */
export function isActiveNow(start: string | Date, end: string | Date): boolean {
    const now = new Date();
    return new Date(start) <= now && now <= new Date(end);
}

/**
 * Determines if the vacation starts in the future (not yet active).
 *
 * @param start - The vacation start date
 * @returns `true` if the start date is in the future, else `false`
 */
export function isUpcoming(start: string | Date): boolean {
    const now = new Date();
    return new Date(start) > now;
}

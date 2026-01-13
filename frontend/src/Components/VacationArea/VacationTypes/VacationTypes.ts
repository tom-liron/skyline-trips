/**
 * Shared UI types for the Vacation area.
 * These types are used across filters, cards, and pagination components.
 */

/**
 * Controls vacation filtering in the UI.
 * Used by FiltersBar, VacationsPage, and passed to vacationService.
 *
 * Values:
 * - "all"      → show all vacations
 * - "liked"    → only liked by the user
 * - "active"   → currently ongoing
 * - "upcoming" → future vacations
 */
export type VacationListFilter = "all" | "liked" | "active" | "upcoming";

/**
 * Determines how VacationCard should behave and render.
 * - "user" mode shows the Like button
 * - "admin" mode shows Edit and Delete buttons
 */
export type CardMode = "user" | "admin";

/**
 * A function used by pagination to notify the parent of page changes.
 */
export type PageChange = (page: number) => void;

/**
 * Pagination metadata returned from the backend and used by the Pagination component.
 */
export interface PaginationMeta {
    page: number;        // Current page number
    pageSize: number;    // Items per page (usually 9)
    totalPages: number;  // Total number of pages
    totalCount: number;  // Total number of items (vacations)
}

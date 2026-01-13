/**
 * VacationFilter defines the allowed string values used to filter vacations.
 * These are passed as query parameters to the backend via vacationService.getVacations().
 *
 * Example:
 *   await vacationService.getVacations("liked", page, pageSize);
 *
 * Only the values below are allowed — using others will cause a TypeScript error.
 */
export type VacationFilter = "all" | "liked" | "active" | "upcoming";

/**
 * DTOs (Data Transfer Objects) define the exact data shape sent from the frontend to the backend.
 * They are purpose-specific and include only the required fields for each operation (e.g., add/update).
 * This helps with validation, reduces payload size, and prevents sending unnecessary or sensitive data.
 */

/**
 * DTO for adding a new vacation.
 * Sent from the frontend to the backend.
 * All fields are required.
 */
export interface AddVacationDto {
    destination: string;
    description: string;
    startDate: string; // ISO 8601 date string
    endDate: string;   // ISO 8601 date string
    price: number;
    image: File;       // Required on create (sent as multipart/form-data)
}

/**
 * DTO for updating an existing vacation.
 * Same structure as AddVacationDto, but image is optional.
 */
export interface UpdateVacationDto {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    image?: File;      // Optional on update (if unchanged)
}

/**
 * Metadata returned alongside paginated vacation results.
 * Useful for rendering pagination controls on the frontend.
 */
export interface PaginatedVacationsMeta {
    page: number;        // Current page number
    pageSize: number;    // Number of items per page
    totalPages: number;  // Total number of pages
    totalCount: number;  // Total number of vacation items
}

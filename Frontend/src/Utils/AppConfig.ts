/**
 * Frontend configuration utility for API endpoints and UI defaults.
 * Centralizes URLs for authentication, vacations, and admin reports.
 *
 * Notes:
 * - Vacation images are hosted on Cloudinary.
 * - The frontend renders images directly using `vacation.imageUrl`.
 * - No backend image endpoints are used.
 *
 * Example usage:
 *   fetch(appConfig.vacationsUrl)
 *   <img src={vacation.imageUrl} />
 */

class AppConfig {
    private readonly apiUrl = import.meta.env.VITE_API_URL;

    // Auth:
    public readonly registerUrl = `${this.apiUrl}/api/register`;
    public readonly loginUrl = `${this.apiUrl}/api/login`;

    // Vacations:
    public readonly vacationsUrl = `${this.apiUrl}/api/vacations/`;

    // Reports (admin):
    public readonly vacationsReportCsvUrl = `${this.apiUrl}/api/vacations/report/csv`;
    public readonly vacationsReportJsonUrl = `${this.apiUrl}/api/vacations/report/json`;

    // UI defaults:
    public readonly pageSize = 9;
}

export const appConfig = new AppConfig();
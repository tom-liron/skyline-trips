/**
 * Frontend configuration utility for API endpoints and UI defaults.
 * Centralizes URLs for authentication, vacations, images, and reports.
 * Use the exported `appConfig` singleton throughout the frontend for consistent references.
 *
 * Example usage:
 *   fetch(appConfig.vacationsUrl)
 *   <img src={appConfig.vacationsImagesUrl + imageName} />
 */

class AppConfig {
    private readonly apiUrl = import.meta.env.VITE_API_URL;

    // Auth:
    public readonly registerUrl = `${this.apiUrl}/api/register`;
    public readonly loginUrl = `${this.apiUrl}/api/login`;

    // Vacations:
    public readonly vacationsUrl = `${this.apiUrl}/api/vacations`;

    // Images (TEMP – will be removed when Cloudinary is added):
    public readonly vacationsImagesUrl = `${this.apiUrl}/api/vacations/images/`;

    // Reports (admin):
    public readonly vacationsReportCsvUrl = `${this.apiUrl}/api/vacations/report/csv`;
    public readonly vacationsReportJsonUrl = `${this.apiUrl}/api/vacations/report/json`;

    // UI defaults:
    public readonly pageSize = 9;
}

export const appConfig = new AppConfig();
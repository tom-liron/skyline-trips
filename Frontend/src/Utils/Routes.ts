/**
 * Centralized route definitions for the frontend application.
 * Use these constants for navigation and route matching to avoid hardcoding paths.
 *
 * Example usage:
 *   navigate(routes.login)
 *   <Route path={routes.adminEditVacation} ... />
 */

export const routes = {
    home: "/home",

    // Auth pages
    login: "/auth/login",
    register: "/auth/register",

    // User pages
    vacations: "/vacations",

    // Admin pages
    adminVacations: "/admin/vacations",
    adminEditVacation: "/admin/vacations/:_id/edit", // 👈
    adminNewVacation: "/admin/vacations/new",
    adminReport: "/admin/report",

    // Errors
    forbidden: "/forbidden",
    notFound: "/404",
};

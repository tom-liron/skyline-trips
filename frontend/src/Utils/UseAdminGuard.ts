import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Role } from "../Models/Role";
import type { AppState } from "../Redux/Store";
import { routes } from "./Routes";

/**
 * React hook to restrict access to admin-only routes.
 * - Redirects guests to the home page.
 * - Redirects logged-in non-admin users to the forbidden page.
 * - Intended for use in admin-only pages.
 *
 * Example usage:
 *   useAdmin();
 */

export function useAdminGuard(): void {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // guest → login (preserve target to bounce back after auth)
        if (!user?._id) {
            navigate(routes.home, { replace: true });
            return;
        }

        // logged-in but not admin → forbidden (or routes.vacations if you prefer)
        if (user.roleId !== Role.Admin) {
            navigate(routes.forbidden, { replace: true });
        }
    }, [user?._id, user?.roleId, navigate, location]);
}

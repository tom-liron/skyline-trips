import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { type AppState } from "../Redux/Store";
import { routes } from "./Routes";

/**
 * React hook to protect routes that require authentication.
 * Redirects unauthenticated users to the login page, preserving the original location.
 * Intended for use in protected components/pages.
 *
 * Example usage:
 *   useAuthGuard();
 */

export function useAuthGuard(): void {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user?._id) {
            navigate(routes.login, { state: { from: location }, replace: true });
        }
    }, [user?._id, navigate, location]);
}

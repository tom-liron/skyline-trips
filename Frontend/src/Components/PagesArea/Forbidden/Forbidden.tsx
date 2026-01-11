import { NavLink } from "react-router-dom";
import "./Forbidden.css";
import { useTitle } from "../../../Utils/UseTitle";
import { store } from "../../../Redux/Store";
import { Role } from "../../../Models/Role";

/**
 * Displays a 403 Forbidden page when the user is not authorized to view the requested route.
 *
 * Features:
 * - Sets the page title to "Access Denied"
 * - Shows a message that access is denied
 * - Displays a "Go Back" link based on the user's role:
 *    - Admin → /admin/vacations
 *    - User  → /vacations
 *    - Guest → /home
 */
export function Forbidden() {
    useTitle("Access Denied");

    const user = store.getState().user;
    const backRoute = !user ? "/home" : user.roleId === Role.Admin ? "/admin/vacations" : "/vacations";

    return (
        <div className="Forbidden">
            <h2>403 - Forbidden</h2>
            <p>You don’t have permission to view this page.</p>
            <NavLink to={backRoute}>Go Back</NavLink>
        </div>
    );
}

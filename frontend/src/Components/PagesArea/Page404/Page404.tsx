import { NavLink } from "react-router-dom";
import "./Page404.css";
import { useTitle } from "../../../Utils/UseTitle";
import { store } from "../../../Redux/Store";
import { Role } from "../../../Models/Role";

/*
Page404 is the fallback component shown when no matching route is found.

Features:
- Displays a simple "404" error message with a clear explanation.
- Dynamically determines a "Go Back" link based on user role:
  - Not logged in → redirects to "/home"
  - Admin         → redirects to "/admin/vacations"
  - Regular user  → redirects to "/vacations"
- Uses `useTitle` to update the page title to "Page Not Found"
*/

export function Page404() {
    useTitle("Page Not Found");

    const user = store.getState().user;
    const backRoute = !user ? "/home" : user.roleId === Role.Admin ? "/admin/vacations" : "/vacations";

    return (
        <div className="Page404">

            <h1>404</h1>

            <h2>🚫 The page you’re looking for doesn’t exist.</h2>
            <NavLink to={backRoute}>Go Back</NavLink>

        </div>
    );
}

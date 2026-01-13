import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "../../../Utils/Routes";

// Pages
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Forbidden } from "../../PagesArea/Forbidden/Forbidden";

// Auth
import { Login } from "../../AuthArea/Login/Login";
import { Register } from "../../AuthArea/Register/Register";

// User
import { VacationsListUser } from "../../UserArea/VacationListUser/VacationListUser";

// Admin
import { AddVacation } from "../../AdminArea/AddVacation/AddVacation";
import { EditVacation } from "../../AdminArea/EditVacation/EditVacation";
import { Report } from "../../AdminArea/Report/Report";
import { VacationListAdmin } from "../../AdminArea/VacationListAdmin/VacationListAdmin";

/**
 * App-level route configuration for all public, user, and admin pages.
 * 
 * - Redirects `/` to home.
 * - Organizes routes by category: Public, Auth, User, Admin.
 * - Includes fallback routes: 403 Forbidden, 404 Not Found.
 * - Handles 404 by matching unknown paths with a wildcard.
 */

export function Routing() {
    return (
        <div className="Routing">
            <Routes>
                {/* Default → Home */}
                <Route path="/" element={<Navigate to={routes.home} />} />

                {/* Public */}
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.register} element={<Register />} />

                {/* User pages */}
                <Route path={routes.vacations} element={<VacationsListUser />} />

                {/* Admin pages */}
                <Route path={routes.adminVacations} element={<VacationListAdmin />} />
                <Route path={routes.adminNewVacation} element={<AddVacation />} />
                <Route path={routes.adminEditVacation} element={<EditVacation />} />
                <Route path={routes.adminReport} element={<Report />} />

                {/* Fallbacks */}
                <Route path={routes.forbidden} element={<Forbidden />} />
                <Route path={routes.notFound} element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}

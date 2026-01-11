import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../../../Redux/Store";
import type { UserModel } from "../../../Models/UserModel";
import { Role } from "../../../Models/Role";
import { routes } from "../../../Utils/Routes";

import "./Header.css";

export function Header() {
    const user = useSelector<AppState, UserModel | null>((s) => s.user);
    const [loggingOut, setLoggingOut] = useState(false);

    if (!user) return null;

    const isAdmin = user.roleId === Role.Admin;

    async function handleLogout() {
        if (loggingOut) return;
        setLoggingOut(true);

        // 1) Remove token so next load starts unauthenticated
        localStorage.removeItem("token");

        // 2) Hard redirect to a public route; avoids any guard logic in current tree
        window.location.replace(routes.home);
    }


    return (
        <header className="Header">
            <div className="header-inner">
                <NavLink
                    to={isAdmin ? routes.adminVacations : routes.vacations}
                    className="brand"
                >
                    Skyline Trips
                </NavLink>

                <nav className="nav" aria-label="Primary">
                    {isAdmin && (
                        <>
                            <NavLink to={routes.adminVacations} end>Vacations</NavLink>
                            <NavLink to={routes.adminNewVacation}>Add Vacation</NavLink>
                            <NavLink to={routes.adminReport}>Report</NavLink>
                        </>
                    )}
                </nav>

                <div className="auth" aria-label="User">
                    <span className="greeting">
                        Hello {user.firstName} {user.lastName}
                    </span>
                    <button
                        className="link-like"
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Logging out…" : "Logout"}
                    </button>
                </div>
            </div>
        </header>
    );
}

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../../../Redux/Store";
import type { UserModel } from "../../../Models/UserModel";
import { routes } from "../../../Utils/Routes";
import { NavLink, useNavigate } from "react-router-dom";
import "./Home.css";
import { BackgroundSlideshow } from "../../SharedArea/BackgroundSlideshow/BackgroundSlideshow";
import { Login } from "../../AuthArea/Login/Login";
import { Copyrights } from "../../LayoutArea/Copyrights/Copyrights";
import { useTitle } from "../../../Utils/UseTitle";

/**
 * Home page component for the Skyline Trips application.
 *
 * This component serves as the landing page for unauthenticated users.
 * It displays a background slideshow, branding, and an embedded login form.
 * If a user is already authenticated (i.e., has a valid `_id`), they are automatically redirected to the vacations page.
 *
 * Features:
 * - Background slideshow for visual appeal.
 * - Branding section with title and tagline.
 * - Embedded login form with an option to navigate to the registration page.
 * - Footer with copyright information.
 *
 * Side Effects:
 * - Redirects authenticated users to the vacations route.
 *
 * @component
 * @returns {JSX.Element} The rendered Home page.
 */

/**
 * Home functional component.
 *
 * @returns {JSX.Element} The Home page JSX.
 */
export function Home() {
    // Set the document title to "Home" using a custom hook.
    useTitle("Home");

    // Get the current user from the Redux store.
    const user = useSelector<AppState, UserModel | null>((s) => s.user);

    // React Router navigation hook.
    const navigate = useNavigate();

    // Redirect authenticated users to the vacations page.
    useEffect(() => {
        if (user?._id) navigate(routes.vacations);
    }, [user?._id, navigate]);

    return (
        <div className="Home">
            {/* Background slideshow for visual appeal */}
            <BackgroundSlideshow />

            <section className="home-content">
                <div className="home-left">
                    {/* Branding: Application title and tagline */}
                    <h1 className="brand-title">Skyline Trips</h1>
                    <p className="brand-tagline">Explore your next escape.</p>
                </div>

                <div className="home-right">
                    <div className="auth-card">
                        {/* Embedded login form (no footer, no background) */}
                        <Login embedded withFooter={false} showBackground={false} />
                        <div className="divider"><span>OR</span></div>
                        <div className="register-cta">
                            {/* Call to action for registration */}
                            Don’t have an account?{" "}
                            <NavLink to={routes.register} className="link">Sign up</NavLink>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer with copyright */}
            <footer className="page-footer">
                <Copyrights />
            </footer>
        </div>
    );
}

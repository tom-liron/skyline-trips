import { useForm } from "../../../../node_modules/react-hook-form/dist";
import type { UserModel } from "../../../Models/UserModel";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { NavLink, useNavigate } from "react-router-dom";
import { routes } from "../../../Utils/Routes";
import { BackgroundSlideshow } from "../../SharedArea/BackgroundSlideshow/BackgroundSlideshow";
import "./Login.css";
import { Copyrights } from "../../LayoutArea/Copyrights/Copyrights";
import { store } from "../../../Redux/Store";
import { Role } from "../../../Models/Role";
import { useTitle } from "../../../Utils/UseTitle";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Full login screen or embedded login form depending on props.
 *
 * Behavior:
 * - Authenticates user via `userService.login` and stores the result in Redux.
 * - Redirects based on role (admin → /admin/vacations, user → /vacations).
 * - Optionally displays background slideshow and footer with sign-up link.
 * - Supports `embedded` prop for displaying the form inline (e.g. on Home page).
 * - Toggles password visibility with an eye icon (using `lucide-react`).
 *
 * Data flow:
 * - Uses `react-hook-form` for input handling.
 * - Displays styled notification on success or failure.
 */

/**
 * Props for the `Login` component:
 * - `embedded` — renders only the form (used inline on the Home page).
 * - `withFooter` — whether to show the sign-up link and visual 'OR' divider.
 * - `showBackground` — whether to show the slideshow background (default true).
 */

type Props = {
    embedded?: boolean;
    withFooter?: boolean;
    showBackground?: boolean;
};

export function Login({ embedded = false, withFooter = true, showBackground = true }: Props) {

    useTitle("Login");

    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    function togglePassword() {
        setShowPassword(prev => !prev);
    }

    async function send(user: UserModel) {
        try {
            await userService.login(user);                 // dispatches user into Redux
            const roleId = store.getState().user?.roleId;  // read updated role
            const userInStore = store.getState().user;
            notify.success(`Welcome back ${userInStore?.firstName}!`);

            navigate(roleId === Role.Admin ? routes.adminVacations : routes.vacations);
        } catch (err: any) {
            console.log("FULL ERROR OBJECT:", err);
            console.log("RESPONSE:", err?.response);
            console.log("MESSAGE:", err?.message);

            notify.error(err?.response?.data?.message || "Fallback: You must be logged in.");
        }
    }

    const form = (
        <form className="AuthForm" onSubmit={handleSubmit(send)} >
            <h2 className="title">Log in</h2>

            <label htmlFor="email">Email:</label>
            <input id="email" type="email" autoComplete="email" {...register("email")} required minLength={5} maxLength={100} />

            <label htmlFor="password">Password:</label>
            <div className="password-wrapper">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} required minLength={4} maxLength={128} />
                <span className="eye-icon" onClick={togglePassword}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>

            <div className="actions">
                <button className="primary" type="submit">Login</button>
            </div>

            {withFooter && (
                <>
                    <div className="divider"><span>OR</span></div>
                    <div className="register-cta">
                        Don’t have an account?{" "}
                        <NavLink className="link" to={routes.register}>Sign up</NavLink>
                    </div>
                </>
            )}
        </form>
    );

    // Embedded mode (used on Home): no wrapper, no background
    if (embedded) return form;

    // Full-page mode: optional background + centered card
    return (
        <div className="LoginPage">
            {showBackground && <BackgroundSlideshow />}
            <div className="login-center">
                <div className="auth-card">{form}</div>
            </div>

            <footer className="page-footer">
                <Copyrights />
            </footer>
        </div>
    );
}

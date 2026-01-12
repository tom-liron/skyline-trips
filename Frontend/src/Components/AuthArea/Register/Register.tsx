// src/components/AuthArea/Register/Register.tsx
import { useForm } from "react-hook-form";
import type { UserModel } from "../../../Models/UserModel";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { routes } from "../../../Utils/Routes";
import { BackgroundSlideshow } from "../../SharedArea/BackgroundSlideshow/BackgroundSlideshow";
import "./Register.css";
import { Copyrights } from "../../LayoutArea/Copyrights/Copyrights";
import { NavLink, useNavigate } from "react-router-dom";
import { store } from "../../../Redux/Store";
import { Role } from "../../../Models/Role";
import { useTitle } from "../../../Utils/UseTitle";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Props = { withFooter?: boolean };

/**
 * Full-page register screen with optional footer and background.
 * - Dispatches user to Redux on success.
 * - Uses `notify` for user feedback.
 * - Redirects user to relevant vacation page by role.
 * - Shows password visibility toggle.
 */

export function Register({ withFooter = true }: Props) {
    useTitle("Register");

    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    function togglePassword() {
        setShowPassword(prev => !prev);
    }

    async function send(user: UserModel) {
        try {
            await userService.register(user);                   // dispatches user into Redux
            const roleId = store.getState().user?.roleId;       // read updated role
            notify.success(`Dear ${user.firstName} ${user.lastName}<br/>Welcome to Skyline Trips!`);

            navigate(roleId === Role.Admin ? routes.adminVacations : routes.vacations);
        } catch (err) {
            notify.error((err as Error).message);
        }
    }

    return (
        <div className="RegisterPage">
            <BackgroundSlideshow />

            <div className="register-center">
                <div className="auth-card">
                    <form className="AuthForm" onSubmit={handleSubmit(send)} >
                        <h2 className="title">Create your account</h2>

                        <label>First name:</label>
                        <input type="text" {...register("firstName")} required minLength={2} maxLength={50} />

                        <label>Last name:</label>
                        <input type="text" {...register("lastName")} required minLength={2} maxLength={50} />

                        <label>Email:</label>
                        <input type="email" {...register("email")} required minLength={5} maxLength={100} />

                        <label>Password:</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                {...register("password")}
                                required
                                minLength={4}
                                maxLength={128}
                            />
                            <span className="eye-icon" onClick={togglePassword}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>

                        {withFooter && (
                            <>
                                <div className="divider"><span>OR</span></div>
                                <div className="login-cta">
                                    Already have an account?{" "}
                                    <NavLink className="link" to={routes.login}>Log in</NavLink>
                                </div>
                            </>
                        )}

                        <div className="actions">
                            <button className="primary" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="page-footer">
                <Copyrights />
            </footer>
        </div>
    );
}

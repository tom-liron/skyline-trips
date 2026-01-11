import axios from "axios";
import { jwtDecode } from "jwt-decode"; // npm i jwt-decode
import { UserModel } from "../Models/UserModel";
import { store } from "../Redux/Store";
import { userSlice } from "../Redux/UserSlice";
import { appConfig } from "../Utils/AppConfig";
import type { CredentialsModel } from "../Models/CredentialsModel";
import { routes } from "../Utils/Routes";

/**
 * Service for user authentication and session management.
 * Handles registration, login, logout, and user state initialization from JWT.
 * Updates Redux store and localStorage as needed.
 *
 * Example usage:
 *   await userService.register(user);
 *   await userService.login(credentials);
 *   userService.logout();
 */

class UserService {


    public constructor() {
        // Get token from local storage:
        const token = localStorage.getItem("token");

        // If we have a token:
        if (token) {
            try {
                // Extract user from token:
                const dbUser = jwtDecode<{ user: UserModel }>(token).user;

                // Send to global state:
                store.dispatch(userSlice.actions.initUser(dbUser));
            } catch (err) {
                // Invalid/malformed token in storage → purge it and continue as guest
                console.warn("Invalid JWT in localStorage; clearing token.", err);
                localStorage.removeItem("token");
            }
        }
    }

    // Register a new user:
    public async register(user: UserModel): Promise<void> {

        // Send user to backend:
        const response = await axios.post<string>(appConfig.registerUrl, user);

        // Extract token: 
        const token: string = response.data;

        // Extract user from token: 
        const dbUser = jwtDecode<{ user: UserModel }>(token).user;

        // Send to global state: 
        store.dispatch(userSlice.actions.initUser(dbUser));

        // Save token in local storage: 
        localStorage.setItem("token", token);
    }

    // Login as existing user:
    public async login(credentials: CredentialsModel): Promise<void> {

        // Send user to backend:
        const response = await axios.post<string>(appConfig.loginUrl, credentials);

        // Extract token: 
        const token: string = response.data;

        // Extract user from token: 
        const dbUser = jwtDecode<{ user: UserModel }>(token).user;

        // Send to global state: 
        store.dispatch(userSlice.actions.initUser(dbUser));

        // Save token in local storage: 
        localStorage.setItem("token", token);
    }

    // Logout: 
    public logout(): void {
    store.dispatch(userSlice.actions.logoutUser());
    localStorage.removeItem("token");

    // Navigate to home (non-protected page)
    window.location.href = routes.home; // hard redirect = no race condition
}
}

export const userService = new UserService();

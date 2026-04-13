import axios, { type InternalAxiosRequestConfig } from "axios";
import { store } from "../Redux/Store";
import { userSlice } from "../Redux/UserSlice";
import { routes } from "../Utils/Routes";

/**
 * Axios interceptor for global authentication handling.
 *
 * Responsibilities:
 * - Attaches JWT tokens from localStorage to outgoing requests.
 * - Detects expired or invalid tokens via 401 responses.
 * - Automatically logs the user out and redirects to a non-protected route.
 *
 * Use the exported `interceptor.create()` to enable this behavior globally.
 *
 * Example usage:
 *   interceptor.create();
 *   axios.get(appConfig.vacationsUrl); // includes Authorization header if token exists
 */

class Interceptor {
  // Create interceptor:
  public create(): void {
    // Add our request interceptor to axios:
    axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      // Load token from local storage:
      const token = localStorage.getItem("token");

      // If token exist - send it to backend:
      if (token) {
        // Add token to Authorization header:
        request.headers.Authorization = "Bearer " + token;
      }

      // Return new request object:
      return request;
    });

    // Add our response interceptor to axios:
    axios.interceptors.response.use(
      // If response succeeded - just return it:
      (response) => response,

      // If response failed:
      (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url ?? "";
        const isLoginRequest = requestUrl.includes("/login");

        // Only auto-logout on 401 for requests other than login:
        if (status === 401 && !isLoginRequest) {
          // Clear user state from Redux:
          store.dispatch(userSlice.actions.logoutUser());

          // Remove token from local storage:
          localStorage.removeItem("token");

          // Redirect user to a non-protected page:
          window.location.href = routes.home;
        }

        // Forward the error to the caller:
        return Promise.reject(error);
      },
    );
  }
}

export const interceptor = new Interceptor();

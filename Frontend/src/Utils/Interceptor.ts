import axios, { type InternalAxiosRequestConfig } from "axios";

/**
 * Axios request interceptor for attaching JWT tokens to outgoing requests.
 * Reads the token from localStorage and adds it to the Authorization header if present.
 * Use the exported `interceptor.create()` to enable this behavior globally.
 *
 * Example usage:
 *   interceptor.create();
 *   axios.get(appConfig.vacationsUrl) // will include Authorization header if token exists
 */

class Interceptor {

    // Create interceptor: 
    public create(): void {

        // Add our interceptor to axios: 
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

    }

}

export const interceptor = new Interceptor();

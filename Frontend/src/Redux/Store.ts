import { configureStore } from "@reduxjs/toolkit";
import type { VacationModel } from "../Models/VacationModel";
import type { UserModel } from "../Models/UserModel";
import { vacationSlice } from "./VacationSlice";
import { userSlice } from "./UserSlice";

/**
 * Represents the complete Redux state shape for the application.
 */
export type AppState = {
    vacations: VacationModel[];     // Vacation list (from API or actions)
    user: UserModel | null;         // Logged-in user, or null if logged out
};

/**
 * The main Redux store that combines all slices (vacations, user).
 * - `vacations` is managed by vacationSlice
 * - `user` is managed by userSlice
 */
export const store = configureStore<AppState>({
    reducer: {
        vacations: vacationSlice.reducer,
        user: userSlice.reducer,
    },
});

/**
 * Type-safe dispatch for use in typed hooks (e.g., useAppDispatch)
 */
export type AppDispatch = typeof store.dispatch;

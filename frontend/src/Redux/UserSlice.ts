import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserModel } from "../Models/UserModel";

/**
 * Represents the user state in Redux.
 * - Holds a UserModel object when logged in
 * - Becomes `null` on logout
 */
export type UserState = UserModel | null;

/**
 * Initializes the user state with the logged-in user data.
 */
function initUser(_state: UserState, action: PayloadAction<UserModel>): UserState {
    return action.payload;
}

/**
 * Logs out the user by resetting the state to null.
 */
function logoutUser(): UserState {
    return null;
}

/**
 * Redux slice for managing the authenticated user.
 * Includes actions:
 * - initUser: Set the logged-in user
 * - logoutUser: Clear user state on logout
 */
export const userSlice = createSlice({
    name: "userSlice",
    initialState: null as UserState,
    reducers: {
        initUser,
        logoutUser,
    },
});

import { Role } from "./Role";

/**
 * Represents a logged-in user.
 * Used in Redux and during login/registration flows.
 */
export class UserModel {
    public _id?: string;           // User ID (stringified MongoDB ObjectId)
    public firstName?: string;     // First name (shown in UI, greetings)
    public lastName?: string;      // Last name
    public email?: string;         // Used for login and display
    public password?: string;      // Optional (used only during login/register)
    public roleId?: Role;          // Either Role.User or Role.Admin
}

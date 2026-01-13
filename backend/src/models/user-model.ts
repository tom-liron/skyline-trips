import { model, Document, ObjectId, Schema } from "mongoose";
import { Role } from "./role";

/**
 * Defines the Mongoose schema and TypeScript interface for application users.
 * Used for user registration, authentication, and authorization.
 * Enforces validation for user fields and supports role-based access control.
 *
 * Example usage:
 *   const user = await UserModel.findOne({ email });
 *   user.roleId === Role.Admin
 */

export interface IUserModel extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: Role;
}

export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing first name."],
        maxlength: [50, "First name too long."],
        minlength: [2, "First name too short."],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Missing last name."],
        minlength: [2, "Last name too short."],
        maxlength: [50, "Last name too long."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Missing email."],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Missing password."],
        minlength: [4, "Password must be at least 4 characters long."],
        maxlength: [128, "Password too long."]
    },
    roleId: {
        type: Number,
        enum: Role
    }
}, {
    versionKey: false, // Don't add __v field to each added document.
    toJSON: { virtuals: true }, // include also virtual fields when converting to JSON
    id: false,
    timestamps: true
});

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");

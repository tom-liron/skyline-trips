import { model, Document, Schema } from "mongoose";

/**
 * Defines the Mongoose schema and TypeScript interface for user credentials.
 * Used for validating authentication (login) requests.
 * This model is not persisted as a collection in the database.
 * Enforces validation for email format and password length.
 *
 * Example usage:
 *   credentialsModel.validate({ email, password });
 */

export interface ICredentialsModel extends Document {
    email: string;
    password: string;
}

export const CredentialsSchema = new Schema<ICredentialsModel>({
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
    }
}, { // don't create this model in the database
    autoCreate: false, 
    autoIndex: false
});

export const credentialsModel = model<ICredentialsModel>("credentialsModel", CredentialsSchema);

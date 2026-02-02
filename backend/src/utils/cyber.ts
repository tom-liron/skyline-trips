import { IUserModel } from "../models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { appConfig } from "./app-config";
import { Role } from "../models/role";
import { AuthorizationError } from "../models/client-errors";

/**
 * Provides cryptographic utilities for password hashing, JWT token generation,
 * token verification, and admin role checks. Used for authentication and authorization
 * throughout the backend. Import and use the exported `cyber` singleton.
 */

class Cyber {
  // Hash a plain password with salt
  public hash(plainText: string): string {
    return crypto.createHmac("sha512", appConfig.hashSaltKey).update(plainText).digest("hex");
  }

  // Create a JWT token for a user
  public generateToken(user: IUserModel): string {
    const { password, ...safeUser } = user.toObject();
    const container = { user: safeUser };
    const options: SignOptions = { expiresIn: "3h" };
    return jwt.sign(container, appConfig.jwtSecretKey, options);
  }

  // Decode & verify a JWT token
  public decodeToken(token?: string): { user: IUserModel } {
    if (!token) throw new AuthorizationError("Token missing");
    try {
      const container = jwt.verify(token, appConfig.jwtSecretKey) as { user: IUserModel };
      return container;
    } catch {
      throw new AuthorizationError("Invalid or expired token");
    }
  }

  // Check if user is admin
  public verifyAdmin(user: IUserModel): boolean {
    return user.roleId === Role.Admin;
  }
}

export const cyber = new Cyber();

import { Request, Response, NextFunction } from "express";
import { cyber } from "../utils/cyber";
import { AuthorizationError, ForbiddenError } from "../models/client-errors";
import striptags from "striptags";

/**
 * SecurityMiddleware provides essential security-related middleware functions
 * for verifying user identity, restricting admin-only routes, and preventing
 * cross-site scripting (XSS) attacks.
 *
 * Features:
 * 1. `verifyToken` – Validates the JWT from the Authorization header,
 *    decodes it, and attaches the user object to `res.locals.user`.
 *
 * 2. `verifyAdmin` – Ensures the logged-in user has admin privileges.
 *    Used to protect routes that only admins should access.
 *
 * 3. `preventXssAttack` – Sanitizes all string fields in the request body
 *    by stripping HTML/JS tags to prevent XSS injection.
 *
 * Example usage in a route:
 *   this.router.get("/api/admin/data", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, ...)
 */

class SecurityMiddleware {
  /**
   * Verifies the Authorization header contains a valid Bearer JWT token.
   * Decodes it and attaches the decoded user info to response.locals.user.
   * If invalid or missing, throws an AuthorizationError (401).
   */
  public verifyToken(request: Request, response: Response, next: NextFunction): void {
    try {
      const auth = request.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;

      const decoded = cyber.decodeToken(token); // May throw AuthorizationError (401) if token is missing, invalid, or expired
      response.locals.user = decoded.user;
      next();
    } catch (err) {
      next(err);
    }
  }

  /**
   * Checks if the logged-in user has admin privileges.
   * Must be used after verifyToken.
   * Throws:
   * - AuthorizationError (401) if user is missing.
   * - ForbiddenError (403) if user is not admin.
   */
  public verifyAdmin(request: Request, response: Response, next: NextFunction): void {
    const user = response.locals.user;
    if (!user) return next(new AuthorizationError("Unauthorized")); // 401
    if (!cyber.verifyAdmin(user)) return next(new ForbiddenError("You are not authorized.")); // 403
    next();
  }

  /**
   * Strips HTML tags from all string values in the request body
   * to prevent basic XSS (Cross-Site Scripting) attacks.
   * Only affects string fields; other types are untouched.
   */
  public normalizeTextFields(request: Request, response: Response, next: NextFunction): void {
    for (const prop in request.body) {
      const value = request.body[prop];
      if (typeof value === "string") {
        request.body[prop] = striptags(value);
      }
    }
    next();
  }
}

// Export an instance of the middleware for reuse
export const securityMiddleware = new SecurityMiddleware();

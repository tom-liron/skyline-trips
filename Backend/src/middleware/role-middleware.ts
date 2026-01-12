import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../models/client-errors";
import { Role } from "../models/role";

/**
 * Express middleware for role-based access control.
 *
 * - `preventAdminLike`: Blocks admin users from liking vacations.
 *   Throws ForbiddenError if an admin attempts to like a vacation.
 *
 * Note:
 *   In practice, admins usually won't hit this route (their UI/routes differ),
 *   but this middleware exists as a safety measure to enforce consistency
 *   and protect against misuse or direct API calls.
 *
 * Example usage:
 *   this.router.post("/api/vacations/:_id/like", ..., preventAdminLike, ...)
 */

export function preventAdminLike(request: Request, response: Response, next: NextFunction) {
  if (response.locals.user.roleId === Role.Admin) {
    return next(new ForbiddenError("Admin cannot like vacations."));
  }
  next();
}

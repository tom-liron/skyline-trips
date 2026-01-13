/**
 * Defines user roles for authorization logic.
 * Used to distinguish between admin and regular user permissions.
 *
 * Example usage:
 *   if (user.roleId === Role.Admin) { ... }
 */

export enum Role {
  Admin = 1,
  User = 2,
}

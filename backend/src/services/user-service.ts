import { UserModel, IUserModel } from "../models/user-model";
import { ICredentialsModel } from "../models/credentials-model";
import { AuthorizationError, ValidationError } from "../models/client-errors";
import { Role } from "../models/role";
import { cyber } from "../utils/cyber";

/**
 * Service for user registration and authentication logic.
 * Handles validation, password hashing, role assignment, and JWT token generation.
 * Used by controllers to register new users and authenticate existing users.
 *
 * Example usage:
 *   const token = await userService.register(user);
 *   const token = await userService.login(credentials);
 */

class UserService {
  /**
   * Registers a new user.
   * - Validates user fields.
   * - Checks for duplicate email.
   * - Hashes password.
   * - Assigns default user role.
   * - Saves user to database.
   * - Returns a JWT token for the new user.
   * @param user - The user model instance to register.
   * @returns JWT token string.
   * @throws ValidationError if validation fails or email is taken.
   */
  public async register(user: IUserModel): Promise<string> {
    // Validate fields
    ValidationError.validate(user);

    // Ensure password exists
    if (!user.password) throw new ValidationError("Password is required");

    // Check if email already exists
    const count = await UserModel.countDocuments({ email: user.email }).exec();
    if (count > 0) throw new ValidationError("Email already taken");

    // Default role
    user.roleId = Role.User;

    // Hash password
    user.password = cyber.hash(user.password);

    // Save user
    const savedUser = await user.save();

    // Generate and return JWT token
    const token = cyber.generateToken(savedUser);
    return token;
  }

  /**
   * Authenticates a user by credentials.
   * - Validates credentials.
   * - Hashes password for comparison.
   * - Looks up user by email and hashed password.
   * - Returns a JWT token if authentication succeeds.
   * @param credentials - The credentials model instance.
   * @returns JWT token string.
   * @throws AuthorizationError if authentication fails.
   */
  public async login(credentials: ICredentialsModel): Promise<string> {
    // validate:
    ValidationError.validate(credentials);

    // Hash password for comparison
    credentials.password = cyber.hash(credentials.password);

    // Find user by email and hashed password
    const existingUser = await UserModel.findOne({ email: credentials.email, password: credentials.password }).exec();
    if (!existingUser) throw new AuthorizationError("Incorrect email or password.");

    // Generate and return JWT token
    const token = cyber.generateToken(existingUser);
    return token;
  }
}

export const userService = new UserService();

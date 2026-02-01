import express, { Request, Response, Router } from "express";
import { userService } from "../services/user-service";
import { UserModel } from "../models/user-model";
import { StatusCode } from "../models/status-code";
import { credentialsModel } from "../models/credentials-model";
import { securityMiddleware } from "../middleware/security-middleware";

/**
 * Express controller for user registration and authentication endpoints.
 * Handles POST /api/register and POST /api/login routes.
 * Delegates business logic to userService and returns JWT tokens on success.
 *
 * Example usage:
 *   POST /api/register { firstName, lastName, email, password }
 *   POST /api/login { email, password }
 */

class UserController {
  // Router object - holds all routes:
  public router: Router = express.Router();

  // Authentication routes
  public constructor() {
    this.router.post("/api/register", securityMiddleware.preventXssAttack, this.register);
    this.router.post("/api/login", securityMiddleware.preventXssAttack, this.login);
  }

  // Register a new user:
  private async register(request: Request, response: Response) {
    const user = new UserModel(request.body);
    const token = await userService.register(user);
    response.status(StatusCode.Created).json(token);
  }

  // Login as existing user:
  private async login(request: Request, response: Response) {
    const credentials = new credentialsModel(request.body);
    const token = await userService.login(credentials);
    response.json(token);
  }
}

export const userController = new UserController();

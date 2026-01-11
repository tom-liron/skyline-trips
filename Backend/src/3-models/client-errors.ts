import { StatusCode } from "./status-code";
import { Document, ObjectId } from "mongoose";

/**
 * Defines custom error classes for client-facing errors, with HTTP status codes.
 * Used for consistent error handling and messaging throughout the backend.
 * 
 * Usage example:
 *   throw new ResourceNotFound(id);
 *   throw new ValidationError("Invalid input");
 *   throw new AuthorizationError("Token missing");
 *   throw new ForbiddenError("Access denied");
 */


// Base class for all client errors
abstract class ClientError {
    public status: StatusCode;
    public message: string;
    public constructor(status: StatusCode, message: string) {
        this.status = status;
        this.message = message;
    }
}

// Error for unknown routes (404)
export class RouteNotFound extends ClientError {
    public constructor(method: string, route: string) {
        super(StatusCode.NotFound, `Route ${route} on method ${method} not found.`);
    }
}

// Error for missing resources (404)
export class ResourceNotFound extends ClientError {
    public constructor(_id: string | ObjectId) {
        super(StatusCode.NotFound, `_id ${_id} not found.`);
    }
}

// Error for validation failures (400)
export class ValidationError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }

    public static validate(document: Document): void {
        const error = document.validateSync();
        if (error) {
            const messages = (error as any).errors
                ? Object.values((error as any).errors).map((e: any) => e.message).join(" ")
                : error.message;

            throw new ValidationError(messages);
        }
    }
}

// Error for missing/invalid authentication (401)
export class AuthorizationError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Unauthorized, message);
    }
}

// Error for forbidden actions (403)
export class ForbiddenError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Forbidden, message);
    }
}

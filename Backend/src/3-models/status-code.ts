/**
 * Enumerates HTTP status codes for use in API responses and error handling.
 * Used throughout the backend for consistent status code references.
 *
 * Example usage:
 *   res.status(StatusCode.OK).json(data);
 *   throw new ClientError(StatusCode.BadRequest, "Invalid input");
 */

export enum StatusCode {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500
}

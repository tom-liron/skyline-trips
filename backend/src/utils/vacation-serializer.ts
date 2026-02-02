import { ObjectId } from "mongoose";
import { IVacationModel } from "../models/vacation-model";

/**
 * Utility functions for serializing vacation documents for API responses.
 * Adds computed fields such as `likedByMe` and `likesCount`, and ensures
 * the `_id` is always returned as a string. Removes internal fields not needed
 * by the frontend.
 *
 * Example usage:
 *   const serialized = serializeVacation(vacation, userId);
 *   const list = serializeVacations(vacations, userId);
 */

/**
 * Serializes a single vacation document, adding user-specific and computed fields.
 * @param vacation - The vacation document to serialize.
 * @param userId - The current user's id (normalized string).
 * @returns Serialized vacation object for API response.
 */
export function serializeVacation(vacation: IVacationModel, userId: string) {
  // Convert Mongoose document to plain JS object
  const vacationObj = vacation.toObject();

  // Determine if the current user liked this vacation
  const likedByMe = vacationObj.likedUserIds?.some(
    (id: ObjectId) => id.toString() === userId
  ) ?? false;

  // Count total likes
  const likesCount = vacationObj.likedUserIds?.length ?? 0;

  // Always return id as string for frontend
  const _id = vacationObj._id.toString();

  // Remove internal likedUserIds array from the response
  delete vacationObj.likedUserIds;

  // Return the serialized vacation object with computed fields
  return { ...vacationObj, _id, likedByMe, likesCount };
}

/**
 * Serializes an array of vacation documents.
 * @param vacations - Array of vacation documents.
 * @param userId - The current user's id (normalized string).
 * @returns Array of serialized vacation objects.
 */
export function serializeVacations(vacations: IVacationModel[], userId: string) {
  return vacations.map((v) => serializeVacation(v, userId));
}

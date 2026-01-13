/**
 * Represents a single vacation entity.
 * Includes both raw backend data and client-friendly properties.
 */
export class VacationModel {
  public _id!: string; // Unique identifier (MongoDB ObjectId as string)

  // Basic vacation details:
  public destination?: string;
  public description?: string;

  /**
   * Dates are sent from backend as ISO strings (e.g., "2025-10-12T00:00:00.000Z").
   * Keeping them as strings avoids Date parsing issues.
   */
  public startDate?: string;
  public endDate?: string;

  public price?: number;

  // Optional extra properties added on frontend or computed on backend:
  public likesCount?: number; // Total number of users who liked
  public likedByMe?: boolean; // Whether the logged-in user liked this vacation

  /**
   * Full Cloudinary URL used directly in <img src="...">
   */

  public imageUrl?: string;

  /**
   * Used only on the client for uploading images (e.g., via FormData).
   * Not sent directly in JSON bodies.
   */
  public image?: File;
}

import { cloudinary } from "../utils/cloudinary";
import { ObjectId } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { ResourceNotFound, ValidationError } from "../models/client-errors";
import { FilterType } from "../utils/filter";
import { buildVacationQuery } from "../utils/filter-query";

/**
 * Service layer for vacation-related business logic.
 *
 * Responsibilities:
 * - Fetching vacations with filtering and pagination
 * - Validating vacation data
 * - Uploading images to Cloudinary
 * - Managing likes and admin reports
 *
 * This service contains domain logic only
 * and is independent of HTTP or Express concerns.
 */

class VacationService {
  /**
   * Retrieves vacations with filtering and pagination.
   * @param filter - Filter type ("all", "liked", "active", "upcoming")
   * @param userId - Current user's ObjectId (for "liked" filter)
   * @param page - Page number (1-based)
   * @param pageSize - Number of items per page
   * @returns Object with vacations array and totalCount for pagination
   */
  public async getVacations(
    filter: FilterType,
    userId: ObjectId | null,
    page: number,
    pageSize: number
  ): Promise<{ vacations: IVacationModel[]; totalCount: number }> {
    const query = buildVacationQuery(filter, userId);

    const totalCount = await VacationModel.countDocuments(query).exec();

    const vacations = await VacationModel.find(query)
      .sort({ startDate: 1 }) // ascending startDate
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return { vacations, totalCount };
  }

  /**
   * Retrieves a single vacation by id.
   */
  public async getOneVacation(_id: string | ObjectId): Promise<IVacationModel> {
    const vacation = await VacationModel.findById(_id).exec();
    if (!vacation) throw new ResourceNotFound(_id);
    return vacation;
  }

  /**
   * Adds a new vacation, validates input, and handles image upload.
   */
  public async addVacation(vacation: IVacationModel, image?: UploadedFile): Promise<IVacationModel> {
    // Validate schema with Mongoose:
    ValidationError.validate(vacation);

    // Custom date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(vacation.startDate);
    start.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new ValidationError("Start date cannot be in the past.");
    }

    if (vacation.endDate < vacation.startDate) {
      throw new ValidationError("End date must be after start date.");
    }

    // If image provided, save and assign name
    if (!image) {
      throw new ValidationError("Image is required.");
    }

    vacation.imageUrl = await this.uploadImageToCloudinary(image);

    return vacation.save();
  }

  /**
   * Updates an existing vacation, validates input, and handles image update.
   * Only allowed fields are updated; likedUserIds remain unchanged.
   */
  public async updateVacation(vacation: IVacationModel, image?: UploadedFile): Promise<IVacationModel> {
    // 1. Load existing vacation from DB
    const existingVacation = await VacationModel.findById(vacation._id).exec();
    if (!existingVacation) throw new ResourceNotFound(vacation._id);

    // 2. Apply updated scalar fields
    existingVacation.destination = vacation.destination;
    existingVacation.description = vacation.description;
    existingVacation.startDate = vacation.startDate;
    existingVacation.endDate = vacation.endDate;
    existingVacation.price = vacation.price;

    // 3. Replace image ONLY if new image provided
    if (image) {
      existingVacation.imageUrl = await this.uploadImageToCloudinary(image);
    }

    // 4. Validate FULL, FINAL document
    ValidationError.validate(existingVacation);

    if (existingVacation.endDate < existingVacation.startDate) {
      throw new ValidationError("End date must be after start date.");
    }

    // 5. Save
    return existingVacation.save();
  }

  /**
   * Deletes a vacation and its associated image.
   */
  public async deleteVacation(_id: string | ObjectId): Promise<void> {
    const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
    if (!dbVacation) throw new ResourceNotFound(_id);
  }

  /**
   * Adds the user's id to the likedUserIds array for a vacation.
   * @returns Updated vacation document
   */
  public async likeVacation(vacationId: string | ObjectId, userId: ObjectId): Promise<IVacationModel> {
    const vacation = await VacationModel.findByIdAndUpdate(
      vacationId,
      { $addToSet: { likedUserIds: userId } },
      { returnOriginal: false }
    ).exec();
    if (!vacation) throw new ResourceNotFound(vacationId);
    return vacation;
  }

  /**
   * Removes the user's id from the likedUserIds array for a vacation.
   * @returns Updated vacation document
   */
  public async unlikeVacation(vacationId: string | ObjectId, userId: ObjectId): Promise<IVacationModel> {
    const vacation = await VacationModel.findByIdAndUpdate(
      vacationId,
      { $pull: { likedUserIds: userId } },
      { returnOriginal: false }
    ).exec();
    if (!vacation) throw new ResourceNotFound(vacationId);
    return vacation;
  }

  private async uploadImageToCloudinary(image: UploadedFile): Promise<string> {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "skyline-trips/vacations",
      resource_type: "image",
    });

    return result.secure_url;
  }

  /**
   * Generates a CSV report of all vacations and their like counts.
   * @returns CSV string (with BOM for Excel)
   */
  public async generateVacationsReportCSV(): Promise<string> {
    const vacations = await VacationModel.find().select("destination likedUserIds").exec();

    const header = "destination,likes";

    const rows = vacations.map((v) => {
      const destination = `"${String(v.destination).replace(/"/g, '""')}"`; // escape quotes
      const likes = v.likedUserIds.length;
      return `${destination},${likes}`;
    });

    const csv = [header, ...rows].join("\n");

    return "\uFEFF" + csv; // prepend BOM for Excel
  }

  /**
   * Returns a report of all vacations and their like counts as an array of objects.
   * @returns Array of { destination, likes }
   */
  public async getVacationsReport(): Promise<{ destination: string; likes: number }[]> {
    const vacations = await VacationModel.find().select("destination likedUserIds").exec();
    return vacations.map((v) => ({ destination: v.destination, likes: v.likedUserIds.length }));
  }
}

export const vacationService = new VacationService();

import { ObjectId } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { VacationModel, IVacationModel } from "../3-models/vacation-model";
import { ResourceNotFound, ValidationError } from "../3-models/client-errors";
import { fileSaver } from "uploaded-file-saver";
import { FilterType } from "../2-utils/filter";
import { buildVacationQuery } from "../2-utils/filter-query";

/**
 * Service for vacation CRUD operations, image handling, likes, and reporting.
 * Handles filtering, pagination, validation, and file management for vacation entities.
 * Used by controllers to manage vacation data and business logic.
 *
 * Example usage:
 *   const { vacations, totalCount } = await vacationService.getVacations(filter, userId, page, pageSize);
 *   const vacation = await vacationService.addVacation(vacation, image);
 *   await vacationService.deleteVacation(id);
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
    ): Promise<{ vacations: IVacationModel[], totalCount: number }> {

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
        if (image) vacation.imageName = await fileSaver.add(image);

        return vacation.save();
    }

    /**
     * Updates an existing vacation, validates input, and handles image update.
     * Only allowed fields are updated; likedUserIds remain unchanged.
     */
    public async updateVacation(vacation: IVacationModel, image?: UploadedFile): Promise<IVacationModel> {

        ValidationError.validate(vacation);

        // Custom date validation (allow past start dates when updating)
        if (vacation.endDate < vacation.startDate) {
            throw new ValidationError("End date must be after start date.");
        }

        // If there's a new image, update it
        if (image) {
            const oldImageName = await this.getImageName(vacation._id);
            vacation.imageName = await fileSaver.update(oldImageName!, image);
        }

        // Convert Mongoose document to plain object and exclude likedUserIds
        const { likedUserIds, ...updateData } = vacation.toObject();

        // Update only allowed fields, keep likedUserIds intact
        const dbVacation = await VacationModel.findByIdAndUpdate(
            vacation._id,
            { $set: updateData },
            { new: true } // return the updated document
        ).exec();

        if (!dbVacation) throw new ResourceNotFound(vacation._id);

        return dbVacation;
    }

    /**
     * Deletes a vacation and its associated image.
     */
    public async deleteVacation(_id: string | ObjectId): Promise<void> {
        const oldImageName = await this.getImageName(_id);

        const dbVacation = await VacationModel.findByIdAndDelete(_id, { returnOriginal: false }).exec();
        if (!dbVacation) throw new ResourceNotFound(_id);

        if (oldImageName) await fileSaver.delete(oldImageName);
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

    /**
     * Helper to fetch the current image name for a vacation.
     */
    private async getImageName(_id: string | ObjectId): Promise<string> {
        const vacation = await this.getOneVacation(_id);
        return vacation?.imageName;
    }

    /**
     * Generates a CSV report of all vacations and their like counts.
     * @returns CSV string (with BOM for Excel)
     */
    public async generateVacationsReportCSV(): Promise<string> {
        const vacations = await VacationModel.find().select("destination likedUserIds").exec();

        const header = "destination,likes";

        const rows = vacations.map(v => {
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
        return vacations.map(v => ({ destination: v.destination, likes: v.likedUserIds.length }));
    }

}

export const vacationService = new VacationService();
